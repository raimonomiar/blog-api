import { NextFunction, Request, Response } from "express";

export const loggerMiddleware = function (request: Request, response: Response, next: NextFunction) {
    const message = `[${request.method}] url->${request.url} ip->${request.ip} body->${JSON.stringify(request.body)}`;
    global.logger.log({
        level: "info",
        message
    })
    next();
}

