require('dotenv').config()

// Configuration for Mongo
const mongoDbConfig = {
    url: process.env.MONGODB_URL,
    config: {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
}

module.exports = mongoDbConfig;