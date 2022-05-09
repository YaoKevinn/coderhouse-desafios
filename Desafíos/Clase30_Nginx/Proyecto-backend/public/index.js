const socket = io();

const normalize = normalizr.normalize;
const denormalize = normalizr.denormalize;
const schema = normalizr.schema;

// Definition Normalizr
const authorSchema = new schema.Entity('authors', {}, {idAttribute: 'email'});
const messageSchema = new schema.Entity('post', {
    author: authorSchema
});
const postsSchema = new schema.Entity('posts', {
    mensajes: [messageSchema],
});

socket.on('newProduct', data => {
    addProductToList(data);
});

socket.on('newUserMessage', data => {
    addConversationToList(data);
});

// Signup API
const register = () => {
    const userNameInput = document.getElementById('registerUsernameInput');
    const passwordInput = document.getElementById('registerPasswordInput');
    fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            username: userNameInput.value,
            password: passwordInput.value,
        })
    })
    .then((res) => res.json())
    .then((json) => {
        if (json.error) {
            redirectTo('registerFailed');
        } else {
            redirectTo('login');
        }
    })
    .catch((err) => {
        console.log(err);
    });
}

// Session API
const login = () => {
    const userNameInput = document.getElementById('loginUsernameInput');
    const passwordInput = document.getElementById('loginPasswordInput');

    fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            username: userNameInput.value,
            password: passwordInput.value,
        })
    })
    .then((res) => {
        if (res.redirected) {
            window.location.replace(res.url);
        } else {
            redirectTo('');
        }
    })
}

const logout = () => {
    fetch('http://localhost:8080/api/auth/logout', {
        method: 'POST',
        headers: {
            "Content-type": "application/json"
        },
    })
    .then((res) => res.json())
    .then((json) => {
        const hastaLuegoTemplate = `
            <div class="container">
               <h1>Hasta luego, ${json.username}</h1>
            </div>
        `;
        document.body.innerHTML = hastaLuegoTemplate;
        setTimeout(() => {
            location.reload();
        }, 2000);
    })
    .catch((err) => {
        console.log(err);
    });
}

// redirectTo
const redirectTo = (destination) => {
    window.location.replace(`http://localhost:8080/${destination}`);
}

// PRODUCT APIs
const getCurrentProductList = () => {
    fetch('http://localhost:8080/api/products-test', {
        method: 'GET',
        headers: {
            "Content-type": "application/json"
        },
    })
    .then((res) => res.json())
    .then((json) => {
        json.forEach(product => {
            addProductToList(product);
        });
    })
    .catch((err) => {
        console.log(err);
    });
}

const addBtnClicked = () => {
    const obj = {
        title: document.getElementById('titleInput').value,
        price: parseFloat(document.getElementById('priceInput').value),
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
const getAllConversations = (updateView = true) => {
    fetch('http://localhost:8080/api/conversations', {
        method: 'GET',
        headers: {
            "Content-type": "application/json"
        },
    })
    .then((res) => res.json())
    .then((json) => {
        const denormalizedData = denormalize(json.result, postsSchema, json.entities);
        const compresionRate = JSON.stringify(json).length / JSON.stringify(denormalizedData).length * 100;
        const compresionTag = document.getElementById('compresion');
        compresionTag.innerText = Math.round(compresionRate);

        if (updateView) {
            denormalizedData.mensajes.forEach(message => {
                addConversationToList(message);
            });   
        }
    })
    .catch((err) => {
        console.log(err);
    });
}

const addConversationToList = (data) => {
    const list = document.getElementById('list-chat');
    const element = document.createElement('div');

    element.className = "row";

    const template = `
        <div class="col">
            <div class="message-row">
                <b>${data.author.email}</b>
                <p class="time-text">${getDateText(data.creationTime)}</p>
            </div>
            <div class="row">
                <i><p class="message-text">${data.text}</p><i/>
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
    const emailInput = document.getElementById('emailInput');
    const nameInput = document.getElementById('nameInput');
    const firstNameInput = document.getElementById('firstNameInput');
    const yearInput = document.getElementById('yearInput');
    const aliasInput = document.getElementById('aliasInput');
    const avatarInput = document.getElementById('avatarInput');

    if (
        emailInput.value == '' || 
        nameInput.value == '' || 
        firstNameInput.value == '' || 
        yearInput.value == '' || 
        aliasInput.value == '' || 
        avatarInput.value == ''
    ) {
        alert('Debe ingresar datos de usuario para poder mandar mensajes');
        return
    }

    socket.emit('newMessage', {
        author: {
            email: emailInput.value,
            nombre: nameInput.value,
            apellido: firstNameInput.value,
            edad: +yearInput.value,
            alias: aliasInput.value,
            avatar: avatarInput.value,
        },
        text: messageInput.value,
    });

    messageInput.value = '';

    getAllConversations(false);
}

getCurrentProductList();
getAllConversations();

