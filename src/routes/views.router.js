import { Router } from 'express';
import ProductManager from '../models/ProductManager.js';

// Instancia del router
const router = Router();

// Instancia de ProductManager
const productManager = new ProductManager('./data/products.json');

// Ruta Home
router.get('/', (req, res) => {
  const products = productManager.getProducts();
  res.render('home', { products });
});

// Ruta Real Time Products
router.get('/realtimeproducts', (req, res) => {
  const products = productManager.getProducts();
  res.render('realTimeProducts', { products });
});

export default router;
