const express = require('express');
const router = express.Router();
const { graphqlHTTP } = require('express-graphql');
const {
    schema, 
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../services/productGraphql');

router.use('/', graphqlHTTP({
    schema: schema,
    rootValue: {
        getProducts,
        getProduct,
        createProduct,
        updateProduct,
        deleteProduct
    },
    graphiql: true,
 }));

module.exports = router;