import mongoose from 'mongoose';

const USERS_COLLECTION = 'users';

export interface User {
    username: string,
    password: string,
    name: string,
    address: string,
    year: string,
    phone: string,
    image: string,
    cartId: string,
}

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    year: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    cartId: {
        type: String,
        required: true,
    }
});

export default mongoose.model(USERS_COLLECTION, UserSchema);