import { UserDaoMongo } from './users/UserDaoMongo';
import { ProductDaoMongo } from './products/ProductDaoMongo';
import { CartDaoFirebase } from './carritos/CartDaoFirebase';
import { ProductDaoFirebase } from './products/ProductDaoFirebase';
import { CartDaoFs } from './carritos/CartDaoFs';
import { ProductDaoFs } from "./products/ProductDaoFs";
import { CartDaoMongo } from './carritos/CartDaoMongo';

enum DB_TYPE {
    FS = 'FS',
    MONGO = 'MONGO',
    FIREBASE = 'FIREBASE'
}

let dbToUse: string = DB_TYPE.MONGO;

let productDao: ProductDaoFs | ProductDaoFirebase | ProductDaoMongo;
let cartDao: CartDaoFs | CartDaoFirebase | CartDaoMongo;
let userDao: UserDaoMongo;

switch (dbToUse) {
    case DB_TYPE.FS:
        productDao = new ProductDaoFs();
        cartDao = new CartDaoFs();
        userDao = new UserDaoMongo();
        break;
    case DB_TYPE.FIREBASE:
        productDao = new ProductDaoFirebase();
        cartDao = new CartDaoFirebase();
        userDao = new UserDaoMongo();
        break;
    case DB_TYPE.MONGO:
        productDao = new ProductDaoMongo();
        cartDao = new CartDaoMongo();
        userDao = new UserDaoMongo();
        break;
    default:
        productDao = new ProductDaoFs();
        cartDao = new CartDaoFs();
        userDao = new UserDaoMongo();
        break;
}

export default {
    productDao,
    cartDao,
    userDao
};