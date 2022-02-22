const express = require('express');
const { Server: IOServer } = require('socket.io');
const { Server: HttpServer } = require('http');

const handlebars = require('express-handlebars');
const productsRouter = require('./routes/products');

const Contenedor = require('./Contenedor');
const contenedor = new Contenedor('./productos.txt')

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const PORT = 8080;

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use('/api/productos', productsRouter);

app.engine('handlebars', handlebars.engine({
    defaultLayout: 'main',
}));

// Handlebars
app.set('views', './views');
app.set('view engine', 'handlebars');

// socket
app.set('socketio', io);

app.get('/', async (req, res) => {
    const products = await contenedor.getAll();
    res.render('home', {
        products: products
    });
});

httpServer.listen(PORT, () => console.log('Server on...'));

io.on('connection', (socket) => {
    console.log('Usuario conectado!') ;
    socket.emit('message', 'Mensaje desde el servidor');

    socket.on('notification', data => {
        console.log(data);
    });
});

