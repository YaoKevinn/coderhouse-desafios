const express = require('express');
const Contenedor = require('./Contenedor');

const app = express()

app.listen(8080, () => {
    console.log('Listening on port 8080...');
});

const contenedor = new Contenedor('productos.txt');

app.get('/productos', async (req, res) => {
    const productos = await contenedor.getAll();
    res.send(productos);
});

app.get('/productoRandom', async (req, res) => {
    const productos = await contenedor.getAll();
    const randomId = Math.floor(Math.random() * productos.length);
    res.send(productos[randomId]);
});
