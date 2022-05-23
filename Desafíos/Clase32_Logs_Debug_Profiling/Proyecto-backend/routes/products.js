const express = require('express');
const dbOptions = require('../db/mysqlconfig.js');

const Contenedor = require('../Contenedor');

const router = express.Router();
const { errorLogger } = require('../middleware/infoLogger'); 

const contenedor = new Contenedor(dbOptions, 'products');

router.get('/', async (req, res) => {
    const allProducts = await contenedor.getAll();
    res.status(200).send(allProducts);
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;

    if (!id) {
        errorLogger.error(`ERROR: Falta query params id`);
        res.status(400).send({ error: 'Falta query params id' });
        return
    }

    const product = await contenedor.getById(+id);

    if (product) {
        res.status(200).send(product);
    } else {
        errorLogger.error(`ERROR: Producto no encontrado`);
        res.status(404).send({ error: 'Producto no encontrado' });
    }
});

router.post('/', async (req, res) => {
    const body = req.body;

    if (!body.title || !body.price || !body.thumbnail) {
        errorLogger.error(`ERROR: Faltan parametros en body`);
        res.status(400).send({ error: 'Faltan parametros en body' });
        return
    }
    let newProduct = {
        title: body.title,
        price: body.price,
        thumbnail: body.thumbnail
    }
    const newProductId = await contenedor.save(newProduct);

    const resObj = {
        ...newProduct,
        id: newProductId,
    };

    res.status(200).send(resObj);

    // Socket event
    var io = req.app.get('socketio');
    io.sockets.emit('newProduct', resObj);
});

router.put('/:id', async (req, res) => {
    const id = +req.params.id;
    const title = req.body.title;
    const price = req.body.price;
    const thumbnail = req.body.thumbnail; 

    if (!id) {
        errorLogger.error(`ERROR: Faltan query param: id`);
        res.status(400).send({ error: 'Faltan query param: id' });
        return
    }

    if (!title || !price || !thumbnail) {
        errorLogger.error(`ERROR: Faltan parametros en body`);
        res.status(400).send({ error: 'Faltan parametros en body' });
        return
    }

    const newProduct = {
        title,
        price,
        thumbnail,
    }

    const allProducts = await contenedor.getAll();
    const product = allProducts.find((product) => product.id === id);
    if (!product) {
        errorLogger.error(`ERROR: Producto no encontrado`);
        res.status(404).send({ error: 'Producto no encontrado' });
        return
    }

    await contenedor.updateById(id, newProduct);
        res.status(200).send({
            ...newProduct,
            id,
    });
}); 

router.delete('/:id', async (req, res) => {
    const id = +req.params.id;
    if (!id) {
        errorLogger.error(`ERROR: Faltan query param: id`);
        res.status(400).send({ error: 'Faltan query param: id' });
        return
    }

    const allProducts = await contenedor.getAll();
    const product = allProducts.find((product) => product.id === id);
    if (!product) {
        errorLogger.error(`ERROR: Producto no encontrado`);
        res.status(404).send({ error: 'Producto no encontrado' });
        return
    }

    await contenedor.deleteById(id);
    res.status(200).send({ message: `Product con id ${id} eliminado con éxito` })
});


module.exports = router;