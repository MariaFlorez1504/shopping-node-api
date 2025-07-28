import fs from 'fs';
import path from 'path';
import express from 'express';
const router = express.Router();
import ProductManager from '../models/ProductManager.js';

// Obtener el equivalente de __dirname en ESM
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dataPath = path.join(__dirname, '../../data');

// Ruta donde se almacenarán los productos
if (!fs.existsSync(path.join(dataPath, 'products.json'))) {
    fs.writeFileSync(path.join(dataPath, 'products.json'), JSON.stringify([]));
}
const productManager = new ProductManager('./data/products.json');

// Función que recibe la instancia de io
const productRoutes = (io) => {
    // Rutas para manejar productos
    router.get('/', (req, res) => {
        const products = productManager.getProducts();
        res.json({ products });
    });

    router.get('/:pid', (req, res) => {
        const productId = parseInt(req.params.pid);
        try {
            const product = productManager.getProductById(productId);
            res.json(product);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    });

    router.post('/', (req, res) => {
        try {
            const newProduct = productManager.addProduct(req.body);

            // Emitir el nuevo producto a todos los clientes conectados
            io.emit('updateProducts', newProduct);

            res.status(201).json(newProduct);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    router.post('/bulk', (req, res) => {
        const products = req.body;
        const addedProducts = [];
        const errors = [];

        for (const product of products) {
            try {
                const addedProduct = productManager.addProduct(product);
                addedProducts.push(addedProduct);

                // Emitir cada producto agregado
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

    router.put('/:pid', (req, res) => {
        const productId = parseInt(req.params.pid);
        try {
            const updatedProduct = productManager.updateProduct(productId, req.body);
            res.json(updatedProduct);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    });

    router.delete('/:pid', (req, res) => {
        const productId = parseInt(req.params.pid);
        console.log(`Eliminando producto con ID en delete: ${productId}`);
        try {
            productManager.deleteProduct(productId);

            // Emitir el ID del producto a eliminar a todos los clientes conectados
            io.emit('removeProduct', productId);

            res.sendStatus(204); // Sin contenido
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    });

    return router; // Devolver el router
};

export default productRoutes; // Exportar la función