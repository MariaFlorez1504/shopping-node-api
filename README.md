# 📦 Shopping Node API

Servidor Node.js con Express, Handlebars y WebSockets para la gestión de productos y carritos de compra.  
Proyecto académico - CoderHouse - Entrega N°2.

## 🚀 Descripción

Esta API RESTful permite:

- Agregar, listar, modificar y eliminar **productos**.
- Crear carritos de compra y agregarles productos.
- Actualizar la vista de productos en **tiempo real** usando **WebSockets** y **Socket.IO**.
- Renderizar vistas dinámicas con **Handlebars**.

---

## 🗂️ Estructura del proyecto

\`\`\`plaintext
├── app.js              # Archivo principal
├── package.json
├── /src
│   ├── ProductManager.js
│   ├── CartManager.js
│   ├── /routes
│   │   ├── products.js
│   │   ├── carts.js
│   │   ├── views.router.js
│   ├── /views
│   │   ├── home.handlebars
│   │   ├── realTimeProducts.handlebars
│   │   ├── layouts/
|   |          ├── main.handlebars
├── /data               
│   ├── products.json
│   ├── carts.json
├── /public
│   ├── /static
│   │   ├── css/
│   │   ├── img/
│   │   ├── js/
\`\`\`

---

## ⚙️ Instalación

1. Clona el repositorio:
   \`\`\`bash
   git clone https://github.com/MariaFlorez1504/shopping-node-api.git
   cd shopping-node-api
   \`\`\`

2. Instala las dependencias:
   \`\`\`bash
   npm install
   \`\`\`

3. Ejecuta en modo desarrollo con reinicio automático:
   \`\`\`bash
   npm run dev
   \`\`\`
   o en modo producción:
   \`\`\`bash
   npm start
   \`\`\`

---

## 📌 Endpoints REST

### ✅ Productos

- \`GET /api/products\` — Listar todos los productos.
- \`GET /api/products/:pid\` — Obtener producto por ID.
- \`POST /api/products\` — Agregar producto.
- \`POST /api/products/bulk\` — Agregar productos en lote.
- \`PUT /api/products/:pid\` — Actualizar producto.
- \`DELETE /api/products/:pid\` — Eliminar producto.

### ✅ Carritos

- \`POST /api/carts\` — Crear carrito.
- \`GET /api/carts/:cid\` — Ver carrito por ID.
- \`POST /api/carts/:cid/product/:pid\` — Agregar producto a carrito.

---

## 💻 Vistas con Handlebars

- \`GET /\` — Renderiza \`home.handlebars\` con la lista actual de productos.
- \`GET /realtimeproducts\` — Renderiza \`realTimeProducts.handlebars\` que actualiza productos **en tiempo real** con **WebSockets**.

---

## ⚡ WebSockets

- Al agregar/eliminar productos en \`/realtimeproducts\`, la lista se actualiza en todos los clientes conectados **sin recargar** la página.

---

## 📬 Colección Postman

En la carpeta \`/postmanCollection/\` encontrarás una colección lista para importar y probar todos los endpoints.

---

## 👩‍💻 Contribución

¿Quieres contribuir? ¡Perfecto!
1. Haz un fork 🍴
2. Crea tu rama: \`git checkout -b feature/nueva-funcionalidad\`
3. Haz commit de tus cambios: \`git commit -m 'Add nueva funcionalidad'\`
4. Haz push a tu rama: \`git push origin feature/nueva-funcionalidad\`
5. Abre un Pull Request 🚀

---

## 📝 Licencia

Código abierto bajo licencia MIT.

---

## 📫 Contacto

**Maria Fernanda Florez Rodriguez**  
📧 [mafe.florez1504@gmail.com](mailto:mafe.florez1504@gmail.com)

---

> **¡Hecho con ❤️ y café!**
