const fs = require('fs');

module.exports = class Contenedor {
    constructor(fileName) {
        this.fileName = fileName;
    }
    /*
        - save(Object): Number - Recibe un objeto, lo guarda en el archivo, devuelve el id asignado.
        - getById(Number): Object - Recibe un id y devuelve el objeto con ese id, o null si no está.
        - getAll(): Object[] - Devuelve un array con los objetos presentes en el archivo.
        - deleteById(Number): void - Elimina del archivo el objeto con el id buscado.
        - deleteAll(): void - Elimina todos los objetos presentes en el archivo.
    */

    async save(obj) {
        try {
            const data = await fs.promises.readFile(this.fileName, 'utf-8');

            const productsArray = JSON.parse(data);
            const newId = productsArray.length === 0 ? 1 : (productsArray.slice(-1)[0].id + 1);
            const newProduct = {
                ...obj,
                id: newId,
            }
            productsArray.push(newProduct);

            await fs.promises.writeFile(this.fileName, JSON.stringify(productsArray, null, 2), (error) => {
                console.log('Error guardando archivo: ', error);
            });

            return newId;
        } catch(error) {
            console.log('Archivo no encontrado, intentando crear nuevo archivo...');

            const productsArray = [{
                ...obj,
                id: 1,
            }];

            await fs.promises.writeFile(this.fileName, JSON.stringify(productsArray, null, 2), (error) => {
                console.log('Error guardando archivo: ', error);
            });

            return 1;
        }
    }

    async getById(id) {
        try {
            const data = await fs.promises.readFile(this.fileName, 'utf-8');
            const productsArray = JSON.parse(data);
            return productsArray.find((product) => product.id === id);
        } catch (error) {
            console.log('Archivo no encontrado');
        }
    }

    async getAll() {
        try {
            const data = await fs.promises.readFile(this.fileName, 'utf-8');
            const productsArray = JSON.parse(data);
            return productsArray;
        } catch (error) {
            console.log('Archivo no encontrado');
        }
    }

    async updateById(id, obj) {
        try {
            const data = await fs.promises.readFile(this.fileName, 'utf-8');
            let productsArray = JSON.parse(data);
            const index = productsArray.findIndex((product) => product.id === id);
            if (index !== -1) {
                productsArray[index] = { 
                    ...obj,
                    id
                };
            }
            await fs.promises.writeFile(this.fileName, JSON.stringify(productsArray, null, 2), (error) => {
                console.log('Error guardando archivo: ', error);
            });
            console.log(`Producto con ID ${id} se ha modificado con éxito`)
        } catch (error) {
            console.log('Archivo no encontrado');
        }
    }

    async deleteById(id) {
        try {
            const data = await fs.promises.readFile(this.fileName, 'utf-8');
            let productsArray = JSON.parse(data);
            productsArray = productsArray.filter((product) => product.id !== id);
            await fs.promises.writeFile(this.fileName, JSON.stringify(productsArray, null, 2), (error) => {
                console.log('Error guardando archivo: ', error);
            });
            console.log(`Producto con ID ${id} se ha borrado con éxito`)
        } catch (error) {
            console.log('Archivo no encontrado');
        }
    }

    async deleteAll() {
        await fs.promises.writeFile(this.fileName, JSON.stringify([], null, 2), (error) => {
            console.log('Error guardando archivo: ', error);
        });
    }
}