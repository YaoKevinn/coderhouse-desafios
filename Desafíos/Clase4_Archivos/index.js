const fs = require('fs');

class Contenedor {
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
            productsArray.push({
                ...obj,
                id: newId,
            });

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

const inicializar = async () => {
    const contenedor = new Contenedor('productos.txt');

    // -------------------- Función: save(obj) -> id --------------------
    const id = await contenedor.save({
        title: "Escuadra",
        price: 123.45,
        thumbnail:
            "https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png",
    });
    console.log('ID del producto agregado: ', id); // Devuelve 1, ya que es la primera carga de datos, se crea un archivo nuevo

    const id2 = await contenedor.save({
        title: "Calculadora",
        price: 234.56,
        thumbnail:
            "https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png",
    });
    console.log('ID del producto agregado: ', id2); // Devuelve 2, ya que el último objeto dentro del archivo es 1


    // -------------------- Función: getbyId(id) -> obj --------------------
    const objectById = await contenedor.getById(1);
    if (objectById) {
        console.log(objectById);
    } else {
        console.log('ID no encontrado');
    }
    // Devuelve el objeto con id: 1


    // -------------------- Función: getAll() -> obj[] --------------------
    const allArray = await contenedor.getAll();
    console.log(allArray);
    // Devuelve el array que contiene los objetos con id 1 y 2


    // -------------------- Función: deleteById(id) -> void --------------------
    await contenedor.deleteById(2);
    // mostrando el resultado con la función de getAll()
    const allArray2 = await contenedor.getAll();
    console.log(allArray2);
    // Devolveria array de un solo objeto (ya que el objeto con id: 2 fue borrado)


    // -------------------- Función: deleteAll(id) -> void --------------------
    await contenedor.deleteAll();
    // mostrando el resultado con la función de getAll()
    const allArray3 = await contenedor.getAll();
    console.log(allArray3);
    // Devolveria [], ya que se borraron todos los elementos dentro del archivo
}

inicializar()