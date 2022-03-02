import { ProductController } from '../controllers/ProductController';
import { Router } from "express";
import adminMiddleware from '../middlewares/admin.middleware';

const router = Router();

const productController = new ProductController('src/datas/products.txt');

router.get('/:id?', async (req, res) => {
    const id = req.params.id;
    try {
        let response;
        if (id) {
           response = await productController.getProductById(+id);
           if (!response) {
               res.status(404).send({
                   error: 'Producto no encontrado.'
               })
           }
        } else {
           response = await productController.getAllProducts();
        }
        res.status(200).send(response);   
    } catch (error) {
        res.status(500).send({
            error: 'Error interno de servidor.'
        })
    }
});

router.post('/', adminMiddleware, async (req, res) => {
    const newProduct = req.body;
    try {
        const response = await productController.addProduct(newProduct);
        res.status(201).send(response);
    } catch (error) {
        res.status(500).send({
            error: 'Error interno de servidor.'
        });
    }
});

router.put('/:id', adminMiddleware, async (req, res) => {
    const id = +req.params.id;
    const newProduct = req.body;
    try {
        const product = productController.getProductById(id);
        if (!product) {
            res.status(404).send({
                error: 'Producto no encontrado.'
            })
        } else {
            const response = await productController.updateProductById(id, newProduct);
            res.status(200).send(response);
        }
    } catch (error) {
        res.status(500).send({
            error: 'Error interno de servidor.'
        });
    }
});

router.delete('/:id', adminMiddleware, async (req, res) => {
    const id = +req.params.id;
    try {
        await productController.deleteProductById(id);
        res.status(200).send({
            message: `Product con id ${id} eliminado con éxito!`,
        })
    } catch (error) {
        res.status(500).send({
            error: 'Error interno de servidor.'
        });
    }
});

export = router;
