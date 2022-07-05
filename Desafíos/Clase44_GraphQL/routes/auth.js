const express = require('express');
const { login, signup, logout } = require('../controllers/auth');

const passport = require("passport");
const router = express.Router();

router.post('/login', passport.authenticate('loginStrategy',{
    failureRedirect: '/loginFailed'
}) , login);

router.post('/register', signup);

router.post('/logout', logout);

module.exports = router;