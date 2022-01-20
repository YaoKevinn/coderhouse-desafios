/*
    >> Consigna: 
    1) Declarar una clase Usuario

    2) Hacer que Usuario cuente con los siguientes atributos:
    nombre: String
    apellido: String
    libros: Object[]
    mascotas: String[]

    Los valores de los atributos se deberán cargar a través del constructor, al momento de crear las instancias.

    3) Hacer que Usuario cuente con los siguientes métodos:
    getFullName(): String. Retorna el completo del usuario. Utilizar template strings.
    addMascota(String): void. Recibe un nombre de mascota y lo agrega al array de mascotas.
    countMascotas(): Number. Retorna la cantidad de mascotas que tiene el usuario.
    addBook(String, String): void. Recibe un string 'nombre' y un string 'autor' y debe agregar un objeto: { nombre: String, autor: String } al array de libros.
    getBookNames(): String[]. Retorna un array con sólo los nombres del array de libros del usuario.
*/

class Usuario {
    constructor(nombre, apellido, libros = [], mascotas = []) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.libros = libros;
        this.mascotas = mascotas;
    }

    getFullName() {
        return `${this.nombre} ${this.apellido}`;
    }

    addMascota(nombre) {
       this.mascotas.push(nombre);
    }

    countMascota() {
        return this.mascotas.length;
    }

    addBook(nombre, autor) {
        this.libros.push({
           nombre,
           autor,
        });
    }

    getBookNames() {
        return this.libros.map((libro) => libro.nombre);
    }
}

// 4) Crear un objeto llamado usuario con valores arbitrarios e invocar todos sus métodos.

const user = new Usuario('Juan', 'Pepe', [{ nombre: 'Harry Potter', autor: 'J. K. Rowling' }], ['Lucky']);

console.log(user.getFullName()); // retorna 'Juan Pepe'

user.addMascota('Coco');

console.log(user.countMascota()); // retorna 2

user.addBook('Rich Dad Poor Dad', 'Robert Kiyosaki'); 

console.log(user.getBookNames()); // retorna ['Harry Potter', 'Rich Dad Poor Dad']

