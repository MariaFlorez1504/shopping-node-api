// validations.js

// Espera que el DOM cargue
document.addEventListener('DOMContentLoaded', () => {
  const titleInput = document.getElementById('title');
  const priceInput = document.getElementById('price');
  const submitButton = document.querySelector('#productForm button[type="submit"]');

  const titleError = document.getElementById('titleError');
  const priceError = document.getElementById('priceError');

  function validateForm() {
    let isValid = true;

    if (titleInput.value.trim() === '') {
      titleError.textContent = 'El título es requerido.';
      isValid = false;
    } else {
      titleError.textContent = '';
    }

    const price = parseFloat(priceInput.value);
    if (isNaN(price) || price <= 0) {
      priceError.textContent = 'El precio debe ser mayor a 0.';
      isValid = false;
    } else {
      priceError.textContent = '';
    }

    submitButton.disabled = !isValid;
  }

  titleInput.addEventListener('input', validateForm);
  priceInput.addEventListener('input', validateForm);

  // Desactivar al inicio
  submitButton.disabled = true;
});
