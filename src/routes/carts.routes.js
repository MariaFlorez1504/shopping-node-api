import express from 'express';
import mongoose from 'mongoose';
import {
  createCart,
  getCartById,
  addProductToCart,
  updateCart,
  updateProductQuantity,
  deleteProductFromCart,
  clearCart
} from '../services/carts.service.js';
import cartModel from '../models/Cart.model.js';

const router = express.Router();

const cartRoutes = (io) => {
  // Crear un carrito nuevo
  router.post('/', async (req, res) => {
    try {
      const cart = await createCart();
      io?.emit('newCart', cart);
      res.status(201).json({ status: 'success', payload: cart });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'error', message: 'Error creating cart' });
    }
  });

  // Obtener carrito por ID
  router.get('/:cid', async (req, res) => {
    try {
      const { cid } = req.params;

      if (!mongoose.Types.ObjectId.isValid(cid)) {
        return res.status(400).json({ status: 'error', message: 'Invalid cart ID' });
      }

      const cart = await cartModel.findById(cid).populate('products.product');
      if (!cart) {
        return res.status(404).json({ status: 'error', message: 'Cart not found' });
      }

      res.json({ status: 'success', cart });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'error', message: 'Error retrieving cart' });
    }
  });

  // Agregar producto a carrito
  router.post('/:cid/product/:pid', async (req, res) => {
    try {
      const { cid, pid } = req.params;
      let qty = Number(req.body.quantity) || 1;

      if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
        return res.status(400).json({ status: 'error', message: 'Invalid cart or product ID' });
      }
      if (qty < 1) {
        return res.status(400).json({ status: 'error', message: 'Quantity must be at least 1' });
      }

      const cart = await addProductToCart(cid, pid, qty);
      res.json({ status: 'success', payload: cart });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'error', message: 'Error adding product to cart' });
    }
  });

  // Eliminar producto de carrito
  router.delete('/:cid/products/:pid', async (req, res) => {
    try {
      const { cid, pid } = req.params;

      if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
        return res.status(400).json({ status: 'error', message: 'Invalid cart or product ID' });
      }

      const cart = await cartModel.findById(cid);
      if (!cart) {
        return res.status(404).json({ status: 'error', message: 'Cart not found' });
      }

      cart.products = cart.products.filter(p => p.product.toString() !== pid);
      await cart.save();

      res.json({ status: 'success', message: 'Product removed', cart });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'error', message: 'Error removing product from cart' });
    }
  });

  // Reemplazar todos los productos del carrito
  router.put('/:cid', async (req, res) => {
    try {
      const { cid } = req.params;
      const products = req.body.products || [];

      if (!mongoose.Types.ObjectId.isValid(cid)) {
        return res.status(400).json({ status: 'error', message: 'Invalid cart ID' });
      }
      if (!Array.isArray(products)) {
        return res.status(400).json({ status: 'error', message: 'Products must be an array' });
      }

      const cart = await updateCart(cid, products);
      res.json({ status: 'success', payload: cart });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'error', message: 'Error updating cart' });
    }
  });

  // Actualizar cantidad de un producto
  router.put('/:cid/products/:pid', async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;

      if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
        return res.status(400).json({ status: 'error', message: 'Invalid cart or product ID' });
      }
      if (typeof quantity !== 'number' || quantity < 1) {
        return res.status(400).json({ status: 'error', message: 'Quantity must be a positive number' });
      }

      const cart = await cartModel.findById(cid);
      if (!cart) {
        return res.status(404).json({ status: 'error', message: 'Cart not found' });
      }

      const item = cart.products.find(p => p.product.toString() === pid);
      if (!item) {
        return res.status(404).json({ status: 'error', message: 'Product not found in cart' });
      }

      item.quantity = quantity;
      await cart.save();

      res.json({ status: 'success', message: 'Quantity updated', cart });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'error', message: 'Error updating quantity' });
    }
  });

  // Vaciar carrito
  router.delete('/:cid', async (req, res) => {
    try {
      const { cid } = req.params;
      if (!mongoose.Types.ObjectId.isValid(cid)) {
        return res.status(400).json({ status: 'error', message: 'Invalid cart ID' });
      }

      const cart = await clearCart(cid);
      res.json({ status: 'success', payload: cart });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'error', message: 'Error clearing cart' });
    }
  });

  return router;
};

export default cartRoutes;
