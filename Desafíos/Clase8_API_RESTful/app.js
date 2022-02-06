const express = require('express');
const productsRouter = require('./routes/products');

const app = express()

const PORT = 8080

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.use('/api/productos', productsRouter);

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}...`);
}).on('error', (error) => {
    console.log('Failed to start server', error);
})
