import { Product } from '../models/Product';
import { Cart } from '../models/Cart';
import fs from 'fs';

export class CartController {
    private fileName: string;
    
    constructor(fileName: string) {
        this.fileName = fileName;
    }

    async getProductsByCartId(cartId: number) {
        try {
            const cartsArray: Cart[] = await this.getCartsArrayFromFile();
            const index = cartsArray.findIndex((c) => c.id === cartId);
            if (index !== -1) {
                return cartsArray[index].productos;
            } else {
                return undefined;
            }
        } catch(error) {
            console.log('Error agregando producto...', error);
        }
    }
    
    async addCart(products: Product[]) {
        try {
            const cartsArray: Cart[] = await this.getCartsArrayFromFile();

            const newId: number = cartsArray.length === 0 ? 1 : (cartsArray.slice(-1)[0].id + 1);

            const newCart: Cart = {
                productos: products,
                timestamp: new Date().toISOString(),
                id: newId,
            }

            cartsArray.push(newCart);

            await this.setCartsArrayToFile(cartsArray);

            return newId;
        } catch(error) {
            console.log('Error agregando producto...', error);
        }
    }

    async addProductToCartById(cartId: number, products: Product[]) {
        try {
            const cartsArray: Cart[] = await this.getCartsArrayFromFile();
            const index = cartsArray.findIndex((c) => c.id === cartId);

            if (index !== -1) {
                const existingProductIds = cartsArray[index].productos.map((p) => p.id);
                products.forEach((p) => {
                     if (!existingProductIds.includes(p.id)) {
                         cartsArray[index].productos.push(p);
                     }
                });
            } else {
                return undefined;
            }

            await this.setCartsArrayToFile(cartsArray);
            return cartsArray[index];
        } catch(error) {
            console.log('Error agregando producto...', error);
        }
    }

    async deleteCartById(cartId: number) {
        try {
            let cartsArray: Cart[] = await this.getCartsArrayFromFile();
            cartsArray = cartsArray.filter((c) => c.id !== cartId);
            await this.setCartsArrayToFile(cartsArray);
        } catch(error) {
            console.log('Error agregando producto...', error);
        }
    }

    async deleteProductInCart(cartId: number, productId: number) {
        try {
            let cartsArray: Cart[] = await this.getCartsArrayFromFile();
            const cartIndex = cartsArray.findIndex((c) => c.id === cartId);
            if (cartIndex !== -1) {
                cartsArray[cartIndex].productos = cartsArray[cartIndex].productos.filter((p) => p.id !== productId);
            }
            await this.setCartsArrayToFile(cartsArray);
        } catch(error) {
            console.log('Error agregando producto...', error);
        }
    }


    

    private async getCartsArrayFromFile() {
        try {
            const data = await fs.promises.readFile(this.fileName, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.log('Error leyendo archivo...', error);
        }
    }

    private async setCartsArrayToFile(carts: Cart[]) {
        try {
            await fs.promises.writeFile(this.fileName, JSON.stringify(carts, null, 2));
        } catch (error) {
            console.log('Error escribiendo archivo...', error);
        }
    }
}
