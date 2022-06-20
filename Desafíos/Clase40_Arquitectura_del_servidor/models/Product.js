const mongoose = require('mongoose');

const PRODUCTS_COLLECTION = 'products';

const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model(PRODUCTS_COLLECTION, ProductSchema);