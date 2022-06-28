const assert = require("assert");

const axios = require('axios');
const baseUrl = 'http://localhost:8080/api/';

async function getProducts() {
    try {
        const res = await axios.get(baseUrl + 'productos');
        // console.log('STATUS: ', res.status);
        // console.log(res.data);
        return res.data;
    } catch (err) {
        console.log('STATUS: ', res.status);
        console.error(err);
    }
}

async function createProduct(product) {
    try {
        const res = await axios.post(baseUrl + 'productos', product);
        // console.log('STATUS: ', res.status);
        // console.log(res.data);
        return res.data;
    } catch (err) {
        console.log('STATUS: ', res.status);
        console.error(err);
    }
}

async function modifyProduct(id, product) {
    try {
        const res = await axios.put(baseUrl + `productos/${id}`, product);
        // console.log('STATUS: ', res.status);
        // console.log(res.data);
        return res.data;
    } catch (err) {
        console.log('STATUS: ', res.status);
        console.error(err);
    }
}

async function deleteProduct(id) {
    try {
        const res = await axios.delete(baseUrl + `productos/${id}`);
        // console.log('STATUS: ', res.status);
        // console.log(res.data);
        return res.data;
    } catch (err) {
        console.log('STATUS: ', res.status);
        console.error(err);
    }
}


// MOCHA
let testId = '';

describe('Test para getProducts', async () => {
    it('Deberia traer un listado de productos vacíos', async () => {
        const products = await getProducts();
        assert.strictEqual(products.length, 0);
    });

    it('Deberia poder agregar un producto al listado', async () => {
        const res = await createProduct({ title: 'Lapiz', price: 50, thumbnail: 'https://www.google.com' });
        testId = res.id;
        
        const products = await getProducts();
        assert.strictEqual(products.length, 1);
        assert.deepStrictEqual(products, [
            { 
                title: 'Lapiz', 
                price: 50, 
                thumbnail: 'https://www.google.com',
                _id: testId,
            }
        ]);
    });

    it('Deberia permitir modificar el producto', async () => {
        await modifyProduct(testId, { title: 'Lapiz', price: 100, thumbnail: 'https://www.google.com' });

        const products = await getProducts();
        assert.strictEqual(products.length, 1);
        assert.deepStrictEqual(products, [
            { 
                title: 'Lapiz', 
                price: 100, 
                thumbnail: 'https://www.google.com',
                _id: testId,
            }
        ]);
    });

    it('Deberia permitir borrar un producto', async () => {
        await deleteProduct(testId);

        const products = await getProducts();
        assert.strictEqual(products.length, 0);
    });
});
