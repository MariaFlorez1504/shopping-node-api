document.addEventListener('DOMContentLoaded', () => {
  const socket = io();

  const form = document.getElementById('productForm');
  const titleInput = document.getElementById('title');
  const priceInput = document.getElementById('price');
  const addProductBtn = document.getElementById('addProductBtn');
  const titleError = document.getElementById('titleError');
  const priceError = document.getElementById('priceError');
  const productList = document.getElementById('productList');

  // === Validar campos en tiempo real ===
  function validateInputs() {
    let valid = true;

    if (titleInput.value.trim() === '') {
      titleError.style.display = 'block';
      valid = false;
    } else {
      titleError.style.display = 'none';
    }

    if (priceInput.value.trim() === '' || isNaN(priceInput.value) || Number(priceInput.value) <= 0) {
      priceError.style.display = 'block';
      valid = false;
    } else {
      priceError.style.display = 'none';
    }

    addProductBtn.disabled = !valid;
  }

  titleInput.addEventListener('input', validateInputs);
  priceInput.addEventListener('input', validateInputs);

  // === Crear producto vía API ===
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const newProduct = {
      title: titleInput.value.trim(),
      description: "Generado desde form",
      price: Number(priceInput.value),
      code: Math.random().toString(36).substring(2, 8),
      status: true,
      stock: 10,
      category: "General",
      thumbnails: ["placeholder.jpg"]
    };

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });

      if (!response.ok) {
        throw new Error('No se pudo agregar el producto');
      }

      Swal.fire({
        icon: 'success',
        title: 'Producto agregado!',
        showConfirmButton: false,
        timer: 1500
      });

      // Limpiar formulario
      form.reset();
      validateInputs();

    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message
      });
    }
  });

  // === Eliminar producto vía API ===
  if (productList) {
    productList.addEventListener('click', async (event) => {
      if (event.target.classList.contains('deleteBtn')) {
        const productId = event.target.parentElement.dataset.id;

        const confirm = await Swal.fire({
          title: '¿Eliminar producto?',
          text: "Esta acción no se puede deshacer",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar'
        });

        if (confirm.isConfirmed) {
          const response = await fetch(`/api/products/${productId}`, {
            method: 'DELETE'
          });

          if (!response.ok) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar el producto'
            });
          }
        }
      }
    });
  }

  // === Escuchar actualizaciones por websocket ===
  socket.on('updateProducts', (product) => {
    if (productList) {
      const newItem = document.createElement('li');
      newItem.setAttribute('data-id', product.id);
      newItem.textContent = `${product.title} - Precio: ${product.price}`;

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Eliminar';
      deleteBtn.className = 'deleteBtn';

      newItem.appendChild(deleteBtn);
      productList.appendChild(newItem);
    }
  });

  socket.on('removeProduct', (productId) => {
    if (productList) {
      const items = productList.querySelectorAll('li');
      items.forEach(item => {
        if (item.dataset.id == productId) {
          productList.removeChild(item);
        }
      });
    }
  });

});
