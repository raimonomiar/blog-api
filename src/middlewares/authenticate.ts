import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

export const authMiddleware = function (request: Request, response: Response, next: NextFunction) {

    const authKey = request.header("Authorization");
    try {
        const decoded = verify(authKey, process.env.JWT_PRIVATE_KEY);
        response.locals.User = decoded;
        next();
    } catch (error) {
        global.logger.log({
            level: "error",
            message: error.message,
            detail: error.stack
        });

        response.status(401).json({ message: "Invalid Token" })
    }

}