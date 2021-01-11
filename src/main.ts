import { config } from "dotenv";
import { resolve } from "path";
import helmet from "helmet";
import App from "./app";
import logger from "./shared/logger";
import { urlencoded } from "express";

declare global {
    namespace NodeJS {
        interface Global {
            [key: string]: any
        }
    }
}

const environment = process.env.NODE_ENV;
const { error } = config({
    path: resolve(__dirname, '../', `.env.${environment}`)
});

if (error) {
    throw new Error(error.message);
}
console.log(process.env.APP_PORT)

global.logger = logger
const app = new App({
    controllers: [],
    middlewares: [
        helmet(),
        urlencoded({
            extended: true
        }),

    ],
    port: Number(process.env.APP_PORT)
});

app.run( () => {
    global.logger.log({
        level: 'info',
        message: `Server running in ${environment} mode`
    });
})
