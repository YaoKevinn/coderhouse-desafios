import { Router } from "express";
import { CartController } from "../controllers/CartController";

const router = Router();

const cartController = new CartController('src/datas/carts.txt');

router.get('/:id/productos', async (req ,res) => {
    const id = +req.params.id;
    try {
        const products = await cartController.getProductsByCartId(id);
        if (!products) {
            res.status(404).send({
                error: `Carrito con id ${id} no encontrado.`,
            })
        } 
        res.status(200).send(products);
    } catch (error) {
        res.status(500).send({
            error: 'Error interno de servidor.'
        });
    }
});

router.post('/', async (req, res) => {
    const products = req.body.products;
    try {
        const newId = await cartController.addCart(products);
        res.status(201).send({
            newCartId: newId,
        });
    } catch (error) {
        res.status(500).send({
            error: 'Error interno de servidor.'
        });
    }
});

router.post('/:id/productos', async (req, res) => {
    const products = req.body.products;
    const cartId = +req.params.id;
    try {
        const response = await cartController.addProductToCartById(cartId, products);
        if (!response) {
            res.status(404).send({
                error: `Id de carrito ${cartId} no encontrado.`,
            })
        }
        res.status(201).send(response);
    } catch (error) {
        res.status(500).send({
            error: 'Error interno de servidor.'
        });
    }
});

router.delete('/:id', async (req, res) => {
    const id = +req.params.id;
    try {
        await cartController.deleteCartById(id);
        res.status(200).send({
            message: `Producto con id ${id} eliminado con éxito!`,
        })
    } catch (error) {
        res.status(500).send({
            error: 'Error interno de servidor.'
        });
    }
});

router.delete('/:id/productos/:id_prod', async (req, res) => {
    const cartId = +req.params.id;
    const productId = +req.params.id_prod;
    try {
        await cartController.deleteProductInCart(cartId, productId);
        res.status(200).send({
            message: `Producto con id ${productId} en carrito id ${cartId} eliminado con éxito!`,
        })
    } catch (error) {
        res.status(500).send({
            error: 'Error interno de servidor.'
        }); 
    }
});

export = router;


// El router base '/api/carrito' implementar  tres rutas disponibles para usuarios y administradores:
// a. POST: '/' - Crea un carrito y devuelve su id.
// b. DELETE: '/:id' - Vac a un carrito y lo elimina.
// c. GET: '/:id/productos' - Me permite listar todos los productos guardados en el carrito
// d. POST: '/:id/productos' - Para incorporar productos al carrito por su id de producto
// e. DELETE: '/:id/productos/:id_prod' - Eliminar un producto del carrito por su id de carrito y de
// producto