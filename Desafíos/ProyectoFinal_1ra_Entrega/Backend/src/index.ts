import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import productsRouter from './routes/products.routes';
import cartRouter from './routes/cart.routes';

import routingErrorMiddleware from './middlewares/routing.middleware';

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

app.listen(port, () => {
    console.log(`Ecommerce server initialized on port ${port}...`);
});