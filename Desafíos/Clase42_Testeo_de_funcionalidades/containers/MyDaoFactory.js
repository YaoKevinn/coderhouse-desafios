const ProductDaoMongo = require('./daos/productDaoMongo');
const UserDaoMongo = require('./daos/userDaoMongo');

let instance = null;

class MyDaoFactory {
    static instance;

    constructor() {}

    static getInstance() {
        if (!instance) {
          instance = new MyDaoFactory();
        }
        return instance;
    }

    createDao(dbType, daoType) {
        switch (dbType) {
            case 'mongo':
                if (daoType === 'product') return ProductDaoMongo.getInstance();
                if (daoType === 'user') return UserDaoMongo.getInstance();
            default:
                if (daoType === 'product') return ProductDaoMongo.getInstance();
                if (daoType === 'user') return UserDaoMongo.getInstance();
        }
    }
}

module.exports = MyDaoFactory