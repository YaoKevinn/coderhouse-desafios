const MongoContainer = require("../MongoContainer");
const ProductS = require('../../models/Product');

let instance = null;

class ProductDaoMongo extends MongoContainer {
    static instance;
    productManager = new MongoContainer(this.collectionModel);

    constructor() {
        super(ProductS)
    }

    static getInstance() {
        if (!instance) {
          instance = new ProductDaoMongo();
        }
        return instance;
      }

    async getAll() {
        const docs = await this.productManager.getAll();
        return docs;
    }
 
     async getById(id) {
         return await this.productManager.getById(id);
     }

     async getByMongoId(id) {
         return await this.productManager.getByMongoId(id)
     }
 
     async addItem(item) {
         return await this.productManager.addItem(item);
     }
 
     async updateItemById(id, item) {
         return await this.productManager.updateItemById(id, item);
     }

     async updateItemByMongoId(id, item) {
         return await this.productManager.updateItemByMongoId(id, item);
     }
 
     async deleteItemById(id) {
         return await this.productManager.deleteItemById(id);
     }
    
    async deleteItemByMongoId(id) {
        return await this.productManager.deleteItemByMongoId(id);
    }
}

module.exports = ProductDaoMongo