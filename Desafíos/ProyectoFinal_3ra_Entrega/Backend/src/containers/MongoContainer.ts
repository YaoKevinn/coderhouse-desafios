import { mongoDbConfig } from './../db/config';
import mongoose, { ConnectOptions } from 'mongoose';

const Model = mongoose.Model;

mongoose.connect(mongoDbConfig.url, mongoDbConfig.config as ConnectOptions, err=>{
    if(err) throw new Error("Failed connecting to Mongo")
    console.log("Successfully connected to Mongo");
});

export class MongoContainer {
    collectionModel: typeof Model;

    constructor(collectionModel: typeof Model) {
        this.collectionModel = collectionModel;
    }
    
    async getAll() {
        try {
            let result = await this.collectionModel.find();
            result.forEach((r) => {
                r.id = r._id;
            })
            return result;
        } catch (error) {
            console.log(error);
        }
    }

    async getById(id: string) {
        try {
            let result = await this.collectionModel.findById(id);
            result.id = result._id;
            return result;
        } catch (error) {
            console.log(error);
        }
    }

    async addItem(item: any) {
        const formattedItem = {
            ...item,
            timestamp: new Date().toISOString()
        }
        try {
             let result = await this.collectionModel.insertMany([formattedItem]);
             result.forEach((r) => {
                r.id = r._id;
            })
            return result[0];
        } catch (error) {
            console.log(error);
        }
    }

    async updateItemById(id: string, item: any) {
        try {
            let result = await this.collectionModel.updateOne({ _id: id }, {
                $set: { ...item }
            });
            return { ...item, _id: id, id: id }
        } catch (error) {
            console.log(error);
        }
    }

    async deleteItemById(id: string) {
        try {
            await this.collectionModel.deleteOne({ _id: id });
        } catch (error) {
            console.log(error);
        }
    }

    async checkIfUserExists(username: string) {
        try {
            let user = await this.collectionModel.findOne({ username });   
            return user;
        } catch (error) {
            console.log(error);
        }
    }
}