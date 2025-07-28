const socket = io();

// Escuchar productos nuevos desde el servidor
socket.on('updateProducts', (product) => {
    const productList = document.getElementById('productList');
    const newItem = document.createElement('li');
    newItem.setAttribute('data-id', product.id);
    newItem.textContent = `${product.title} - Precio: ${product.price}`;
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Eliminar';
    deleteBtn.className = 'deleteBtn';
    newItem.appendChild(deleteBtn);
    productList.appendChild(newItem);
});

// Escuchar productos eliminados
socket.on('removeProduct', (productId) => {
    const productList = document.getElementById('productList');
    const items = productList.querySelectorAll('li');
    items.forEach(item => {
        if (item.dataset.id == productId) {
            productList.removeChild(item);
        }
    });
});

// Crear producto → SOLO llamar a la API
document.getElementById('productForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const price = document.getElementById('price').value;

    const newProduct = {
        title,
        description: "Placeholder",
        price,
        code: Math.random().toString(36).substring(2, 8),
        status: true,
        stock: 10,
        category: "General",
        thumbnails: ["placeholder.jpg"]
    };

    const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
    });

    if (!response.ok) {
        console.error('No se pudo agregar el producto');
    }

    document.getElementById('title').value = '';
    document.getElementById('price').value = '';
});

// Eliminar producto usando API
document.getElementById('productList').addEventListener('click', async function(event) {
    if (event.target.classList.contains('deleteBtn')) {
        const productId = event.target.parentElement.dataset.id;

        const response = await fetch(`/api/products/${productId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            console.error('No se pudo eliminar el producto');
        }
    }
});
