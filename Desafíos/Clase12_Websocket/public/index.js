const socket = io();

socket.on('newProduct', data => {
    console.log(data);
    addProductToList(data);
});

socket.on('newUserMessage', data => {
    console.log(data);
    addConversationToList(data);
});


// PRODUCT APIs
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

// Chat APIs
const getAllConversations = () => {
    fetch('http://localhost:8080/api/conversations', {
        method: 'GET',
        headers: {
            "Content-type": "application/json"
        },
    })
    .then((res) => res.json())
    .then((json) => {
        console.log(json);
        json.forEach(message => {
            addConversationToList(message);
        });
    })
    .catch((err) => {
        console.log(err);
    });
}

const addConversationToList = (data) => {
    const list = document.getElementById('list-chat');
    const element = document.createElement('div');
    const time = new Date(data.creationTime);

    element.className = "row";

    const template = `
        <div class="col">
            <div class="row">
                <b>${data.author}</b>
                <p class="time-text">${getDateText(data.creationTime)}</p>
            </div>
            <div class="row">
                <i><p class="message-text">${data.message}</p><i/>
            </div>
        </div>
    `;

    element.innerHTML = template
    list.appendChild(element);
}

const getDateText = (isoDate) => {
    const date = new Date(isoDate);
    return `[${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}]`;
}

const sendBtnClicked = () => {
    const userInput = document.getElementById('userInput');
    const messageInput = document.getElementById('messageInput');

    if (userInput.value == '') {
        alert('Debe ingresar su mail para poder mandar mensajes');
        return
    }

    socket.emit('newMessage', {
        author: userInput.value,
        message: messageInput.value
    });

    messageInput.value = '';
}

getCurrentProductList();
getAllConversations();