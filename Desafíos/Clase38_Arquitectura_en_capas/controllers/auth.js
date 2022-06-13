const bcrypt = require('bcrypt');
const authService = require('../services/auth');

const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        //validar que el usuario exista en la base de datos
        const user = await authService.getUserByUsername(username);
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
}

const signup = async (req, res) => {
    const { username, password } = req.body;
    try {
        bcrypt.hash(password, 10, async function(err, hash) {
            const existsUser = await authService.getUserByUsername(username);
            if (existsUser) {
                res.status(404).send({
                    error: "User already exists."
                })
            } else {
                const result = await authService.addUser(username, hash);
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
}

const logout = async (req, res) => {
    const username = req.session.username;
    req.session.destroy();
    res.send({message: 'Session initialized!', username});
}

module.exports = {
    login,
    signup,
    logout,
}