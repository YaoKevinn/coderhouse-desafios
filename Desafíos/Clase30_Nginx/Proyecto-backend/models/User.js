const mongoose = require('mongoose');

const USERS_COLLECTION = 'users';

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model(USERS_COLLECTION, UserSchema);