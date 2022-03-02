import { NextFunction, Request, Response } from 'express';

const adminMiddleware = (req: Request, res: Response, next: NextFunction) : void => {
    
    const administrador = true; // Más adelante integrar con lógica de Login, por ahora hardcodeado

    if (administrador) {
        next();
    } else {
        res.status(401).send({
            error: -1, 
            descripcion: `Ruta ${req.originalUrl} método ${req.method} no autorizada`, 
        });
    }
}

export default adminMiddleware;