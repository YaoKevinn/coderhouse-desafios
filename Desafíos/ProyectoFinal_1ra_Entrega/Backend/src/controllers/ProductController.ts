import { Product } from '../models/Product';
import fs from 'fs';

export class ProductController {
    private fileName: string;

    constructor(fileName: string) {
        this.fileName = fileName;
    }

    async addProduct(product: Product) {
        try {
            const productsArray: Product[] = await this.getProductsArrayFromFile();

            const newId: number = productsArray.length === 0 ? 1 : (productsArray.slice(-1)[0].id + 1);

            const newProduct: Product = {
                ...product,
                timestamp: new Date().toISOString(),
                id: newId,
            }

            productsArray.push(newProduct);

            await this.setProductsArrayToFile(productsArray);

            return newProduct;
        } catch(error) {
            console.log('Error agregando producto...', error);
        }
    }

    async getProductById(id: number) {
        try {
            const productsArray: Product[] = await this.getProductsArrayFromFile();
            return productsArray.find((p) => p.id === id);
        } catch (error) {
            console.log('Error obteniendo producto...', error);
        }
    }

    async getAllProducts() {
        try {
            const productsArray: Product[] = await this.getProductsArrayFromFile();
            return productsArray;
        } catch (error) {
            console.log('Error obteniendo producto...', error);
        }
    }

    async updateProductById(id: number, product: Product) {
        try {
            const productsArray: Product[] = await this.getProductsArrayFromFile();
            
            const index = productsArray.findIndex((p) => p.id === id);

            if (index !== -1) {
                const modifiedProduct = {
                    ...productsArray[index],
                    ...product,
                }
                productsArray[index] = modifiedProduct;
            }

            await this.setProductsArrayToFile(productsArray);
            return productsArray[index];

        } catch (error) {
            console.log('Error obteniendo producto...', error);
        }
    }

    async deleteProductById(id: number) {
        try {
            let productsArray: Product[] = await this.getProductsArrayFromFile();
            productsArray = productsArray.filter((p) => p.id !== id);
            await this.setProductsArrayToFile(productsArray);
        } catch (error) {
            console.log('Error eliminando producto...', error);
        }
    }

    private async getProductsArrayFromFile() {
        try {
            const data = await fs.promises.readFile(this.fileName, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.log('Error leyendo archivo...', error);
        }
    }

    private async setProductsArrayToFile(products: Product[]) {
        try {
            await fs.promises.writeFile(this.fileName, JSON.stringify(products, null, 2));
        } catch (error) {
            console.log('Error escribiendo archivo...', error);
        }
    }
}