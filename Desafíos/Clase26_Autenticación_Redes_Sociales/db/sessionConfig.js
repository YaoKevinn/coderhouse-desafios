const MongoStore = require('connect-mongo');

const sessionOption = {
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://yaokevinn:1234@cluster0.gwx3c.mongodb.net/mySessionDB?authSource=admin&replicaSet=atlas-rtc62t-shard-0&readPreference=primary&ssl=true',
        ttl: 10 * 60
    }),
    secret: 'mongosecretexample',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 10 * 60 * 1000
    }
}

module.exports = sessionOption;