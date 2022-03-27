import { Cart } from './../models/Cart';
import { Router } from "express";
import dao from '../daos/index';
import { Product } from '../models/Product';

const router = Router();
const cartDao = dao.cartDao;
const productDao = dao.productDao;

router.get('/:id/productos', async (req ,res) => {
    const id = req.params.id;
    try {
        const cart: any = await cartDao.getById(id);
        const products: Product[] = await productDao.getAll();
        if (!cart) {
            res.status(404).send({
                error: `Carrito con id ${id} no encontrado.`,
            })
        } 
        const productList: any[] = []
        cart.productos.forEach((p: any) => {
            const productToAdd = products.find(x => x.id === p);
            if (productToAdd) {
                productList.push(productToAdd);
            }
        })
        const responseJson = {
            id: cart._id ? cart._id : cart.id,
            timestamp: cart.timestamp,
            productos: productList
        };
        res.status(200).send(responseJson);
    } catch (error) {
        res.status(500).send({
            error: 'Error interno de servidor.'
        });
    }
});

router.post('/', async (req, res) => {
    const products: Product[] = req.body.products;
    try {
        const newCart: Cart = {
            productos: products.length !== 0 ? products.map((p) => p.id!) : [],
        }
        const response = await cartDao.addItem(newCart);
        res.status(201).send({
            newCartId: response.id,
        });
    } catch (error) {
        res.status(500).send({
            error: 'Error interno de servidor.'
        });
    }
});

router.post('/:id/productos', async (req, res) => {
    const products = req.body.products;
    const cartId = req.params.id;
    try {
        const response = await cartDao.addItemsByCartId(cartId, products.map((p: Product) => p.id));
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
    const id = req.params.id;
    try {
        await cartDao.deleteItemById(id);
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
    const cartId = req.params.id;
    const productId = req.params.id_prod;
    try {
        await cartDao.deleteItemInCart(cartId, productId);
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