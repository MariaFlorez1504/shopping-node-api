# API de Gestión de Productos y Carritos de Compra

## Descripción

Esta es una API RESTful desarrollada en Node.js y Express que permite gestionar productos y carritos de compra. La API incluye funcionalidades para agregar, consultar, modificar y eliminar productos, así como crear y gestionar carritos de compra.

## Características

- **Gestión de Productos**:
  - Agregar nuevos productos.
  - Consultar todos los productos.
  - Consultar un producto específico por ID.
  - Actualizar información de un producto.
  - Eliminar un producto.

- **Gestión de Carritos**:
  - Crear nuevos carritos.
  - Consultar productos en un carrito específico.
  - Agregar productos a un carrito, con la opción de incrementar la cantidad de productos.


## Instalación

1. **Clonar el repositorio**:

   ```bash
   git clone https://github.com/MariaFlorez1504/shopping-node-api
   cd shopping-node-api
   
2. **Instalar dependencias**:

    ```bash
    npm install
3. **Iniciar el servidor**:
   
    ```bash
    node app.js
La API se ejecutará en **http://localhost:8080**


## Uso de la Colección de Postman


En la carpeta postmanCollection, encontrarás una colección de Postman que incluye todos los endpoints disponibles en la API. Para usarla:

1. Abre Postman.
2. Importa la colección desde el archivo Postman_Collection.json.
3. Realiza las pruebas de los endpoints según lo requieras.

   
## Endpoints

**Productos**

1. GET /api/products: Listar todos los productos.
2. GET /api/products/:pid: Obtener un producto específico por ID.
3. POST /api/products: Agregar un nuevo producto.
4. POST /api/products/bulk: Agregar múltiples productos.
5. PUT /api/products/:pid: Actualizar un producto por ID.
6. DELETE /api/products/:pid: Eliminar un producto por ID.


**Carritos**

1. POST /api/carts: Crear un nuevo carrito.
2. GET /api/carts/:cid: Listar productos en un carrito específico.
3. POST /api/carts/:cid/product/:pid: Agregar un producto a un carrito.


## Contacto
Para más información, no dudes en contactar a mafe.florez1504@gmail.com




