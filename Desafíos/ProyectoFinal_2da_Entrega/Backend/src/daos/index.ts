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

let dbToUse: string = DB_TYPE.FS;

let productDao: ProductDaoFs | ProductDaoFirebase | ProductDaoMongo;
let cartDao: CartDaoFs | CartDaoFirebase | CartDaoMongo;

switch (dbToUse) {
    case DB_TYPE.FS:
        productDao = new ProductDaoFs();
        cartDao = new CartDaoFs();
        break;
    case DB_TYPE.FIREBASE:
        productDao = new ProductDaoFirebase();
        cartDao = new CartDaoFirebase();
        break;
    case DB_TYPE.MONGO:
        productDao = new ProductDaoMongo();
        cartDao = new CartDaoMongo();
        break;
    default:
        productDao = new ProductDaoFs();
        cartDao = new CartDaoFs();
        break;
}

export default {
    productDao,
    cartDao
};