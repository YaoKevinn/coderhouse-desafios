// CHAI
const request = require('supertest')('http://localhost:8080');
const expect = require('chai').expect;
let chaiTestId = '';

describe('API testing', () => {
    it('Deberia devolver un status 200 y un array vacío', async () => {
        let res = await request.get('/api/productos');
        expect(res.status).to.eql(200);
        expect(res.body.length).to.eql(0);
    });

    it('Deberia poder agregar un producto', async () => {
        let res = await request.post('/api/productos').send({ title: 'Lapiz', price: 50, thumbnail: 'https://www.google.com' });
        const addedProduct = res.body;
        chaiTestId = addedProduct.id;
        expect(addedProduct).to.include.keys('title', 'price', 'thumbnail', 'id');
        expect(addedProduct.title).to.eql('Lapiz');
        expect(addedProduct.price).to.eql(50);
        expect(addedProduct.thumbnail).to.eql('https://www.google.com');
    });

    it('Deberia poder modificar un producto', async () => {
        let res = await request.put(`/api/productos/${chaiTestId}`).send({ title: 'Lapiz', price: 100, thumbnail: 'https://www.google.com' });
        const modifiedProduct = res.body;
        expect(modifiedProduct).to.include.keys('title', 'price', 'thumbnail', 'id');
        expect(modifiedProduct.title).to.eql('Lapiz');
        expect(modifiedProduct.price).to.eql(100);
        expect(modifiedProduct.thumbnail).to.eql('https://www.google.com');
    });

    it('Deberia poder borrar un producto', async () => {
        await request.delete(`/api/productos/${chaiTestId}`);
        let res = await request.get('/api/productos');
        expect(res.status).to.eql(200);
        expect(res.body.length).to.eql(0);
    });
});