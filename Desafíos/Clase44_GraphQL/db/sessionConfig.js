require('dotenv').config();
const MongoStore = require('connect-mongo');

const sessionOption = {
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_SESSION_URL,
        ttl: 10 * 60
    }),
    secret: process.env.MONGODB_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 10 * 60 * 1000
    }
}

module.exports = sessionOption;