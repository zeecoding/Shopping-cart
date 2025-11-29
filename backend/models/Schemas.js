const mongoose = require('mongoose');

// --- User Schema ---
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

// --- Product Schema ---
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, index: true },
  createdAt: { type: Date, default: Date.now }
});

// --- Cart Schema ---
const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 }
  }]
});

// --- Order Schema ---
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  order_total: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Paid', 'Shipped'], default: 'Pending' },
  items: [{
    product_name: String,
    price: Number,
    quantity: Number
  }],
  timestamp: { type: Date, default: Date.now }
});

// --- Audit Log Schema (NEW: For Step 5.4) ---
const auditLogSchema = new mongoose.Schema({
  action: { type: String, required: true }, // e.g., "LOGIN_ATTEMPT", "DLL_INSERT"
  user_email: { type: String }, // Store email even if login fails
  status: { type: String, enum: ['SUCCESS', 'FAILURE'], required: true },
  details: { type: String }, // Extra info like "Wrong password" or "Added Laptop"
  ip_address: String,
  timestamp: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Cart = mongoose.model('Cart', cartSchema);
const Order = mongoose.model('Order', orderSchema);
const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = { User, Product, Cart, Order, AuditLog };