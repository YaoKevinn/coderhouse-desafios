import mongoose from 'mongoose';

const PRODUCTS_COLLECTION = 'products';

export interface Product {
    id?: string,
    timestamp: string,
    nombre: string,
    description: string,
    codigo: string,
    foto: string,
    precio: number,
    stock: number,    
}

const ProductSchema = new mongoose.Schema({
    id: {
        type: String,
        required: false,
    },
    timestamp: {
        type: String,
        required: true,
    },
    nombre: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    codigo: {
        type: String,
        required: true,
    },
    foto: {
        type: String,
        required: true,
    },
    precio: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
});

export default mongoose.model(PRODUCTS_COLLECTION, ProductSchema);