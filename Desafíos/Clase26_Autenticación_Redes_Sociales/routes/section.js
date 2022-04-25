const express = require('express');

const ContenedorTest = require('../containers/ProductTestContainer');
const contenedorTest = new ContenedorTest();

const router = express.Router();

const { isUserLogged } = require('../middleware/authentication');

router.get('/', (req, res) => {
    console.log(req.session.username);
    if (!req.session.username) {
        res.redirect('/login'); 
    } else {
        res.redirect('/home');
    }
});

router.get('/home', isUserLogged, (req, res) => {
    const products = contenedorTest.getRandomProducts(5);
    res.render('home', {
        products: products,
        username: req.session.username
    });
});

router.get('/login', (req, res) => {
    res.render('login'); 
});

router.get('/register', (req, res) => {
    res.render('signup'); 
});

router.get('/loginFailed', (req, res) => {
    res.render('loginFailed'); 
});

router.get('/registerFailed', (req, res) => {
    res.render('signupFailed'); 
});

router.get('/logout', (req, res) => {
    res.redirect('/logout', {
        username: req.session.username
    });
    req.session.destroy();
});
module.exports = router;