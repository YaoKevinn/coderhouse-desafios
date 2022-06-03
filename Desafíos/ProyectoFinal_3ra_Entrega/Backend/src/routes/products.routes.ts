import { Router } from "express";
import dao from '../daos/index';
import adminMiddleware from '../middlewares/admin.middleware';
import { errorLogger } from "../log/logger";

const router = Router();
const productDao = dao.productDao;

router.get('/:id?', async (req, res) => {
    const id = req.params.id;
    try {
        let response;
        if (id) {
           response = await productDao.getById(id);
           if (!response) {
               res.status(404).send({
                   error: 'Producto no encontrado.'
               })
           }
        } else {
           response = await productDao.getAll();
        }
        res.status(200).send(response);   
    } catch (error) {
        errorLogger.error(`Error: ${error}`);
        res.status(500).send({
            error: 'Error interno de servidor.'
        })
    }
});

router.post('/', adminMiddleware, async (req, res) => {
    const newProduct = req.body;
    try {
        const response = await productDao.addItem(newProduct);
        res.status(201).send(response);
    } catch (error) {
        errorLogger.error(`Error: ${error}`);
        res.status(500).send({
            error: 'Error interno de servidor.'
        });
    }
});

router.put('/:id', adminMiddleware, async (req, res) => {
    const id = req.params.id;
    const newProduct = req.body;
    try {
        const product = productDao.getById(id);
        if (!product) {
            res.status(404).send({
                error: 'Producto no encontrado.'
            })
        } else {
            const response = await productDao.updateItemById(id, newProduct);
            res.status(200).send(response);
        }
    } catch (error) {
        errorLogger.error(`Error: ${error}`);
        res.status(500).send({
            error: 'Error interno de servidor.'
        });
    }
});

router.delete('/:id', adminMiddleware, async (req, res) => {
    const id = req.params.id;
    try {
        await productDao.deleteItemById(id);
        res.status(200).send({
            message: `Product con id ${id} eliminado con éxito!`,
        })
    } catch (error) {
        errorLogger.error(`Error: ${error}`);
        res.status(500).send({
            error: 'Error interno de servidor.'
        });
    }
});

export = router;
