import fs from 'fs';

class ProductManager {
  constructor(filePath) {
    this.path = filePath; // Ruta del archivo
    this.products = [];
    this.loadProducts();
  }

  loadProducts() {
    if (fs.existsSync(this.path)) {
      const data = fs.readFileSync(this.path, 'utf-8');
      if (data.trim() === '') {
        this.products = [];
        return;
      }
      this.products = JSON.parse(data);
    } else {
      this.products = [];
    }
  }

  saveProducts() {
    fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
  }

  /**
   * Validar campos requeridos y tipos correctos
   */
  validateProductData({ title, description, price, code, status, stock, category, thumbnails }) {
    if (!title || typeof title !== 'string') {
      throw new Error('Title is required and must be a string.');
    }
    if (!description || typeof description !== 'string') {
      throw new Error('Description is required and must be a string.');
    }
    if (price === undefined || typeof price !== 'number' || price <= 0) {
      throw new Error('Price is required and must be a positive number.');
    }
    if (!code || typeof code !== 'string') {
      throw new Error('Code is required and must be a string.');
    }
    if (typeof status !== 'boolean') {
      throw new Error('Status is required and must be a boolean.');
    }
    if (stock === undefined || typeof stock !== 'number' || stock < 0) {
      throw new Error('Stock is required and must be a non-negative number.');
    }
    if (!category || typeof category !== 'string') {
      throw new Error('Category is required and must be a string.');
    }
    if (!Array.isArray(thumbnails)) {
      throw new Error('Thumbnails must be an array.');
    }
  }

  addProduct(productData) {
    this.validateProductData(productData);

    const existingProduct = this.products.find(p => p.code === productData.code);
    if (existingProduct) {
      throw new Error('The product code already exists.');
    }

    const newProduct = {
      id: this.products.length > 0 ? this.products[this.products.length - 1].id + 1 : 1,
      ...productData
    };

    this.products.push(newProduct);
    this.saveProducts();
    return newProduct;
  }

  getProducts() {
    this.loadProducts();
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find(p => p.id === id);
    if (!product) {
      throw new Error('Product not found.');
    }
    return product;
  }

  updateProduct(id, fields) {
    const product = this.getProductById(id);

    // Prevenir cambios de ID
    if ('id' in fields) {
      throw new Error('ID cannot be modified.');
    }

    // Si actualiza price, validar que sea positivo
    if ('price' in fields && (typeof fields.price !== 'number' || fields.price <= 0)) {
      throw new Error('Price must be a positive number.');
    }

    // Si actualiza stock, validar
    if ('stock' in fields && (typeof fields.stock !== 'number' || fields.stock < 0)) {
      throw new Error('Stock must be a non-negative number.');
    }

    Object.assign(product, fields);
    this.saveProducts();
    return product;
  }

  deleteProduct(id) {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Product not found.');
    }
    this.products.splice(index, 1);
    this.saveProducts();
  }
}

export default ProductManager;
