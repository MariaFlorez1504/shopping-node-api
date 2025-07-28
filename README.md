
# 📦 Shopping Node API

Servidor **Node.js** con **Express**, **Handlebars** y **WebSockets** para la gestión de productos y carritos de compra.  
Proyecto académico

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
├── package.json
├── /src
│   ├── /models
│   │   ├── ProductManager.js
│   │   ├── CartManager.js
│   ├── /routes
│   │   ├── products.js
│   │   ├── carts.js
│   │   ├── views.router.js
│   ├── /tests
│   │   ├── productManager.test.js
│   │   ├── cartManager.test.js
│   ├── /views
│   │   ├── home.handlebars
│   │   ├── realTimeProducts.handlebars
│   │   ├── layouts/
│   │   │   ├── main.handlebars
├── /data               
│   ├── products.json
│   ├── carts.json
├── /public
│   ├── /static
│   │   ├── css/
│   │   ├── img/
│   │   ├── js/
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

- `GET /api/products` — Listar todos los productos.
- `GET /api/products/:pid` — Obtener producto por ID.
- `POST /api/products` — Agregar producto.
- `POST /api/products/bulk` — Agregar múltiples productos.
- `PUT /api/products/:pid` — Actualizar un producto.
- `DELETE /api/products/:pid` — Eliminar producto.

### 🛒 Carritos

- `POST /api/carts` — Crear nuevo carrito.
- `GET /api/carts/:cid` — Obtener carrito por ID.
- `POST /api/carts/:cid/product/:pid` — Agregar producto a un carrito.

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
