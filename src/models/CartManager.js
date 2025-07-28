import fs from 'fs';
import path from 'path';

class CartManager {
  constructor(filePath) {
    this.path = filePath; // Ruta donde se almacenarán los carritos
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
    this.loadCarts(); 
    const cart = this.carts.find(cart => cart.id === id);
    if (!cart) {
      throw new Error('Cart not found');
    }
    return cart;
  }

  addProductToCart(cid, pid, quantity = 1) {
    this.loadCarts(); 
    const cart = this.getCartById(cid);

    const productIndex = cart.products.findIndex(product => product.id === pid);

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
