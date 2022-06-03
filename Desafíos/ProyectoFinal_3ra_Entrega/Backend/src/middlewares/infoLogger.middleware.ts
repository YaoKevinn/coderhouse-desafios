import { infoLogger, errorLogger } from '../log/logger';

export const registerLog = (req: any, res: any, next: any) => {
    infoLogger.trace(`${req.method} ${req.originalUrl}`);
    next();
};

export const errorLog = (req: any, res: any, next: any) => {
    errorLogger.error(`Error: ${req.method} ${req.originalUrl}`);
    next();
};
