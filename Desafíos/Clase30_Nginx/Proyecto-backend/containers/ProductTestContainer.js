const { faker } = require('@faker-js/faker');
faker.locale = 'es';

module.exports = class ProductTestContainer {
    constructor() {}

    getRandomProducts(cant) {
        const randomProducts = [];
        for (let i = 0; i < cant; i++) {
            const newProduct = {
                title: faker.commerce.product(),
                price: faker.commerce.price(),
                thumbnail: faker.image.nature(200, 200, true),
            }
            randomProducts.push(newProduct);
        }
        return randomProducts;
    }
}