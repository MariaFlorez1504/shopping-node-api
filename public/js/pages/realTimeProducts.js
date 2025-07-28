import { toggleButton, validateForm } from '/static/js/shared/validations.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('productForm');
  const productList = document.getElementById('productList');

  if (!form) {
    console.error('❌ No se encontró el formulario con id="productForm"');
    return;
  }

  // 👉 Activa/desactiva el botón mientras escribe
  form.addEventListener('input', () => {
    validateForm();
    toggleButton();
  });


  const socket = io();

  // ⚡ Escucha evento de nuevo producto en tiempo real
  socket.on('updateProducts', (product) => {
    let list = document.getElementById('productList');
    const noProductsMsg = document.querySelector('.no-products');

    if (!list) {
      list = document.createElement('ul');
      list.id = 'productList';

      if (noProductsMsg) {
        noProductsMsg.parentNode.replaceChild(list, noProductsMsg);
      } else {
        document.body.appendChild(list);
      }

      list.addEventListener('click', handleDelete);
    }

    const newItem = document.createElement('li');
    newItem.setAttribute('data-id', product.id);
    newItem.textContent = `${product.title} - ${product.description} - Precio: ${product.price}`;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Eliminar';
    deleteBtn.className = 'deleteBtn';
    newItem.appendChild(deleteBtn);

    list.appendChild(newItem);
  });

  socket.on('removeProduct', (productId) => {
    const list = document.getElementById('productList');
    if (!list) return;

    const items = list.querySelectorAll('li');
    items.forEach(item => {
      if (item.dataset.id == productId) {
        list.removeChild(item);
      }
    });

    // 👇 Si quedó vacío, reemplaza por el mensaje de "no products"
    if (list.children.length === 0) {
      const noProductsMsg = document.createElement('p');
      noProductsMsg.className = 'no-products';
      noProductsMsg.textContent = 'No hay productos en el inventario.';
      list.parentNode.replaceChild(noProductsMsg, list);
    }
  });


  // 📝 Maneja el envío del formulario
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      Swal.fire('Error', 'Corrige los campos marcados', 'error');
      return;
    }

    // Si pasa, arma el objeto
    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const code = document.getElementById('code').value.trim();
    const price = parseFloat(document.getElementById('price').value);
    const stock = parseInt(document.getElementById('stock').value);
    const category = document.getElementById('category').value.trim();
    const thumbnails = document.getElementById('thumbnails').value.trim()
      ? document.getElementById('thumbnails').value.split(',').map(t => t.trim())
      : [];

    const newProduct = {
      title,
      description,
      code,
      price,
      status: true,
      stock,
      category,
      thumbnails
    };

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });

      if (response.ok) {
        Swal.fire('¡Éxito!', 'Producto agregado', 'success');
        form.reset();
        toggleButton(); // Desactiva botón después de limpiar
      } else {
        const data = await response.json();
        Swal.fire('Error', data.error || 'No se pudo agregar', 'error');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Error al conectar con el servidor', 'error');
    }
  });

  // 🗑️ Delegación de evento eliminar
  if (productList) {
    productList.addEventListener('click', handleDelete);
  }

  async function handleDelete(e) {
    if (e.target.classList.contains('deleteBtn')) {
      const productId = e.target.parentElement.dataset.id;
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        try {
          const response = await fetch(`/api/products/${productId}`, {
            method: 'DELETE'
          });
          if (!response.ok) {
            Swal.fire('Error', 'No se pudo eliminar', 'error');
          }
        } catch (err) {
          console.error(err);
          Swal.fire('Error', 'Error de conexión', 'error');
        }
      }
    }
  }
});
