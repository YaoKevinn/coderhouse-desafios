const productForm = document.getElementById('productForm');
const successMessage = document.getElementById('success-message');
const errorMessage = document.getElementById('error-message');

const handleSubmit = (event, form, route) => {
    successMessage.innerHTML = '';
    errorMessage.innerHTML = '';

    event.preventDefault();
    let formData = new FormData(form);
    let obj = {}
    formData.forEach((value, key) => {
        obj[key] = key === 'price' ? +value : value
    });
    fetch(route, {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            "Content-type": "application/json"
        },
    })
    .then((res) => res.json())
    .then((json) => {
        console.log(json);
        productForm.reset();
        successMessage.innerHTML = 'Product agregado con éxito';
    })
    .catch((err) => {
        console.log(err);
        errorMessage.innerHTML = 'Algo salió mal, por favor intentá nuevamente';
    });
};

productForm.addEventListener('submit', (e) => handleSubmit(e, e.target, '/api/productos'));

