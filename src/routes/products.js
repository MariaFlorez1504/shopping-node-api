import fs from 'fs';
import path from 'path';
import express from 'express';
const router = express.Router();
import ProductManager from '../models/ProductManager.js';

// __dirname equivalente en ES Modules
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dataPath = path.join(__dirname, '../../data');

// Asegura archivo de persistencia
if (!fs.existsSync(path.join(dataPath, 'products.json'))) {
  fs.writeFileSync(path.join(dataPath, 'products.json'), JSON.stringify([]));
}

const productManager = new ProductManager('./data/products.json');

const productRoutes = (io) => {

  // Obtener todos los productos
  router.get('/', (req, res) => {
    const products = productManager.getProducts();
    res.json({ products });
  });

  // Obtener producto por ID
  router.get('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    if (isNaN(productId) || productId <= 0) {
      return res.status(400).json({ error: 'ID must be a positive number.' });
    }

    try {
      const product = productManager.getProductById(productId);
      res.json(product);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  });

  // Crear nuevo producto
  router.post('/', (req, res) => {
    try {
      const { title, description, price, code, status, stock, category, thumbnails } = req.body;

      // Validar campos obligatorios
      if (!title || !description || !price || !code || status === undefined || stock === undefined || !category || !thumbnails) {
        return res.status(400).json({ error: 'All fields are required.' });
      }

      const newProduct = productManager.addProduct({
        title,
        description,
        price,
        code,
        status,
        stock,
        category,
        thumbnails
      });

      io.emit('updateProducts', newProduct);

      res.status(201).json(newProduct);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Bulk insert con validación individual
  router.post('/bulk', (req, res) => {
    const products = req.body;
    const addedProducts = [];
    const errors = [];

    for (const product of products) {
      try {
        const addedProduct = productManager.addProduct(product);
        addedProducts.push(addedProduct);
        io.emit('updateProducts', addedProduct);
      } catch (error) {
        errors.push({ product, error: error.message });
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ addedProducts, errors });
    }

    res.status(201).json({ addedProducts });
  });

  // Actualizar producto
  router.put('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    if (isNaN(productId) || productId <= 0) {
      return res.status(400).json({ error: 'ID must be a positive number.' });
    }

    try {
      const updatedProduct = productManager.updateProduct(productId, req.body);
      res.json(updatedProduct);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  });

  // Eliminar producto
  router.delete('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    if (isNaN(productId) || productId <= 0) {
      return res.status(400).json({ error: 'ID must be a positive number.' });
    }

    console.log(`Eliminando producto con ID en delete: ${productId}`);

    try {
      productManager.deleteProduct(productId);
      io.emit('removeProduct', productId);
      res.sendStatus(204);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  });

  return router;
};

export default productRoutes;
