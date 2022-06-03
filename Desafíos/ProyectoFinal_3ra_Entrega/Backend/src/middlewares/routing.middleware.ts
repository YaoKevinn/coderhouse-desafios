import { Request, Response, NextFunction } from 'express';

const routingErrorMiddleware = (req: Request, res: Response, next: NextFunction) => {
    res.status(404).send({
    error : -2, 
    descripcion: `Ruta ${req.path} método ${req.method} no implementada.`,
    });
};

export default routingErrorMiddleware;