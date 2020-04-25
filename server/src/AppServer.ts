import { Express, NextFunction, Response, Request } from "express";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import { Server } from "@overnightjs/core";
import * as fs from "fs";
import * as path from "path";
import * as listEndPoints from "express-list-endpoints";
import getControllers from "./helpers/registerControllers";
import sequelize from "../database/database";
import { ErrorHandlerProps } from "./helpers/error";
import ErrorHandlerMiddlware from "./middleware/ErrorHandlerMiddleware";

class AppServer extends Server {
     constructor() {
        super(true);
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(cookieParser());
        this.setupControllers().then(() => {
            this.app.use((err: ErrorHandlerProps, req: Request, res: Response, next: NextFunction) => ErrorHandlerMiddlware(err, res));
        })
    }

    private async setupControllers() {
        const controllers = await getControllers();
        super.addControllers(controllers);
    }

    public async start(port: number): Promise<void> {
        await sequelize.sync();

        // Logs a list of the registered endpoints
        if (process.env.NODE_ENV == "development") {
            console.table(listEndPoints(<Express>this.app));
        }

        // Creates the log directory if it does not already exist,
        const logDir = path.join(__dirname, "../", "log");
        fs.mkdir(logDir, { recursive: true}, (err) => {
            if (err) {
                throw err;
            }
        });
        
        // TODO: Create email cronjob function and invoke it here.

        this.app.listen(port, () => {
            console.log(`Server listening on port: ${port}`);
        });
    }
}

export default AppServer;
