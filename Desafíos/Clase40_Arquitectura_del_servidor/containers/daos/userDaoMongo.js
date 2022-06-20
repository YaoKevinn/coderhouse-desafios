const MongoContainer = require("../MongoContainer");
const UserS = require('../../models/User');

let instance = null;

class UserDaoMongo extends MongoContainer {
    static instance;
    userManager = new MongoContainer(this.collectionModel);

    constructor() {
        super(UserS)
    }

    static getInstance() {
        if (!instance) {
          instance = new UserDaoMongo();
        }
        return instance;
    }

    async getAll() {
        const docs = await this.userManager.getAll();
        return docs;
    }
 
     async getById(id) {
         return await this.userManager.getById(id);
     }

     async getByMongoId(id) {
         return await this.userManager.getByMongoId(id)
     }

     async checkIfUserExists(username) {
         return await this.userManager.checkIfUserExists(username);
     }
 
     async addItem(item) {
         return await this.userManager.addItem(item);
     }
 
     async updateItemById(id, item) {
         return await this.userManager.updateItemById(id, item);
     }

     async updateItemByMongoId(id, item) {
         return await this.userManager.updateItemByMongoId(id, item);
     }
 
     async deleteItemById(id) {
         return await this.userManager.deleteItemById(id);
     }
    
    async deleteItemByMongoId(id) {
        return await this.userManager.deleteItemByMongoId(id);
    }
}

module.exports = UserDaoMongo