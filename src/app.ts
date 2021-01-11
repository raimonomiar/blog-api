import Express, { Application, Request, Response } from "express";
import { connect } from "mongoose";
import { IApplicationOptions, IDatabaseConnectionOptions } from "./shared/interfaces";
import cors from "cors";

export default class App {
    private app: Application;
    port: number;

    constructor({ controllers, middlewares, port }: IApplicationOptions) {
        this.app = Express();
        this.port = port;

        this.middlewares(middlewares);

        this.createDatabaseConnection({
            database: process.env.DB_DATABASE,
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            host: process.env.DB_HOST,
            authSource: process.env.DB_AUTH_SOURCE,
            port: parseInt(process.env.DB_PORT, 10)
        });

        this.initRoutes(controllers);
    }

    async createDatabaseConnection(connOptions: IDatabaseConnectionOptions) {
        try {
            let connectionUri = `mongodb://${connOptions.host}:${connOptions.port}/${connOptions.database}`;
            if (connOptions.username || connOptions.password) {
                connectionUri = `mongodb://${connOptions.username || ''}:${connOptions.password || ''}@${connOptions.host}:${connOptions.port}/${connOptions.database}`;
            }

            //auth source
            if (connOptions.authSource) {
                connectionUri = `${connectionUri}?authSource=${connOptions.authSource}`
            }

            //logging connection 
            if (process.env.NODE_ENV !== "production") {
                global.logger.log({
                    level: 'debug',
                    message: connectionUri,
                    metadata: {
                        useNewUrlParser: true,
                        useUnifiedTopology: true,
                        useFindAndModify: false,
                        useCreateIndex: true
                    }
                })
            }

            await connect(connectionUri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
                useCreateIndex: true
            });

        } catch (error) {
            global.logger.log({
                level: "error",
                message: "Error connecting to database"
            })
        }
    }

    middlewares(middlewares: any[]) {

        if (['production'].indexOf(process.env.NODE_ENV) !== -1) {
            const whiteList: string[] = [] //Array of whielist domains here;

            const corsOptions = {
                origin: (origin: string, callback: any) => {
                    console.log(`CORS request origin -> ${origin}`);

                    if (whiteList.indexOf(origin) !== -1) {
                        callback(null, true)
                    } else {
                        callback('Domain is not valid')
                    }
                }
            }

            this.app.use(cors(corsOptions));
        } else {
            this.app.use(cors());
        }

        middlewares.forEach(middleware => {
            this.app.use(middleware);
        })
    }

    initRoutes(controllers: any[]) {
        this.app.get('/', (request: Request, response: Response) => {
            response.json({
                status: 'UP'
            });
        });

        controllers.forEach(controller => {
            this.app.use(`/${controller.route}`, controller.router);
        });
    }

    run(cb: () => void) {
        this.app.listen(this.port, cb);
    }
}
