const express = require('express');
const bcrypt = require('bcrypt');
const passport = require("passport");
const { registerLog } = require('../middleware/infoLogger');

const UserS = require('../models/User');
const MongoContainer = require('../containers/MongoContainer');

const router = express.Router();

const userManager = new MongoContainer(UserS);


router.post('/login', passport.authenticate('loginStrategy',{
    failureRedirect: '/loginFailed'
}) , async (req, res) => {
    const { username, password } = req.body;
    try {
        //validar que el usuario exista en la base de datos
        const user = await userManager.checkIfUserExists(username);
        if (user) {
            bcrypt.compare(password, user.password, function(err, result) {
                if (result) {
                    req.session.username = username;
                    res.send({message: 'Session initialized!'});
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
        res.status(500).send({
            error: "Internal server error.",
        });
    }
});

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        bcrypt.hash(password, 10, async function(err, hash) {
            const existsUser = await userManager.checkIfUserExists(username);
            if (existsUser) {
                res.status(404).send({
                    error: "User already exists."
                })
            } else {
                const result = await userManager.addItem({
                    username,
                    password: hash
                });
                res.send({
                    ok: true,
                    user: result
                })
            }
        });
    } catch (err) {
        res.status(500).send({
            error: "Internal server error.",
        });
    }
});

router.post('/logout', async (req, res) => {
    const username = req.session.username;
    req.session.destroy();
    res.send({message: 'Session initialized!', username});
});

module.exports = router;