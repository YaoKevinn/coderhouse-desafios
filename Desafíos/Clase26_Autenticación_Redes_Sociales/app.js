const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const initializePassport = require('./passport');

const { Server: IOServer } = require("socket.io");
const { Server: HttpServer } = require("http");

const sessionConfig = require("./db/sessionConfig");
const handlebars = require("express-handlebars");
// const productsRouter = require('./routes/products');
const conversationsRouter = require("./routes/conversations");
const productsTestRouter = require("./routes/products-test");
const authRouter = require("./routes/auth");
const sectionRouter = require("./routes/section");

const ChatFsContainer = require("./containers/ChatFsContainer");
const chatFsContainer = new ChatFsContainer("conversations.txt");

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const PORT = 8080;

app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Mongo session
app.use(session(sessionConfig));

// Passport
app.use(passport.initialize());
app.use(passport.session());
initializePassport();

app.engine(
    "handlebars",
    handlebars.engine({
        defaultLayout: "main",
    })
);

// Handlebars
app.set("views", "./views");
app.set("view engine", "handlebars");

// socket
app.set("socketio", io);

// app.use('/api/productos', productsRouter);
app.use("/api/conversations", conversationsRouter);
app.use("/api/products-test", productsTestRouter);
app.use("/api/auth", authRouter);
app.use("", sectionRouter);

httpServer.listen(PORT, () => console.log("Server on..."));

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
