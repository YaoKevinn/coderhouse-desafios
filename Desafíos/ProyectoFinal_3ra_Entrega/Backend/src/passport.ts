import bcrypt from 'bcrypt';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from './models/User';

const initializePassport = () => {
    passport.serializeUser((user, done) => {
        return done(null, user);
    });
    passport.deserializeUser((id, done) => {
        User.findById(id, (err: any, user: any) => {
            return done(err, user);
        });
    });
    
    // Estrategia login
    passport.use(
        "loginStrategy", 
        new LocalStrategy((username, password, done) => {
            User.findOne({ username: username }, (err: any, userFound: any) => {
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

export default initializePassport