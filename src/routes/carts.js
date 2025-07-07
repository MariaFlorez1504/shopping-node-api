const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();
const CartManager = require('../CartManager');
const dataPath = path.join(__dirname, '../../data');
// Ruta donde se almacenarán los carritos
if (!fs.existsSync(path.join(dataPath, 'carts.json'))) {
    fs.writeFileSync(path.join(dataPath, 'carts.json'), JSON.stringify([]));
}
const cartManager = new CartManager('./data/carts.json');

// Rutas para manejar carritos
router.post('/', (req, res) => {
    const newCart = cartManager.addCart();
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

module.exports = router;