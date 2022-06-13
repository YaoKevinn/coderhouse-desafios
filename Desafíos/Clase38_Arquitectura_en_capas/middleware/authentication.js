// Middleware check if user is logged
const isUserLogged = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect("/login");
};

module.exports = { isUserLogged }