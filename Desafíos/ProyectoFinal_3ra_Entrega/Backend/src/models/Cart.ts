import mongoose from "mongoose";

const CARTS_COLLECTION = 'carts';

export interface Cart {
    id?: string,
    timestamp?: string,
    productos: string[],
}

const CartSchema = new mongoose.Schema({
    timestamp: {
        type: String,
        required: true,
    },
    productos: {
        type: [String],
        required: true
    }
});

export default mongoose.model(CARTS_COLLECTION, CartSchema);