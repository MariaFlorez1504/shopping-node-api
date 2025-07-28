export function validateForm() {
  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('description').value.trim();
  const code = document.getElementById('code').value.trim();
  const price = parseFloat(document.getElementById('price').value);
  const stock = parseInt(document.getElementById('stock').value);
  const category = document.getElementById('category').value.trim();

  let valid = true;

  if (!title) {
    document.getElementById('titleError').style.display = 'block';
    valid = false;
  } else {
    document.getElementById('titleError').style.display = 'none';
  }

  if (!description) {
    document.getElementById('descriptionError').style.display = 'block';
    valid = false;
  } else {
    document.getElementById('descriptionError').style.display = 'none';
  }

  if (!code) {
    document.getElementById('codeError').style.display = 'block';
    valid = false;
  } else {
    document.getElementById('codeError').style.display = 'none';
  }

  if (isNaN(price) || price <= 0) {
    document.getElementById('priceError').style.display = 'block';
    valid = false;
  } else {
    document.getElementById('priceError').style.display = 'none';
  }

  if (isNaN(stock) || stock < 0) {
    document.getElementById('stockError').style.display = 'block';
    valid = false;
  } else {
    document.getElementById('stockError').style.display = 'none';
  }

  if (!category) {
    document.getElementById('categoryError').style.display = 'block';
    valid = false;
  } else {
    document.getElementById('categoryError').style.display = 'none';
  }

  return valid;
}

export function toggleButton() {
  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('description').value.trim();
  const code = document.getElementById('code').value.trim();
  const price = parseFloat(document.getElementById('price').value);
  const stock = parseInt(document.getElementById('stock').value);
  const category = document.getElementById('category').value.trim();

  const btn = document.getElementById('addProductBtn');

  if (title && description && code && !isNaN(price) && price > 0 && !isNaN(stock) && stock >= 0 && category) {
    btn.disabled = false;
  } else {
    btn.disabled = true;
  }
}

