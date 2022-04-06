// Configuration for Mongo
const mongoDbConfig = {
    url: 'mongodb+srv://yaokevinn:1234@cluster0.gwx3c.mongodb.net/coderhouse-normalization-backend?retryWrites=true&w=majority',
    config: {
        useNewUrlParser:true,
        useUnifiedTopology:true
    }
}

module.exports = mongoDbConfig;