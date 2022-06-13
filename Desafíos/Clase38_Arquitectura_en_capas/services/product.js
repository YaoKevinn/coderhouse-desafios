const dbOptions = require('../db/mysqlconfig.js');
const Contenedor = require('../Contenedor');
const { errorLogger } = require('../middleware/infoLogger'); 
const contenedor = new Contenedor(dbOptions, 'products');

const getAllProducts = async () => {
    return contenedor.getAll();
}

const getProductById = async (id) => {
    return contenedor.getById(id);
}

const createProduct = async (product) => {
    return contenedor.save(newProduct)
}

const updateProductById = async (id, product) => {
   contenedor.updateById(id, product);
}

const deleteProductById = async (id) => {
    contenedor.deleteById(id);
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProductById,
    deleteProductById
}