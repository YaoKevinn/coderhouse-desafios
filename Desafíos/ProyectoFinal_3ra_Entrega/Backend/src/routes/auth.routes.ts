import { User } from './../models/User';
import { Router } from "express";
import passport from 'passport';
import dao from '../daos/index';
import bcrypt from 'bcrypt';
import { Cart } from '../models/Cart';
import jwt from "jsonwebtoken";
import { createTransport } from 'nodemailer';
import { errorLogger } from '../log/logger';
import 'dotenv/config'

const router = Router();
const userDao = dao.userDao;
const cartDao = dao.cartDao;

// NODEMAILER
const transporter = createTransport({
   host: 'smtp.ethereal.email',
   port: 587,
   auth: {
       user: process.env.NODEMAILER_TEST_MAIL,
       pass: process.env.NODEMAILER_PASS
   }
});
 

declare module 'express-session' {
    interface SessionData {
      username: string;
    }
  }

router.get('/getMe/:token', async (req, res) => {
    const token = req.params.token;
        jwt.verify(token, "coderhouse_codification_key", (err: any, user: any) => {
            if (err) {
                return res.status(401).send({ 
                    error: "Invalid token"
                });
            }
            res.json({
                user: user._doc
            })
        });
});

router.post('/login', passport.authenticate('loginStrategy') , async (req, res) => {
    const { username, password } = req.body;
    console.log(req.params);
    try {
        //validar que el usuario exista en la base de datos
        const user = await userDao.checkIfUserExists(username);
        if (user) {
            bcrypt.compare(password, user.password, function(err, result) {
                if (result) {
                    jwt.sign(
                        { ...user, password: undefined },
                        "coderhouse_codification_key",
                        { expiresIn: "1h" },
                        (err, token) => {
                            if (err) return res.send({ 
                                error: 'Token generation error' 
                            });
                            res.json({ 
                                token: token,
                                user,
                            });
                        }
                    );       
                } else {
                    res.status(402).send({
                        error: "Invalid credentials.",
                    });
                    return;
                }
            });          
        } else {
            res.status(404).send({
                error: "User not found.",
            });
        }
    } catch (err) {
        errorLogger.error(`Error: ${err}`);
        res.status(500).send({
            error: "Internal server error.",
        });
    }
});

router.post('/register', async (req, res) => {
    const userBody: User = req.body;
    try {
        bcrypt.hash(userBody.password, 10, async function(err, hash) {
            const existsUser = await userDao.checkIfUserExists(userBody.username);
            if (existsUser) {
                res.status(404).send({
                    error: "User already exists."
                })
            } else {
                
                const newCart: Cart = {
                    productos: [],
                }
                const response = await cartDao.addItem(newCart);
                userBody.password = hash;
                userBody.cartId = response.id;
                const result = await userDao.addItem(userBody);

                const mailOptions = {
                    from: 'Servidor NodeJS',
                    to: process.env.NODEMAILER_TEST_MAIL,
                    subject: 'Nuevo registro',
                    html: `
                        <div class="card" style="width: 18rem;">
                            <p>Username: ${userBody.username}</p>
                            <p>Nombre: ${userBody.name}</p>
                            <p>Dirección: ${userBody.address}</p>
                            <p>Edad: ${userBody.year}</p>
                            <p>Teléfono: ${userBody.phone}</p>
                        </div>
                    `,
                 }
                
                 let info = await transporter.sendMail(mailOptions);
                 console.log(info);

                res.send({
                    ok: true,
                    user: result
                })
            }
        });
    } catch (err) {
        errorLogger.error(`Error: ${err}`);
        res.status(500).send({
            error: "Internal server error.",
        });
    }
});

export = router;