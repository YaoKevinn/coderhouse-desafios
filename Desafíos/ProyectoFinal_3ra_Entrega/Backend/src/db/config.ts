import { ConnectOptions } from 'mongoose';
import MongoStore from 'connect-mongo';
import admin from 'firebase-admin';
import 'dotenv/config'

var config = require('../db/firebase-key.json');
let serviceAccount = config;


// Configuration for firebase
export const firebaseConfig = {
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://coderhouse-backend-ecommerce.firebase.io.com',
}

// Configuration for Mongo
export const mongoDbConfig: { url: string, config: any } = {
    url: process.env.MONGO_URL as string,
    config: {
        useNewUrlParser:true,
        useUnifiedTopology:true
    }
}

export const sessionOption = {
    store: MongoStore.create({
        // mongoUrl: 'mongodb+srv://yaokevinn:1234@cluster0.gwx3c.mongodb.net/mySessionDB?authSource=admin&replicaSet=atlas-rtc62t-shard-0&readPreference=primary&ssl=true',
        mongoUrl: process.env.MONGO_URL as string,
        ttl: 10 * 60
    }),
    secret: 'mongosecretexample',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 10 * 60 * 1000
    }
} 