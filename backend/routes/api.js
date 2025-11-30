const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const { User, Cart, Order, Product, AuditLog } = require("../models/Schemas");
const { protect, admin } = require("../middleware/auth");
const productService = require("../services/productService");

// --- HELPER: LOGGING FUNCTION ---
const logAction = async (action, email, status, details, req) => {
  try {
    await AuditLog.create({
      action,
      user_email: email,
      status,
      details,
      ip_address: req.ip,
    });
  } catch (err) {
    console.error("Logging failed:", err);
  }
};

// --- AUTHENTICATION ---

// Register
router.post(
  "/register",
  [body("email").isEmail(), body("password").isLength({ min: 6 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { username, email, password, role } = req.body;

    try {
      const userExists = await User.findOne({ email });
      if (userExists)
        return res.status(400).json({ message: "User already exists" });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        role: role || "user",
      });

      await logAction(
        "USER_REGISTER",
        email,
        "SUCCESS",
        `Role: ${user.role}`,
        req
      );

      res
        .status(201)
        .json({ id: user._id, username: user.username, role: user.role });
    } catch (err) {
      res.status(500).json({ message: "Server Error" });
    }
  }
);

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET || "secret_key_change_me",
        { expiresIn: "1h" }
      );

      await logAction("LOGIN", email, "SUCCESS", "User logged in", req);
      res.json({ token, role: user.role });
    } else {
      await logAction(
        "LOGIN_ATTEMPT",
        email,
        "FAILURE",
        "Invalid credentials",
        req
      );
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// --- SECURE PRODUCT OPERATIONS (Admin Only) ---

router.post(
  "/products",
  protect,
  admin,
  [
    body("name").notEmpty(),
    body("price").isNumeric(),
    body("category").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const product = await productService.insertProduct(req.body);
      await logAction(
        "DLL_INSERT_PRODUCT",
        req.user.email,
        "SUCCESS",
        `Added: ${product.name}`,
        req
      );
      res.status(201).json(product);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

router.put("/products/:id", protect, admin, async (req, res) => {
  try {
    const updatedProduct = await productService.updateProduct(
      req.params.id,
      req.body
    );
    await logAction(
      "DLL_UPDATE_PRODUCT",
      req.user.email,
      "SUCCESS",
      `Updated ID: ${req.params.id}`,
      req
    );
    res.json(updatedProduct);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

router.delete("/products/:id", protect, admin, async (req, res) => {
  try {
    const result = await productService.deleteProduct(req.params.id);
    await logAction(
      "DLL_DELETE_PRODUCT",
      req.user.email,
      "SUCCESS",
      `Deleted ID: ${req.params.id}`,
      req
    );
    res.json(result);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

router.get("/products", async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// --- CART OPERATIONS ---

router.get("/cart", protect, async (req, res) => {
  let cart = await Cart.findOne({ user: req.user.id }).populate(
    "items.product"
  );
  if (!cart) cart = await Cart.create({ user: req.user.id, items: [] });
  res.json(cart);
});

router.post("/cart", protect, async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) cart = await Cart.create({ user: req.user.id, items: [] });

    const itemIndex = cart.items.findIndex(
      (p) => p.product.toString() === productId
    );
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Cart Error" });
  }
});

// --- PAYMENT SIMULATION (Step 5: Payment Simulation & Logging) ---
// This endpoint simulates the bank/payment gateway interaction.
router.post("/pay", protect, async (req, res) => {
  const { cardNumber, cvv, amount } = req.body;

  try {
    // 1. Simulate Card Validation
    if (!cardNumber || cardNumber.length < 10 || !cvv) {
      await logAction(
        "PAYMENT_GATEWAY",
        req.user.email,
        "FAILURE",
        "Invalid Card Details",
        req
      );
      return res
        .status(400)
        .json({ message: "Payment Declined: Invalid Card" });
    }

    // 2. Log the simulation event (Requirement 5.4)
    await logAction(
      "PAYMENT_GATEWAY",
      req.user.email,
      "SUCCESS",
      `Simulated charge of $${amount}`,
      req
    );

    // 3. Return success token (simulated)
    res.json({
      message: "Payment Approved",
      transactionId: "TXN-" + Date.now(),
    });
  } catch (err) {
    res.status(500).json({ message: "Payment Simulation Error" });
  }
});

// --- CHECKOUT (Step 3.4: Place Order) ---
// This endpoint handles the actual order placement logic.
router.post("/checkout", protect, async (req, res) => {
  // Check if user selected COD or Card (Card is default if not specified)
  const { paymentMethod } = req.body;

  try {
    // 1. Get Cart
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product"
    );
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // 2. Process Items & Stock
    let orderTotal = 0;
    const orderItems = [];

    for (let item of cart.items) {
      if (!item.product) continue;

      // Stock Check
      if (item.product.stock < item.quantity) {
        return res
          .status(400)
          .json({ message: `Not enough stock for ${item.product.name}` });
      }

      // Deduct stock
      item.product.stock -= item.quantity;
      await item.product.save();

      orderTotal += item.product.price * item.quantity;
      orderItems.push({
        product_name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
      });
    }

    // 3. Create Order
    // If COD, status is 'Pending'. If Card (assumed successful via /pay), status is 'Paid'.
    const orderStatus = paymentMethod === "COD" ? "Pending" : "Paid";

    const order = await Order.create({
      user: req.user.id,
      order_total: orderTotal,
      status: orderStatus,
      items: orderItems,
    });

    // 4. Clear Cart
    cart.items = [];
    await cart.save();

    // 5. Audit Log (Checkout specific)
    await logAction(
      "ORDER_PLACED",
      req.user.email,
      "SUCCESS",
      `Order ID: ${order._id} (${paymentMethod || "Card"})`,
      req
    );

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    console.error(err);
    await logAction(
      "ORDER_ERROR",
      req.user ? req.user.email : "unknown",
      "FAILURE",
      err.message,
      req
    );
    res.status(500).json({ message: "Checkout Failed" });
  }
});

// --- ANALYTICS & DASHBOARD (Admin Only) ---
router.get("/analytics", protect, admin, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();

    const salesStats = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$order_total" } } },
    ]);
    const totalRevenue = salesStats.length > 0 ? salesStats[0].totalRevenue : 0;

    const monthlySales = await Order.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$timestamp" },
            month: { $month: "$timestamp" },
          },
          sales: { $sum: "$order_total" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }, // Sort by Year then Month
    ]);
    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product_name",
          totalSold: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
    ]);

    const categorySales = await Order.aggregate([
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.product_name",
          foreignField: "name",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $group: {
          _id: "$productDetails.category",
          value: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        },
      },
    ]);

    res.json({
      kpi: { totalRevenue, totalOrders, totalProducts },
      monthlySales,
      topProducts,
      categorySales,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Analytics Error" });
  }
});
// --- ORDER MANAGEMENT (Admin Only) --- [NEW SECTION]

// 1. Get All Orders (for Admin Panel Order List)
router.get("/admin/orders", protect, admin, async (req, res) => {
  try {
    // Fetch all orders, sorted by newest first, and populate user details
    const orders = await Order.find({})
      .populate("user", "username email")
      .sort({ timestamp: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders" });
  }
});

// 2. Update Order Status (e.g., Pending -> Shipped)
router.put("/admin/orders/:id/status", protect, admin, async (req, res) => {
  const { status } = req.body; // Expecting { status: 'Shipped' } or 'Paid'
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const oldStatus = order.status;
    order.status = status;
    await order.save();

    await logAction(
      "ORDER_UPDATE",
      req.user.email,
      "SUCCESS",
      `Order ${order._id}: ${oldStatus} -> ${status}`,
      req
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Error updating order" });
  }
});
module.exports = router;
