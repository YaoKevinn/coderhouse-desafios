import UserS, { User } from '../../models/User';
import { MongoContainer } from '../../containers/MongoContainer';

export class UserDaoMongo extends MongoContainer {
    private userManager = new MongoContainer(this.collectionModel);

    constructor() {
        super(UserS);
    }

    async getAll() {
        const docs = await this.userManager.getAll();
        return docs;
    }
 
     async getById(id: string) {
         return await this.userManager.getById(id);
     }
 
     async addItem(item: User) {
         return await this.userManager.addItem(item);
     }
 
     async updateItemById(id: string, item: User) {
         return await this.userManager.updateItemById(id, item);
     }
 
     async deleteItemById(id: string) {
         return await this.userManager.deleteItemById(id);
     }

     async checkIfUserExists(username: string) {
        return await this.userManager.checkIfUserExists(username);
    }
}