import { promises as fs } from 'fs';

export class FsContainer {
    public path: string;

    constructor(path: string) {
        this.path = path;
    }

    async getAll() {
        try {
            const items = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(items);   
        } catch (err) {
            console.log('Error getting all items in file...', err);
            return [];
        }
    }

    async getById(id: string) {
        const items = await this.getAll();
        return items.find((i: any) => i.id === id);
    }

    async addItem(item: any) {
        try {
            const currentItems: any[] = await this.getAll();
            const newId: string = currentItems.length === 0 ? "1" : (+currentItems.slice(-1)[0].id + 1).toString();

            const newItem: any = {
                ...item,
                timestamp: new Date().toISOString(),
                id: newId,
            }

            currentItems.push(newItem);
            
            await this.setItemsArrayToFile(currentItems);  
            return newItem;
        } catch (err) {
            console.log('Error adding item in file...', err);
        }
    }

    async updateItemById(id: string, item: any) {
        try {
            const itemsArray: any[] = await this.getAll();
            
            const index = itemsArray.findIndex((i) => i.id === id);

            if (index !== -1) {
                const modifiedItem = {
                    ...itemsArray[index],
                    ...item,
                }
                itemsArray[index] = modifiedItem;
            }

            await this.setItemsArrayToFile(itemsArray);
            return itemsArray[index];

        } catch (error) {
            console.log('Error modifying item in file...', error);
        }
    } 

    async deleteItemById(id: string) {
        try {
            let itemsArray: any[] = await this.getAll();
            itemsArray = itemsArray.filter((i) => i.id !== id);
            await this.setItemsArrayToFile(itemsArray);
        } catch (error) {
            console.log('Error removing item in file...', error);
        }
    }


    private async setItemsArrayToFile(items: any[]) {
        try {
            await fs.writeFile(this.path, JSON.stringify(items, null, 2));
        } catch (error) {
            console.log(error);
        }
    }
}