const express = require('express');
const ContenedorTest = require('../containers/ProductTestContainer');

const router = express.Router(); 

const contenedorTest = new ContenedorTest();

router.get('/', (req, res) => {
    res.status(200).send(contenedorTest.getRandomProducts(5));
});

module.exports = router;