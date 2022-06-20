const log4js = require("log4js");

// Logger
log4js.configure({
    appenders: {
        loggerConsola: { type: 'console' },
        warningFile: { type: 'file', filename: 'warningInfo.log' },
        errorFile: { type: 'file', filename: 'errorInfo.log' },
    },
    categories: {
        default: { appenders: ["loggerConsola"], level: "trace" },
        console: { appenders: ["loggerConsola"], level: "debug" },
        warn: { appenders: ["loggerConsola", "warningFile"], level: "warn" },
        error: { appenders: ["loggerConsola", "errorFile"], level: "error" },
    },
});

const infoLogger = log4js.getLogger();
const warnLogger = log4js.getLogger('warn');
const errorLogger = log4js.getLogger('error');

module.exports = { infoLogger, warnLogger, errorLogger };