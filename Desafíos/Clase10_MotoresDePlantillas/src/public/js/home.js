const productForm = document.getElementById('productForm');
const successMessage = document.getElementById('success-message');
const errorMessage = document.getElementById('error-message');

const productBtn = document.getElementById('product-btn');

productBtn.addEventListener('click', (e) => {
    window.location.href = 'http://localhost:8080/productos';
})