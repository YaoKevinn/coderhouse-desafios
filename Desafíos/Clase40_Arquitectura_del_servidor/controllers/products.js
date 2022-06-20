const { errorLogger } = require('../middleware/infoLogger'); 
const productService = require('../services/product');

const getAllProducts = async (req, res) => {
    const allProducts = await productService.getAllProducts();
    res.status(200).send(allProducts);
}

const getProduct = async (req, res) => {
    const id = req.params.id;

    if (!id) {
        errorLogger.error(`ERROR: Falta query params id`);
        res.status(400).send({ error: 'Falta query params id' });
        return
    }

    const product = await productService.getProductById(+id);

    if (product) {
        res.status(200).send(product);
    } else {
        errorLogger.error(`ERROR: Producto no encontrado`);
        res.status(404).send({ error: 'Producto no encontrado' });
    }
}

const createNewProduct = async (req, res) => {
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
    const newProductId = await productService.createProduct(newProduct);

    const resObj = {
        ...newProduct,
        id: newProductId,
    };

    res.status(200).send(resObj);

    // Socket event
    var io = req.app.get('socketio');
    io.sockets.emit('newProduct', resObj);
}

const updateProduct = async (req, res) => {
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

    const allProducts = await productService.getAllProducts();
    const product = allProducts.find((product) => product.id === id);
    if (!product) {
        errorLogger.error(`ERROR: Producto no encontrado`);
        res.status(404).send({ error: 'Producto no encontrado' });
        return
    }

    await productService.updateProductById(id, newProduct);

    res.status(200).send({
        ...newProduct,
        id,
    });
}

const deleteProduct = async (req, res) => {
    const id = +req.params.id;
    if (!id) {
        errorLogger.error(`ERROR: Faltan query param: id`);
        res.status(400).send({ error: 'Faltan query param: id' });
        return
    }

    const allProducts = await productService.getAllProducts();
    const product = allProducts.find((product) => product.id === id);
    if (!product) {
        errorLogger.error(`ERROR: Producto no encontrado`);
        res.status(404).send({ error: 'Producto no encontrado' });
        return
    }

    await productService.deleteProductById(id);
    res.status(200).send({ message: `Product con id ${id} eliminado con éxito` })
}

module.exports = {
    getAllProducts,
    getProduct,
    createNewProduct,
    updateProduct,
    deleteProduct
}