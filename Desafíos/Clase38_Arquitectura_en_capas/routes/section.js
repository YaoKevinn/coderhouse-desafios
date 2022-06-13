const express = require('express');
const os = require("os");
const numeroCPUs = os.cpus().length;

const ContenedorTest = require('../containers/ProductTestContainer');
const contenedorTest = new ContenedorTest();

// Process
const parseArgs = require('minimist');
const defaultOptions = { default: { port: 8080 } }
const args = parseArgs(process.argv.slice(2), defaultOptions);

const router = express.Router();

const { isUserLogged } = require('../middleware/authentication');

router.get('/', (req, res) => {
    // console.log(req.session.username);
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

router.get('/info', (req, res) => {
    console.log({
        entryArguments: JSON.stringify(args, null, 2),
        executionPath: process.execPath,
        platform: process.platform,
        processId: process.pid,
        nodeVersion: process.version,
        projectFile: process.cwd(),
        rss: JSON.stringify(process.memoryUsage(), null, 2),
        cpuNums: numeroCPUs,
    });
    res.render('info', {
        entryArguments: JSON.stringify(args, null, 2),
        executionPath: process.execPath,
        platform: process.platform,
        processId: process.pid,
        nodeVersion: process.version,
        projectFile: process.cwd(),
        rss: JSON.stringify(process.memoryUsage(), null, 2),
        cpuNums: numeroCPUs,
    });
});

module.exports = router;