import ProductS, { Product } from '../../models/Product';
import { MongoContainer } from '../../containers/MongoContainer';

export class ProductDaoMongo extends MongoContainer {
    private productManager = new MongoContainer(this.collectionModel);

    constructor() {
        super(ProductS);
    }

    async getAll() {
        const docs = await this.productManager.getAll();
        return docs;
    }
 
     async getById(id: string) {
         return await this.productManager.getById(id);
     }
 
     async addItem(item: Product) {
         return await this.productManager.addItem(item);
     }
 
     async updateItemById(id: string, item: Product) {
         return await this.productManager.updateItemById(id, item);
     }
 
     async deleteItemById(id: string) {
         return await this.productManager.deleteItemById(id);
     }
}