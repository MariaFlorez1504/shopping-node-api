import path, { dirname } from 'path';
import fs from 'fs';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import { connectMongo } from './src/config/mongo.config.js';
import viewsRouter from './src/routes/views.router.js';
import productRoutes from './src/routes/products.routes.js';
import cartRoutes from './src/routes/carts.routes.js';
import Product from './src/models/Product.model.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Conexión a Mongo
await connectMongo();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirname, 'public')));

// Handlebars
app.engine('handlebars', engine({ extname: '.handlebars' }));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'src', 'views'));

// HTTP + Socket
const server = http.createServer(app);
const io = new Server(server);

// Routers
app.use('/', viewsRouter);
app.use('/api/products', productRoutes(io));
app.use('/api/carts', cartRoutes(io));

// 404
app.use((req, res) => {
  res.status(404).render('404', { title: '404 - Página no encontrada' });
});

// WebSockets (solo para realtimeProducts existente)
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  socket.on('newProduct', async (productData) => {
    try {
      const newProduct = await Product.create({
        ...productData,
        status: productData.status ?? true
      });
      io.emit('updateProducts', {
        id: newProduct._id.toString(),
        title: newProduct.title,
        description: newProduct.description,
        price: newProduct.price
      });
    } catch (err) {
      console.error('WS create error:', err.message);
    }
  });

  socket.on('deleteProduct', async (productId) => {
    try {
      await Product.findByIdAndDelete(productId);
      io.emit('removeProduct', productId);
    } catch (err) {
      console.error('WS delete error:', err.message);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
