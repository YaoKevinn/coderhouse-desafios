const socket = io();

socket.on('newProduct', data => {
    console.log(data);
    addProductToList(data);
});

const getCurrentProductList = () => {
    fetch('http://localhost:8080/api/productos', {
        method: 'GET',
        headers: {
            "Content-type": "application/json"
        },
    })
    .then((res) => res.json())
    .then((json) => {
        console.log(json);
        json.forEach(product => {
            addProductToList(product);
        });
    })
    .catch((err) => {
        console.log(err);
    });
}

const addBtnClicked = () => {
    console.log('clicked');
    const obj = {
        title: document.getElementById('titleInput').value,
        price: document.getElementById('priceInput').value,
        thumbnail: document.getElementById('thumbnailInput').value
    }
    
    fetch('http://localhost:8080/api/productos', {
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
    })
    .catch((err) => {
        console.log(err);
    });
}

addProductToList = (data) => {
    const list = document.getElementById('list-section');
    const element = document.createElement('div');
    element.className = "row";
    const template = `
        <div class="row">
            <b>${data.title}</b>
            <p>${data.price}</p>
            <img class="product-img" src="${data.thumbnail}" />
        </div>
    `;
    element.innerHTML = template
    list.appendChild(element);
}

getCurrentProductList();