// Configuration for Mongo
const mongoDbConfig = {
    url: "mongodb+srv://yaokevinn:1234@cluster0.gwx3c.mongodb.net/mySessionDB?authSource=admin&replicaSet=atlas-rtc62t-shard-0&readPreference=primary&ssl=true",
    config: {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
}

module.exports = mongoDbConfig;