const bcrypt = require('bcrypt');
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require('./models/User');

const initializePassport = () => {
    passport.serializeUser((user, done) => {
        return done(null, user);
    });
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            return done(err, user);
        });
    });
    
    // Estrategia login
    passport.use(
        "loginStrategy", 
        new LocalStrategy((username, password, done) => {
            User.findOne({ username: username }, (err, userFound) => {
                if (err) {
                    console.log("error", err);
                    return done(err);
                }
                if (!userFound) {
                    console.log("user does not exists");
                    return done(null, false, { message: "user does not exists" });
                }
                if (!bcrypt.compareSync(password, userFound.password)) {
                    console.log("invalid password");
                    return done(null, false, { message: "invalid password" });
                }
                console.log("userFound", userFound);
                return done(null, userFound);
            });
        })
    );
}

module.exports = initializePassport