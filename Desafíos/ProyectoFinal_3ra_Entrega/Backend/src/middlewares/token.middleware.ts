import jwt from "jsonwebtoken";

const isValidToken = (req: any, res: any, next: any) => {
    const headerToken = req.headers['authorization'];
    if (typeof headerToken !== "undefined") {
        const token = headerToken;
        let success = true;
        jwt.verify(token, "coderhouse_codification_key", (err: any, user: any) => {
            if (err) {
                success = false
                return res.status(401).send({ 
                    error: "Invalid token"
                });
            }
        });
        if (success) {
            next();   
        }
    } else {
        res.status(401).send({
            error: "Invalid token"
        });
    }
};

export default isValidToken