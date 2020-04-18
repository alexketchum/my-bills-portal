import { NextFunction, Response, Request } from "express";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import { Server } from "@overnightjs/core";
import SignupController from "./controllers/SignupController";
import LoginController from "./controllers/LoginController";
import LogoutController from "./controllers/LogoutController";
import UserController from "./controllers/UserController";
import sequelize from "../database/database";
import { ErrorHandlerProps } from "./helpers/error";
import ErrorHandlerMiddlware from "./middleware/ErrorHandlerMiddleware";

class AppServer extends Server {
    constructor() {
        super(true);
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(cookieParser());
        this.setupControllers();
        this.app.use((err: ErrorHandlerProps, req: Request, res: Response, next: NextFunction) => ErrorHandlerMiddlware(err, res));
    }

    private setupControllers(): void {
        const signupController = new SignupController();
        const loginController = new LoginController();
        const logoutController = new LogoutController();
        const userController = new UserController();

        super.addControllers(
            [signupController, loginController, logoutController, userController]
        );
    }

    public async start(port: number): Promise<void> {
        await sequelize.sync();

        this.app.listen(port, () => {
            console.log(`Server listening on port: ${port}`);
        });
    }
}

export default AppServer;
