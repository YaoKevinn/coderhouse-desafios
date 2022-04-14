const knex = require('knex');
const dbOptions = require('./mysqlconfig.js');

const database = knex(dbOptions);

// SCRIPT FOR Products table
database.schema.createTable('products', table => {
   table.increments('id');
   table.string('title', 50); 
   table.double('price');
   table.string('thumbnail', 512);
})
.then(() => console.log('Products table created!'))
.catch((err) => console.log(err))
.finally(() => database.destroy());

// SCRIPT FOR Chats table
database.schema.createTable('chats', table => {
    table.increments('id');
    table.string('author', 50); 
    table.string('message', 512);
    table.string('creationTime', 50);
 })
 .then(() => console.log('Chats table created!'))
 .catch((err) => console.log(err))
 .finally(() => database.destroy());