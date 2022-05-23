// Server
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const compression = require('compression');
const cluster = require("cluster");
const os = require("os");
const numeroCPUs = os.cpus().length;
const { registerLog, warningLog, errorLog } = require('./middleware/infoLogger');

// Passport
const passport = require("passport");
const initializePassport = require('./passport');
const sessionConfig = require("./db/sessionConfig");

// Socket
const { Server: IOServer } = require("socket.io");
const { Server: HttpServer } = require("http");

// Process
const parseArgs = require('minimist');
const defaultOptions = { default: { port: 8080 } }
const args = parseArgs(process.argv.slice(2), defaultOptions);

// Handlebars
const handlebars = require("express-handlebars");

// Routers
// const productsRouter = require('./routes/products');
const conversationsRouter = require("./routes/conversations");
const productsTestRouter = require("./routes/products-test");
const authRouter = require("./routes/auth");
const sectionRouter = require("./routes/section");
const randomsRouter = require("./routes/randoms");

// Containers
const ChatFsContainer = require("./containers/ChatFsContainer");
const chatFsContainer = new ChatFsContainer("conversations.txt");

// App: init.
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(compression());

// App: Mongo session
app.use(session(sessionConfig));

// App: Passport
app.use(passport.initialize());
app.use(passport.session());
initializePassport();

// App: handlebars
app.engine(
    "handlebars",
    handlebars.engine({
        defaultLayout: "main",
    })
);
app.set("views", "./views");
app.set("view engine", "handlebars");

// App: Socket
app.set("socketio", io);

// App: Routers
// app.use('/api/productos', productsRouter);
app.use("/api/conversations", registerLog, conversationsRouter);
app.use("/api/products-test", registerLog, productsTestRouter);
app.use("/api/auth", registerLog, authRouter);
// app.use("/api/randoms", registerLog, randomsRouter);
app.use("", sectionRouter);
app.all('*', warningLog, () => {
    console.log('Llamada a ruta no implementada...');
});

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
        httpServer.listen(args.port, () =>
            console.log(`App initialized on port ${args.port} in cluster mode...`)
        );
    }   
} else {
    httpServer.listen(args.port, () =>
            console.log(`App initialized on port ${args.port} in fork mode...`)
        );
}


io.on("connection", (socket) => {
    console.log("Usuario conectado!");

    socket.on("newMessage", async (data) => {
        try {
            const newMessage = await chatFsContainer.writeMessage(
                data.author,
                data.text
            );
            io.sockets.emit("newUserMessage", newMessage);
        } catch (err) {
            console.log(err);
        }
    });
});
