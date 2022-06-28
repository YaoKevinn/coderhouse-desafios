const mongoose = require('mongoose');

const PRODUCTS_COLLECTION = 'products';

const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
}, { versionKey: false });

module.exports = mongoose.model(PRODUCTS_COLLECTION, ProductSchema);