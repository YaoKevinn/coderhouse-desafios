const parseArgs = require('minimist');
const defaultOptions = { default: { port: 8080, dbType: 'mongo' } }
const args = parseArgs(process.argv.slice(2), defaultOptions);

const MyDaoFactory = require('../containers/MyDaoFactory');
const productDao = MyDaoFactory.getInstance().createDao(args.dbType, 'product');

const getAllProducts = async () => {
    return await productDao.getAll();
}

const getProductById = async (id) => {
    return await productDao.getById(id);
}

const createProduct = async (product) => {
    return await productDao.addItem(product);
}

const updateProductById = async (id, product) => {
    await productDao.updateItemByMongoId(id, product);
}

const deleteProductById = async (id) => {
    await productDao.deleteItemByMongoId(id);
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProductById,
    deleteProductById
}