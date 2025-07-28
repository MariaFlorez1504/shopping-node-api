import fs from 'fs';
import path from 'path';
import express from 'express';
const router = express.Router();
import CartManager from '../models/CartManager.js';

// Obtener el equivalente de __dirname en ESM
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dataPath = path.join(__dirname, '../../data');

// Ruta donde se almacenarán los carritos
if (!fs.existsSync(path.join(dataPath, 'carts.json'))) {
    fs.writeFileSync(path.join(dataPath, 'carts.json'), JSON.stringify([]));
}
const cartManager = new CartManager('./data/carts.json');

// Función que recibe la instancia de io
const cartRoutes = (io) => {
    // Rutas para manejar carritos
    router.post('/', (req, res) => {
        const newCart = cartManager.addCart();

        // Emitir el nuevo carrito a todos los clientes conectados
        io.emit('newCart', newCart);

        res.status(201).json(newCart);
    });

    router.get('/:cid', (req, res) => {
        const cartId = parseInt(req.params.cid);
        try {
            const cart = cartManager.getCartById(cartId);
            res.json(cart);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    });

    router.post('/:cid/product/:pid', (req, res) => {
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);
        try {
            const updatedCart = cartManager.addProductToCart(cartId, productId, req.body.quantity);
            res.json(updatedCart);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    });

    return router; // Devolver el router
};

export default cartRoutes; // Exportar la función