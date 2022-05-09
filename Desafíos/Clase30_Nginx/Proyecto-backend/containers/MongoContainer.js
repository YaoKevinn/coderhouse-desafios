const mongoDbConfig = require('../db/mongoConfig');
const mongoose = require('mongoose');

mongoose.connect(mongoDbConfig.url, mongoDbConfig.config, err=>{
    if(err) throw new Error("Failed connecting to Mongo");
    console.log("Successfully connected to Mongo");
});

module.exports = class MongoContainer {
    collectionModel

    constructor(collectionModel) {
        this.collectionModel = collectionModel;
    }
    
    async getAll() {
        try {
            let result = await this.collectionModel.find();
            return result;
        } catch (error) {
            console.log(error);
        }
    }

    async getById(id) {
        try {
            let result = await this.collectionModel.find({ id: id });
            return result[0];
        } catch (error) {
            console.log(error);
        }
    }

    async getByMongoId(id) {
        try {
            let result = await this.collectionModel.findById(id);
            return result ? result._doc : result;
        } catch (error) {
            console.log(error);
        }
    }

    async checkIfUserExists(username) {
        try {
            let user = await this.collectionModel.findOne({ username });   
            return user;
        } catch (error) {
            console.log(error);
        }
    }

    async addItem(item) {
        try {
            let result = await this.collectionModel.insertMany([item]);
            return result[0];
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async updateItemById(id, item) {
        try {
            let result = await this.collectionModel.updateOne({ id: id }, {
                $set: { ...item }
            });
            return { ...item }
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async updateItemByMongoId(id, item) {
        try {
            let result = await this.collectionModel.updateOne({ _id: id }, {
                $set: { ...item }
            });
            return { ...item, _id: id }
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async deleteItemById(id) {
        try {
            await this.collectionModel.deleteOne({ id: id });
        } catch (error) {
            console.log(error);
        }
    }

    async deleteItemByMongoId(id) {
        try {
            await this.collectionModel.deleteOne({ _id: id });
        } catch (error) {
            console.log(error);
        }
    }
}