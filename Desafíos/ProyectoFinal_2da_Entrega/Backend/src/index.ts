import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import productsRouter from './routes/products.routes';
import cartRouter from './routes/cart.routes';

import routingErrorMiddleware from './middlewares/routing.middleware';

import { ProductDaoFirebase } from './daos/products/ProductDaoFirebase';
import { CartDaoFirebase } from './daos/carritos/CartDaoFirebase';
import ProductS from './models/Product';
import { ProductDaoMongo } from './daos/products/ProductDaoMongo';
import { CartDaoMongo } from './daos/carritos/CartDaoMongo';

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

app.use('/api/productos', productsRouter);
app.use('/api/carrito', cartRouter)

app.all('*', routingErrorMiddleware, () => {
    console.log('Llamada a ruta no implementada...');
});

const port = process.env.PORT || 8080;

app.listen(port, async () => {
    console.log(`Ecommerce server initialized on port ${port}...`);
    // let manager = new CartDaoMongo();
    // const newItem = {
    //     nombre: "Macbook 2021 16.2' M1 Pro",
    //     description: "Macbook 2021 16.2' M1 Pro",
    //     codigo: "123456",
    //     foto: "https://i.blogs.es/bb1d2e/1366_2000/1366_2000.jpg",
    //     precio: 2800,
    //     stock: 400,
    //     timestamp: "2022-03-01T05:02:15.109Z",
    //     descripcion: "Macbook 2021 16.2' M1 Pro"
    //   };
    //   await manager.addItem(newItem);
    //   console.log(await manager.getAll());
    //   await manager.deleteItemById('6240ac46e0d88cd87275d13c')
    //   console.log(await manager.updateItemById('6240ac46e0d88cd87275d13c', newItem));
    // console.log(await manager.getById('6240ac46e0d88cd87275d13c'));
    // console.log(await manager.updateItemById('ujiGpDzQGdLS4rFuGReJ', newItem));
    // await manager.deleteItemById('zyYpEeVJGrjtwnmFd67u');
    // const newCart = {
    //     productos: ['6240b0dfdbbfbfa01f4da044'],
    //     timestamp: '2022-03-27T18:53:11.069Z'
    // };
    // manager.addItem(newCart);
    // console.log(await manager.getById('6240b297855c1cc64bee0798'));

    // console.log(await manager.updateItemById('6240b297855c1cc64bee0798', newCart))
    // await manager.deleteItemById('mx8YRpSkwK81CoPPVvEP')
    // await manager.deleteItemInCart('6240b297855c1cc64bee0798', '6240b0dfdbbfbfa01f4da044')
});