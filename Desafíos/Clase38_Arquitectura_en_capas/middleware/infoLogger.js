const { infoLogger, warnLogger, errorLogger } = require('../log/logger');

const registerLog = (req, res, next) => {
    infoLogger.trace(`${req.method} ${req.originalUrl}`);
    next();
};

const warningLog = (req, res, next) => {
    warnLogger.warn(`Invalid API url: ${req.method} ${req.originalUrl}`);
    next();
};

const errorLog = (req, res, next) => {
    errorLogger.error(`Error: ${req.method} ${req.originalUrl}`);
    next();
};

module.exports = { registerLog, warningLog, errorLog }