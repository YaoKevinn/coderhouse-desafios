const knex = require('knex');

module.exports = class Contenedor {
    constructor(dbOption, tableName) {
        this.dbOption = dbOption;
        this.tableName = tableName;
    }
    /*
        - save(Object): Number - Recibe un objeto, lo guarda en el archivo, devuelve el id asignado.
        - getById(Number): Object - Recibe un id y devuelve el objeto con ese id, o null si no está.
        - getAll(): Object[] - Devuelve un array con los objetos presentes en el archivo.
        - deleteById(Number): void - Elimina del archivo el objeto con el id buscado.
        - deleteAll(): void - Elimina todos los objetos presentes en el archivo.
    */

    async save(obj) {
        const database = knex(this.dbOption);
        try {
            const response = await database(this.tableName).insert([obj]);
            // return created product id
            return response[0];
        } catch (err) {
            console.log(err);
            return -1
        } finally {
            database.destroy()
        }
    }

    async getById(id) {
        const database = knex(this.dbOption);
        try {
            const data = await  database.from(this.tableName).select('*').where('id', id);
            let products = JSON.parse(JSON.stringify(data));
            // return first element of array result
            return products[0];
        } catch (error) {
            console.log(err);
            return undefined;
        } finally {
            database.destroy()
        }
    }

    async getAll() {
        const database = knex(this.dbOption);
        try {
            const data = await database.from(this.tableName).select('*');
            let products = JSON.parse(JSON.stringify(data));
            // console.log(products);
            return products;
        } catch (error) {
            console.log(err);
            return [];
        } finally {
            database.destroy()
        }
    }

    async updateById(id, obj) {
        const database = knex(this.dbOption);
        try {
            await database.from(this.tableName).where('id', id).update(obj);
        } catch (err) {
            console.log(err);
        } finally {
            database.destroy()
        }
    }

    async deleteById(id) {
        const database = knex(this.dbOption);
        try {
            await database.from(this.tableName).where('id', id).del();
        } catch (err) {
            console.log(err);
        } finally {
            database.destroy()
        }
    }

    async deleteAll() {
        const database = knex(this.dbOption);
        try {
            await database(this.tableName).truncate();
        } catch (err) {
            console.log(err);
        } finally {
            database.destroy()
        }
    }
}