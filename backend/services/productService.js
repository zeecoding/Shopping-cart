const { Product } = require('../models/Schemas');

/**
 * Simulates the "DLL" library functions for Product Operations
 * encapsulated in a secure service layer.
 */
class ProductService {
  
  // DLL Function: InsertProduct
  async insertProduct(data) {
    const product = new Product({
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
      category: data.category
    });
    return await product.save();
  }

  // DLL Function: UpdateProduct
  async updateProduct(id, data) {
    const product = await Product.findById(id);
    if (!product) throw new Error('Product not found');

    product.name = data.name || product.name;
    product.description = data.description || product.description;
    product.price = data.price || product.price;
    product.stock = data.stock || product.stock;
    product.category = data.category || product.category;

    return await product.save();
  }

  // DLL Function: DeleteProduct
  async deleteProduct(id) {
    const product = await Product.findById(id);
    if (!product) throw new Error('Product not found');
    
    await Product.deleteOne({ _id: id });
    return { message: 'Product removed' };
  }

  // DLL Function: GetProduct (GetAll)
  async getAllProducts() {
    return await Product.find({});
  }

  // DLL Function: GetProduct (GetOne)
  async getProductById(id) {
    const product = await Product.findById(id);
    if (!product) throw new Error('Product not found');
    return product;
  }
}

module.exports = new ProductService();