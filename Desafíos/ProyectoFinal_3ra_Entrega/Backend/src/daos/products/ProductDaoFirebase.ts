import { Product } from '../../models/Product';
import { FirebaseContainer } from './../../containers/FirebaseContainer';

export class ProductDaoFirebase extends FirebaseContainer {
    private productManager = new FirebaseContainer(this.collectionString);

    constructor() {
        super('products');
    }

    async getAll() {
       const docs = await this.productManager.getAll();
       if (docs) {
            const response: any[] = docs.map((doc) => ({
                id: doc.id as string,
                nombre: doc.data().nombre as string,
                description: doc.data().description as string,
                codigo: doc.data().codigo as string,
                foto: doc.data().foto as string,
                precio: doc.data().precio as number,
                stock: doc.data().stock as number,
                timestamp: doc.data().timestamp as string,
            }));
            return response;      
       }
       return [];
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