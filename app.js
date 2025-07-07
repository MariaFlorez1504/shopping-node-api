const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

const ProductManager = require('./src/ProductManager');
const CartManager = require('./src/CartManager');

const dataPath = path.join(__dirname, 'data');

// crear la carpeta si no existe
if(!fs.existsSync(dataPath)){
    fs.mkdirSync(dataPath);

    if (!fs.existsSync(path.join(dataPath, 'products.json'))) {
        fs.writeFileSync(path.join(dataPath, 'products.json'), JSON.stringify([]));
    }

    if (!fs.existsSync(path.join(dataPath, 'carts.json'))) {
        fs.writeFileSync(path.join(dataPath, 'carts.json'), JSON.stringify([]));
    }
};

// Inicializar los manejadores de productos y carritos
const productManager = new ProductManager(path.join(dataPath, 'products.json'));
const cartManager = new CartManager(path.join(dataPath, 'carts.json'));

// Esto permite a la aplicacion recibir solicitudes en formato JSON
app.use(express.json());


app.get('/', (req, res) => {
    res.send("<h1>Welcome to the Shopping Cart API</h1>");
})


// Rutas para Manejo de Productos
app.get('/api/products', (req, res) => {
    const products = productManager.getProducts();
    res.json({ products });
});

app.get('/api/products/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    try {
        const product = productManager.getProductById(productId);
        res.json(product);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

app.post('/api/products', (req, res) => {
    try {
        const newProduct = productManager.addProduct(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Endpoint para agregar múltiples productos
// Este endpoint recibe un array de productos en el cuerpo de la solicitud
app.post('/api/products/bulk', (req, res) => {
    const products = req.body; //Array de productos
    const addedProducts = [];
    const errors = [];

    for (const product of products) {
        try {
            const addedProduct = productManager.addProduct(product);
            addedProducts.push(addedProduct);
        } catch (error) {
            errors.push({ product, error: error.message });
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({ addedProducts, errors });
    }

    res.status(201).json({ addedProducts });
});

app.put('/api/products/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    try {
        const updatedProduct = productManager.updateProduct(productId, req.body);
        res.json(updatedProduct);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

app.delete('/api/products/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    try {
        productManager.deleteProduct(productId);
        res.sendStatus(204); // Sin contenido
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Rutas para Manejo de Carritos
app.post('/api/carts', (req, res) => {
    const newCart = cartManager.addCart();
    res.status(201).json(newCart);
});

app.get('/api/carts/:cid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    try {
        const cart = cartManager.getCartById(cartId);
        res.json(cart);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

app.post('/api/carts/:cid/product/:pid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    try {
        const updatedCart = cartManager.addProductToCart(cartId, productId, req.body.quantity);
        res.json(updatedCart);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});