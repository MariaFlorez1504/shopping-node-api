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

// Crear la carpeta data si no existe
if (!fs.existsSync(dataPath)) {
  fs.mkdirSync(dataPath);
}

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirname, 'public')));

// Configurar Handlebars
app.engine('handlebars', engine({ extname: '.handlebars' }));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'src', 'views'));

// Crear servidor HTTP + socket
const server = http.createServer(app);
const io = new Server(server);

// Rutas
app.use('/', viewsRouter);
app.use('/api/products', productRoutes(io));
app.use('/api/carts', cartRoutes(io));

// Página 404
app.use((req, res) => {
  res.status(404).render('404', { title: '404 - Página no encontrada' });
});

// Configurar WebSocket
io.on('connection', (socket) => {
  console.log('✅ Nuevo cliente conectado vía WebSocket');

  socket.on('newProduct', (productData) => {
    // Validación básica
    if (!productData.title || typeof productData.title !== 'string') {
      console.log('❌ Título inválido al crear producto vía WebSocket');
      return;
    }
    if (isNaN(productData.price) || productData.price <= 0) {
      console.log('❌ Precio inválido al crear producto vía WebSocket');
      return;
    }

    const newProduct = productManager.addProduct({
      ...productData,
      description: "Sin descripción",
      code: `code-${Date.now()}`,
      status: true,
      stock: 10,
      category: "General",
      thumbnails: []
    });

    console.log(`✅ Producto creado: ${newProduct.title} (${newProduct.id})`);
    io.emit('updateProducts', newProduct);
  });

  socket.on('deleteProduct', (productId) => {
    const deleted = productManager.deleteProduct(parseInt(productId));
    if (deleted) {
      console.log(`🗑️ Producto eliminado (ID: ${productId})`);
      io.emit('removeProduct', productId);
    } else {
      console.log(`⚠️ Intento de eliminar producto no existente (ID: ${productId})`);
    }
  });
});

// Iniciar servidor
server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en: http://localhost:${PORT}`);
});
