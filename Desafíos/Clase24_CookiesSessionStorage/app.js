const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');

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
app.use(cookieParser());
app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://yaokevinn:1234@cluster0.gwx3c.mongodb.net/mySessionDB?authSource=admin&replicaSet=atlas-rtc62t-shard-0&readPreference=primary&ssl=true',
        ttl: 10 * 60
    }),
    secret: 'mongosecretexample',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 10 * 60 * 1000
    }
}));


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

app.get('/', (req, res) => {
    console.log(req.session.username);
    if (!req.session.username) {
        res.render('login'); 
    } else {
        const products = contenedorTest.getRandomProducts(5);
        res.render('home', {
            products: products,
            username: req.session.username
        });
    }
});

app.get('/logout', (req, res) => {
    res.redirect('/logout', {
        username: req.session.username
    });
    req.session.destroy();
});

app.post('/api/login', async (req, res) => {
    req.session.username = req.body.username
    res.send({message: 'Session initialized!'});
});

app.post('/api/logout', async (req, res) => {
    const username = req.session.username;
    req.session.destroy();
    res.send({message: 'Session initialized!', username});
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

