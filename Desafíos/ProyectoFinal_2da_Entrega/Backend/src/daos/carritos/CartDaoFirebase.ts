import { Cart } from '../../models/Cart';
import { FirebaseContainer } from './../../containers/FirebaseContainer';

export class CartDaoFirebase extends FirebaseContainer {
    private cartManager = new FirebaseContainer(this.collectionString);

    constructor() {
        super('carts');
    }

    async getAll() {
       const docs = await this.cartManager.getAll();
       if (docs) {
            const response: any[] = docs.map((doc) => ({
                id: doc.id as string,
                productos: doc.data().productos as string[],
                timestamp: doc.data().timestamp as string,
            }));
            return response;      
       }
       return [];
    }

    async getById(id: string) {
        return await this.cartManager.getById(id);
    }

    async addItem(item: Cart) {
        const newCart: Cart = {
            ...item,
            timestamp: new Date().toISOString(),
        }
        return await this.cartManager.addItem(newCart);
    }

    async addItemsByCartId(id: string, items: string[]) {
        const newCart: any = await this.getById(id);
        console.log(newCart);
        if (newCart) {
            const newProducts = newCart.productos.concat(items);
            newCart.productos = newProducts;
            return await this.updateItemById(id, newCart);
        } 
        return undefined;
    }

    async updateItemById(id: string, item: Cart) {
        return await this.cartManager.updateItemById(id, item);
    }

    async deleteItemById(id: string) {
        return await this.cartManager.deleteItemById(id);
    }

    async deleteItemInCart(cartId: string, productId: string) {
        const newCart: any = await this.getById(cartId);
        if (newCart) {
            newCart.productos = newCart.productos.filter((p: string) => p !== productId)
        }
        await this.updateItemById(cartId, newCart);
    }
}