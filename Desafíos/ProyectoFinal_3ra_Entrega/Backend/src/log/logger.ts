import log4js from 'log4js';

// Logger
log4js.configure({
    appenders: {
        loggerConsola: { type: 'console' },
        errorFile: { type: 'file', filename: 'errorInfo.log' },
    },
    categories: {
        default: { appenders: ["loggerConsola"], level: "trace" },
        console: { appenders: ["loggerConsola"], level: "debug" },
        error: { appenders: ["loggerConsola", "errorFile"], level: "error" },
    },
});

export const infoLogger = log4js.getLogger();
export const errorLogger = log4js.getLogger('error');

