import fs from 'fs';

class CartManager {
  constructor(filePath) {
    this.path = filePath; // Ruta de persistencia
    this.carts = [];
    this.loadCarts();
  }

  loadCarts() {
    if (fs.existsSync(this.path)) {
      const data = fs.readFileSync(this.path, 'utf-8');
      if (data.trim() === '') {
        this.carts = [];
        return;
      }
      this.carts = JSON.parse(data);
    } else {
      this.carts = [];
    }
  }

  saveCarts() {
    fs.writeFileSync(this.path, JSON.stringify(this.carts, null, 2));
  }

  addCart() {
    this.loadCarts();
    const newCart = {
      id: this.carts.length > 0 ? this.carts[this.carts.length - 1].id + 1 : 1,
      products: []
    };
    this.carts.push(newCart);
    this.saveCarts();
    return newCart;
  }

  getCartById(id) {
    if (typeof id !== 'number' || id <= 0) {
      throw new Error('Cart ID must be a positive number.');
    }
    const cart = this.carts.find(c => c.id === id);
    if (!cart) {
      throw new Error('Cart not found.');
    }
    return cart;
  }

  addProductToCart(cid, pid, quantity = 1) {
    this.loadCarts();

    if (typeof cid !== 'number' || cid <= 0) {
      throw new Error('Cart ID must be a positive number.');
    }
    if (typeof pid !== 'number' || pid <= 0) {
      throw new Error('Product ID must be a positive number.');
    }
    if (typeof quantity !== 'number' || quantity <= 0) {
      throw new Error('Quantity must be a positive number.');
    }

    const cart = this.getCartById(cid);

    const productIndex = cart.products.findIndex(p => p.id === pid);

    if (productIndex !== -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ id: pid, quantity });
    }

    this.saveCarts();
    return cart;
  }
}

export default CartManager;
