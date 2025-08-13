import express from 'express';
import {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../services/products.service.js';

import productModel from '../models/product.model.js';

const router = express.Router();

const productRoutes = (io) => {
  // GET /api/products
  router.get("/", async (req, res) => {
    try {
      const { limit = 10, page = 1, sort, query } = req.query;

      let filter = {};
      if (query) {
        if (query === "true" || query === "false") {
          filter.status = query === "true";
        } else {
          filter.category = query;
        }
      }

      let sortOption = {};
      if (sort) {
        if (sort === "asc") sortOption.price = 1;
        else if (sort === "desc") sortOption.price = -1;
      }

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: sortOption,
        lean: true
      };

      const result = await productModel.paginate(filter, options);

      const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
      const prevLink = result.hasPrevPage
        ? `${baseUrl}?page=${result.prevPage}&limit=${limit}${sort ? `&sort=${sort}` : ""}${query ? `&query=${query}` : ""}`
        : null;
      const nextLink = result.hasNextPage
        ? `${baseUrl}?page=${result.nextPage}&limit=${limit}${sort ? `&sort=${sort}` : ""}${query ? `&query=${query}` : ""}`
        : null;

      res.json({
        status: "success",
        payload: result.docs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink,
        nextLink
      });
    } catch (error) {
      console.error("Error en GET /products:", error);
      res.status(500).json({ status: "error", message: "Error interno del servidor" });
    }
  });

  router.get('/:pid', async (req, res) => {
    try {
      const product = await getProductById(req.params.pid);
      if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
      res.json({ status: 'success', payload: product });
    } catch (error) {
      console.error("Error en GET /products/:pid:", error);
      res.status(400).json({ status: 'error', message: error.message });
    }
  });

  router.post('/', async (req, res) => {
    try {
      const { title, description, code, price, stock, category } = req.body;

      if (!title || !description || !code || price == null || stock == null || !category) {
        return res.status(400).json({
          status: 'error',
          message: 'Todos los campos obligatorios deben completarse'
        });
      }

      const product = await createProduct(req.body);
      io?.emit('updateProducts', {
        id: product._id.toString(),
        title: product.title,
        description: product.description,
        price: product.price
      });
      res.status(201).json({ status: 'success', payload: product });
    } catch (error) {
      console.error("Error en POST /products:", error);
      res.status(400).json({ status: 'error', message: error.message });
    }
  });

  router.put('/:pid', async (req, res) => {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Debe enviar datos para actualizar'
        });
      }

      const updated = await updateProduct(req.params.pid, req.body);
      if (!updated) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });

      res.json({ status: 'success', payload: updated });
    } catch (error) {
      console.error("Error en PUT /products/:pid:", error);
      res.status(400).json({ status: 'error', message: error.message });
    }
  });

  router.delete('/:pid', async (req, res) => {
    try {
      const deleted = await deleteProduct(req.params.pid);
      if (!deleted) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });

      io?.emit('removeProduct', req.params.pid);
      res.status(204).send();
    } catch (error) {
      console.error("Error en DELETE /products/:pid:", error);
      res.status(400).json({ status: 'error', message: error.message });
    }
  });

  router.post('/bulk', async (req, res) => {
    try {
      const products = req.body;
      if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ status: 'error', message: 'Debe enviar un array de productos' });
      }
      const result = await productModel.insertMany(products);
      res.status(201).json({ status: 'success', payload: result });
    } catch (error) {
      console.error("Error en POST /products/bulk:", error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  });

  return router;
};

export default productRoutes;
