import { ConnectOptions } from 'mongoose';
import admin from 'firebase-admin';

var config = require('../db/firebase-key.json');
let serviceAccount = config;


// Configuration for firebase
export const firebaseConfig = {
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://coderhouse-backend-ecommerce.firebase.io.com',
}

// Configuration for Mongo
export const mongoDbConfig: { url: string, config: any } = {
    url: 'mongodb+srv://yaokevinn:1234@cluster0.gwx3c.mongodb.net/coderhouse-ecommerce-backend?retryWrites=true&w=majority',
    config: {
        useNewUrlParser:true,
        useUnifiedTopology:true
    }
}