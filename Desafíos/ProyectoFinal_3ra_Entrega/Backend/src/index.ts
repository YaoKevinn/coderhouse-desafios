import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import session from 'express-session';
import passport from 'passport';
import initializePassport from './passport';
import { sessionOption } from './db/config';
import path from 'path';
import multer from 'multer';
import bodyParser from 'body-parser';
import parseArgs from 'minimist';
import cluster from 'cluster';
import os from 'os';
require('dotenv').config()

import productsRouter from './routes/products.routes';
import cartRouter from './routes/cart.routes';
import authRouter from './routes/auth.routes';
import isValidToken from './middlewares/token.middleware';

import routingErrorMiddleware from './middlewares/routing.middleware';

const app = express();
const defaultOptions = { default: { port: 8080 }};
const args = parseArgs(process.argv.slice(2), defaultOptions);
const numeroCPUs = os.cpus().length;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: true
}));
app.use(session(sessionOption));
app.use(passport.initialize());
app.use(passport.session());
initializePassport();
var dir = path.join(__dirname, '/uploads');
app.use(express.static(dir));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb'}));

app.use('/api/productos', isValidToken, productsRouter);
app.use('/api/carrito', isValidToken, cartRouter);
app.use('/api/auth', authRouter);

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, './uploads'));
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + '.jpg');
    },
})
var upload = multer({ storage: storage })
// const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single('profile-file'), async (req, res) => {
    const file = req.file;
    res.send(file);
});

app.get('/:url', (req, res) => {
     res.sendFile(__dirname + '/' + 'uploads' + '/' + req.params.url);
});
app.all('*', routingErrorMiddleware, () => {
    console.log('Llamada a ruta no implementada...');
});

const port = process.env.PORT || 8080;

// app.listen(port, async () => {
//     console.log(`Ecommerce server initialized on port ${port}...`);
// });

if (args.modo && args.modo === 'cluster') {
    if (cluster.isPrimary) {
        //vamos a crear los clones de ese proceso principal
        for (let i = 0; i < numeroCPUs; i++) {
            cluster.fork();
        }
    
        cluster.on("exit", (worker, code, signal) => {
            console.log(`Process ${worker.process.pid} destroyed!`);
            cluster.fork();
        });
    } else {
        app.listen(args.port, async () => {
            console.log(`CLUSTER MODE: Ecommerce server initialized on port ${port}...`);
        });
    }   
} else {
    app.listen(args.port, async () => {
        console.log(`FORK MODE: Ecommerce server initialized on port ${port}...`);
    });
}
