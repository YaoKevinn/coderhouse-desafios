import { Cart } from './../../models/Cart';
import { FsContainer } from '../../containers/FsContainer';
import { Product } from '../../models/Product';

export class CartDaoFs extends FsContainer {
    private cartManager = new FsContainer(this.path);

    constructor() {
        super('src/datas/carts.txt');
    }

    async getAll() {
        return await this.cartManager.getAll();
    }

    async getById(id: string) {
        return await this.cartManager.getById(id);
    }

    async addItem(item: Cart) {
        return await this.cartManager.addItem(item);
    }

    async addItemsByCartId(id: string, items: string[]) {
        const newCart: Cart = await this.getById(id);
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
        await this.cartManager.deleteItemById(id);
    }

    async deleteItemInCart(cartId: string, productId: string) {
        const newCart: Cart = await this.getById(cartId);
        if (newCart) {
            newCart.productos = newCart.productos.filter((p) => p !== productId)
        }
        await this.updateItemById(cartId, newCart);
    }

    async disconnect() {
        return 
    }
}