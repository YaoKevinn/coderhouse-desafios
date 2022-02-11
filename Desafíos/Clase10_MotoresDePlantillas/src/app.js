const express = require('express');
const handlebars = require('express-handlebars');
const productsRouter = require('./routes/products');

const Contenedor = require('./Contenedor');
const contenedor = new Contenedor('./productos.txt')

const app = express();

const PORT = 8080;

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use('/api/productos', productsRouter);

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}...`);
}).on('error', (error) => {
    console.log('Failed to start server', error);
});

app.engine('handlebars', handlebars.engine({
    defaultLayout: 'main',
}));

// Handlebars
// app.set('views', './views');
// app.set('view engine', 'handlebars');

// Pug
// app.set('views', './views_pug');
// app.set('view engine', 'pug');

// Ejs
app.set('views', './views_ejs');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/productos', async (req, res) => {
    const products = await contenedor.getAll();
    res.render('products', {
        products: products
    });
});

