import fs from 'fs';
import path from 'path';

class ProductManager {
    constructor(filePath) {
        this.path = filePath; // Ruta donde se almacenarán los productos
        this.products = [];
        this.loadProducts();
    }

    loadProducts() {
        if (fs.existsSync(this.path)) {
            const data = fs.readFileSync(this.path, 'utf-8');
            // Verificar si el archivo está vacío
            if (data.trim() === '') {
                this.products = [];
                return;
            }
            this.products = JSON.parse(data);
        } else {
            this.products = [];
        }
    }

    saveProducts() {
        
        fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
    }

    addProduct({ title, description, price, code, status, stock, category, thumbnails }) {
        if (!title || !description || !price || !code || status === undefined || stock === undefined || !category || !thumbnails) {
            throw new Error('All fields are required.');
        }

        const existingProduct = this.products.find(product => product.code === code);
        if (existingProduct) {
            throw new Error('The product code already exists.');
        }

        const newProduct = {
            id: this.products.length > 0 ? this.products[this.products.length - 1].id + 1 : 1,
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails
        };

        this.products.push(newProduct);
        this.saveProducts();
        return newProduct;
    }

    getProducts() {
        this.loadProducts();
        return this.products;
    }


    getProductById(id) {
        const product = this.products.find(product => product.id === id);
        if (!product) {
            throw new Error('Not found');
        }
        return product;
    }

    updateProduct(id, fields) {
        const product = this.getProductById(id);
        Object.assign(product, fields); // Actualizar solo los campos proporcionados
        this.saveProducts();
        return product;
    }

    deleteProduct(id) {
        console.log(`Eliminando producto con ID en deleteProduct: ${id}`);
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex === -1) {
            throw new Error('Not found');
        }
        this.products.splice(productIndex, 1);
        this.saveProducts();
    }
}

export default ProductManager;