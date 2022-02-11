const express = require('express');
const Contenedor = require('../Contenedor');

const router = express.Router()

const contenedor = new Contenedor('./productos.txt')

router.get('/', async (req, res) => {
    const allProducts = await contenedor.getAll();
    res.status(200).send(allProducts);
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;

    if (!id) {
        res.status(400).send({ error: 'Falta query params id' });
        return
    }

    const product = await contenedor.getById(+id);

    if (product) {
        res.status(200).send(product);
    } else {
        res.status(404).send({ error: 'Producto no encontrado' });
    }
});

router.post('/', async (req, res) => {
    const title = req.body.title;
    const price = req.body.price;
    const thumbnail = req.body.thumbnail;

    if (!title || !price || !thumbnail) {
        res.status(400).send({ error: 'Faltan parametros en body' });
        return
    }
    let newProduct = {
        title,
        price,
        thumbnail
    }
    const newProductId = await contenedor.save(newProduct);

    // res.status(200).send({
    //     ...newProduct,
    //     id: newProductId,
    // });
    res.redirect('http://localhost:8080/');
});

router.put('/:id', async (req, res) => {
    const id = +req.params.id;
    const title = req.body.title;
    const price = req.body.price;
    const thumbnail = req.body.thumbnail; 

    if (!id) {
        res.status(400).send({ error: 'Faltan query param: id' });
        return
    }

    if (!title || !price || !thumbnail) {
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
        res.status(400).send({ error: 'Faltan query param: id' });
        return
    }

    const allProducts = await contenedor.getAll();
    const product = allProducts.find((product) => product.id === id);
    if (!product) {
        res.status(404).send({ error: 'Producto no encontrado' });
        return
    }

    await contenedor.deleteById(id);
    res.status(200).send({ message: `Product con id ${id} eliminado con éxito` })
});


module.exports = router;