import fs from 'fs';
import path from 'path';
import express from 'express';
const router = express.Router();
import CartManager from '../models/CartManager.js';

// __dirname equivalente en ES Modules
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dataPath = path.join(__dirname, '../../data');

// Asegura archivo de persistencia
if (!fs.existsSync(path.join(dataPath, 'carts.json'))) {
  fs.writeFileSync(path.join(dataPath, 'carts.json'), JSON.stringify([]));
}

const cartManager = new CartManager('./data/carts.json');

const cartRoutes = (io) => {

  // Crear nuevo carrito
  router.post('/', (req, res) => {
    const newCart = cartManager.addCart();
    io.emit('newCart', newCart);
    res.status(201).json(newCart);
  });

  // Obtener carrito por ID
  router.get('/:cid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    if (isNaN(cartId) || cartId <= 0) {
      return res.status(400).json({ error: 'Cart ID must be a positive number.' });
    }

    try {
      const cart = cartManager.getCartById(cartId);
      res.json(cart);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  });

  // Agregar producto a carrito
  router.post('/:cid/product/:pid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);

    if (isNaN(cartId) || cartId <= 0) {
      return res.status(400).json({ error: 'Cart ID must be a positive number.' });
    }

    if (isNaN(productId) || productId <= 0) {
      return res.status(400).json({ error: 'Product ID must be a positive number.' });
    }

    const quantity = req.body.quantity ?? 1;

    if (isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be a positive number.' });
    }

    try {
      const updatedCart = cartManager.addProductToCart(cartId, productId, quantity);
      res.json(updatedCart);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  });

  return router;
};

export default cartRoutes;
