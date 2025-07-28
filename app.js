import path from 'path';
import fs from 'fs';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import { dirname } from 'path';
import ProductManager from './src/models/ProductManager.js';

import CartManager from './src/models/CartManager.js';
import viewsRouter from './src/routes/views.router.js';
import productRoutes from './src/routes/products.js'; 
import cartRoutes from './src/routes/carts.js'; 

// Obtener el equivalente de __dirname en ESM
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

const dataPath = path.join(__dirname, 'data');

const productManager = new ProductManager('./data/products.json');

// Crear la carpeta si no existe
if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(dataPath);
}

// Middleware para procesar JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirname, 'public'))); // Para archivos estáticos

// Configurar Handlebars como motor de plantillas
app.engine('handlebars', engine({ extname: '.handlebars' }));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'src','views')); // Ruta a las vistas

// Crear un servidor HTTP y configurar Socket.IO
const server = http.createServer(app);
const io = new Server(server);

// Monta el router de vistas
app.use('/', viewsRouter);

// Usar las rutas de productos y carritos
app.use('/api/products', productRoutes(io)); // Pasar io a las rutas
app.use('/api/carts', cartRoutes(io)); // Pasar io a las rutas


app.use((req, res) => {
    res.status(404).render('404', { title: '404 - Página no encontrada' });
});

// Configurar WebSocket
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    // Crear producto (guardado real)
  socket.on('newProduct', (productData) => {
    const newProduct = productManager.addProduct({
      ...productData,
      description: "Sin descripción", // añade campos requeridos si no los recibes del front
      code: `code-${Date.now()}`,
      status: true,
      stock: 10,
      category: "General",
      thumbnails: []
    });
    io.emit('updateProducts', newProduct);
  });

    // Eliminar producto (guardado real)
    socket.on('deleteProduct', (productId) => {
        productManager.deleteProduct(parseInt(productId));
        io.emit('removeProduct', productId);
    });
});

// Iniciar el servidor
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});