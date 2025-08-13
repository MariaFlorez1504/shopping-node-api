
# 📦 Shopping Node API

API RESTful para la gestión de productos y carritos de compra, desarrollada con Node.js, Express y MongoDB.
Incluye paginación, filtrado, ordenamiento y vistas renderizadas con Handlebars.

## 📌 Base URL
Por defecto, la API apunta a:

http://localhost:8080
---

## 🚀 Descripción

Esta API RESTful permite:

- Agregar, listar, modificar y eliminar **productos**.
- Crear **carritos de compra** y gestionar sus productos.
- Ver la lista de productos en **tiempo real** gracias a **Socket.IO**.
- Renderizar vistas dinámicas con **Handlebars**.

---

## 🗂️ Estructura del proyecto

```plaintext
├── app.js              # Archivo principal
├── postmanCollection/
│   └── SHOPPING CART API.postman_collection.json   # Colección de Postman
│
├── public/                                         # Archivos estáticos
│   ├── bootstrap/
│   ├── css/
│   ├── img/
│   └── js/
│
├── src/
│   ├── config/
│   │   └── mongo.config.js                         # Configuración de conexión MongoDB
│   ├── controllers/
│   │   ├── carts.controller.js
│   │   └── products.controller.js
│   ├── models/
│   │   ├── Cart.model.js
│   │   ├── CartManager.js
│   │   ├── Product.model.js
│   │   └── ProductManager.js
│   ├── routes/
│   │   ├── carts.routes.js
│   │   ├── products.routes.js
│   │   └── views.router.js
│   ├── services/
│   │   ├── carts.service.js
│   │   └── products.service.js
│   ├── tests/
│   │   ├── CartManager.test.js
│   │   └── productManager.test.js
│   └── views/
│       ├── layouts/
│       │   ├── main.handlebars
│       │   ├── 404.handlebars
│       │   ├── cart.handlebars
│       │   ├── home.handlebars
│       │   ├── products.handlebars
│       │   └── realTimeProducts.handlebars
│
├── README.md
└── .env
```

---

## ⚙️ Instalación

1️⃣ Clona el repositorio:
```bash
git clone https://github.com/MariaFlorez1504/shopping-node-api.git
cd shopping-node-api
```

2️⃣ Instala dependencias:
```bash
npm install
```

3️⃣ Ejecuta el servidor:

- En modo desarrollo (con reinicio automático):
  ```bash
  npm run dev
  ```
- En modo producción:
  ```bash
  npm start
  ```

---

## 📌 Endpoints REST

### 📁 Productos

| Método | Ruta                                               | Descripción                                       |
|--------|----------------------------------------------------|---------------------------------------------------|
| POST   | `/api/products`                                    | Crea un nuevo producto                            |
| GET    | `/api/products?page={n}&limit={m}&sort={y}`           | Obtiene todos los productos con paginación y orden|
| GET    | `/api/products/{productId}`                        | Obtiene un producto por ID                        |
| PUT    | `/api/products/{productId}`                        | Actualiza los datos de un producto                |
| DELETE | `/api/products/{productId}`                        | Elimina un producto                               |
| POST   | `/api/products/bulk`                               | Crea múltiples productos en lote                  |

### 🛒 Carritos

| Método | Ruta                                                            | Descripción                                      |
|--------|------------------------------------------------------------------|--------------------------------------------------|
| POST   | `/api/carts`                                                     | Crea un nuevo carrito                            |
| GET    | `/api/carts/{cartId}`                                            | Obtiene un carrito por ID                        |
| POST   | `/api/carts/{cartId}/product/{productId}`                        | Agrega un producto al carrito                    |
| PUT    | `/api/carts/{cartId}/products/{productId}`                       | Actualiza la cantidad de un producto en el carrito|
| DELETE | `/api/carts/{cartId}/products/{productId}`                       | Elimina un producto del carrito                  |
| DELETE | `/api/carts/{cartId}`                                            | Vacía el carrito                                 |


---

## 💻 Vistas con Handlebars

- `GET /` — Renderiza `home.handlebars` con la lista de productos actual.
- `GET /realtimeproducts` — Renderiza `realTimeProducts.handlebars` con actualización **en tiempo real** vía **WebSockets**.

---

## ⚡ WebSockets

Al agregar o eliminar productos desde `/realtimeproducts`:
- Todos los clientes conectados ven la lista actualizada **al instante**.
- Sin necesidad de recargar la página.

---

## 📬 Colección Postman

En la carpeta `/postmanCollection/` encontrarás la colección lista para importar y testear todos los endpoints.

---

## 📝 Licencia

Código abierto bajo licencia **MIT**.

---

## 📫 Contacto

**Maria Fernanda Florez Rodriguez**  
📧 [mafe.florez1504@gmail.com](mailto:mafe.florez1504@gmail.com)

---

> **Hecho con ❤️, Node.js y café ☕**
