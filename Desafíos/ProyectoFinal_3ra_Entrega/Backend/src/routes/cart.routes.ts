import { Cart } from './../models/Cart';
import { Router } from "express";
import dao from '../daos/index';
import { Product } from '../models/Product';
import twilio from 'twilio';
import { route } from './products.routes';
import { createTransport } from 'nodemailer';
import { errorLogger } from '../log/logger';
import 'dotenv/config'

const router = Router();
const cartDao = dao.cartDao;
const productDao = dao.productDao;

// TWILIO
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN

const client = twilio(accountSid, authToken);

// NODEMAILER
const transporter = createTransport({
   host: 'smtp.ethereal.email',
   port: 587,
   auth: {
       user: process.env.NODEMAILER_TEST_MAIL,
       pass: process.env.NODEMAILER_PASS
   }
});

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
        errorLogger.error(`Error: ${error}`);
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
        errorLogger.error(`Error: ${error}`);
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
        errorLogger.error(`Error: ${error}`);
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
        errorLogger.error(`Error: ${error}`);
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
        errorLogger.error(`Error: ${error}`);
        res.status(500).send({
            error: 'Error interno de servidor.'
        }); 
    }
});

router.post('/createOrder/:id', async (req, res) => {
    const products: Product[] = req.body.products;
    const { name, username, phone } = req.body;
    const cartId: string = req.params.id;

    const options = {
        body: `Nuevo pedido de ${name} - ${username}`,
        from: process.env.TWILIO_WHATSAPP_FROM,
        to: 'whatsapp:+5491161029065'
     }

     let html = `
         <div class="card" style="width: 18rem;">
             <p>Username: ${username}</p>
             <p>Nombre: ${name}</p>
     `;
     products.forEach((p) => {
        html += `
            <p>- ${p.nombre} ${p.precio}</p>
        `
     });
     html += `</div>`

     const mailOptions = {
        from: 'Servidor NodeJS',
        to: process.env.NODEMAILER_TEST_MAIL,
        subject: `Nuevo pedido de ${name} - ${username}`,
        html: html,
     }

     try {
         // Whatsapp
        const message = await client.messages.create(options);
        console.log(message);

        // Mail to admin
         let adminMail = await transporter.sendMail(mailOptions);
         console.log(adminMail);

         // Mail to client
         await client.messages.create({         
            to: phone,
            from: process.env.TWILIO_DEFAULT_PHONE,
            body: 'Pedido recibido, se encuentra en proceso!',
          });
    
        res.json({ ok: true, message: 'Order created!' })
     } catch (error) {
        errorLogger.error(`Error: ${error}`);
        console.log(error)
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