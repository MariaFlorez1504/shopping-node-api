const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

const ProductManager = require('./src/ProductManager');
const CartManager = require('./src/CartManager');

const productRoutes = require('./src/routes/products');
const cartRoutes = require('./src/routes/carts');

const dataPath = path.join(__dirname, 'data');

// crear la carpeta si no existe
if(!fs.existsSync(dataPath)){
    fs.mkdirSync(dataPath);

};


// Esto permite a la aplicacion recibir solicitudes en formato JSON
app.use(express.json());


app.get('/', (req, res) => {
    res.send("<h1>Welcome to the Shopping Cart API</h1>");
})


// Usar las rutas de productos y carritos
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});