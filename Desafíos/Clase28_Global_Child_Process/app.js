// Server
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");

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
app.use("/api/conversations", conversationsRouter);
app.use("/api/products-test", productsTestRouter);
app.use("/api/auth", authRouter);
app.use("/api/randoms", randomsRouter);
app.use("", sectionRouter);

httpServer.listen(args.port, () => console.log(`App initialized on port ${args.port}...`));

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
