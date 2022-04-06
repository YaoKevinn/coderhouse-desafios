const express = require('express');
const { Server: IOServer } = require('socket.io');
const { Server: HttpServer } = require('http');

const handlebars = require('express-handlebars');
// const productsRouter = require('./routes/products');
const conversationsRouter = require('./routes/conversations');
const productsTestRouter = require('./routes/products-test');

const ChatFsContainer = require('./containers/ChatFsContainer');
const chatFsContainer = new ChatFsContainer('conversations.txt');
const ContenedorTest = require('./containers/ProductTestContainer');
const contenedorTest = new ContenedorTest();

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const PORT = 8080;

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// app.use('/api/productos', productsRouter);
app.use('/api/conversations', conversationsRouter);
app.use('/api/products-test', productsTestRouter);

app.engine('handlebars', handlebars.engine({
    defaultLayout: 'main',
}));

// Handlebars
app.set('views', './views');
app.set('view engine', 'handlebars');

// socket
app.set('socketio', io);

app.get('/', async (req, res) => {
    const products = contenedorTest.getRandomProducts(5);
    res.render('home', {
        products: products
    });
});

httpServer.listen(PORT, () => console.log('Server on...'));

io.on('connection', (socket) => {
    console.log('Usuario conectado!');

    socket.on('newMessage', async data => {
        try {
            const newMessage = await chatFsContainer.writeMessage(data.author, data.text);
            io.sockets.emit('newUserMessage', newMessage);
        } catch (err) {
            console.log(err);
        }
    });
});

