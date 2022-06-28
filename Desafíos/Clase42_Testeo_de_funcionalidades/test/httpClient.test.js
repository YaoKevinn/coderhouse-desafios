const assert = require("assert");

const axios = require('axios');
const baseUrl = 'http://localhost:8080/api/';
let testId = '';

async function getProducts() {
    try {
        const res = await axios.get(baseUrl + 'productos');
        console.log('STATUS: ', res.status);
        console.log(res.data);
        return res.data;
    } catch (err) {
        console.log('STATUS: ', res.status);
        console.error(err);
    }
}

async function createProduct(product) {
    try {
        const res = await axios.post(baseUrl + 'productos', product);
        console.log('STATUS: ', res.status);
        console.log(res.data);
        testId = res.data.id;
        return res.data;
    } catch (err) {
        console.log('STATUS: ', res.status);
        console.error(err);
    }
}

async function modifyProduct(id, product) {
    try {
        const res = await axios.put(baseUrl + `productos/${id}`, product);
        console.log('STATUS: ', res.status);
        console.log(res.data);
        return res.data;
    } catch (err) {
        console.log('STATUS: ', res.status);
        console.error(err);
    }
}

async function deleteProduct(id) {
    try {
        const res = await axios.delete(baseUrl + `productos/${id}`);
        console.log('STATUS: ', res.status);
        console.log(res.data);
        return res.data;
    } catch (err) {
        console.log('STATUS: ', res.status);
        console.error(err);
    }
}

const initTest = async () => {
    // Lectura de productos
    await getProducts();

    // Alta de nuevo producto
    await createProduct({ title: 'Lapiz', price: 50, thumbnail: 'https://www.google.com' });

    // Modificar producto
    await modifyProduct(testId, { title: 'Lapiz', price: 100, thumbnail: 'https://www.google.com' })

    // Borrado de producto
    await deleteProduct(testId);
}

initTest();