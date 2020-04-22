import { NextFunction, Response, Request } from "express";
import { Controller, Post } from "@overnightjs/core";
import { OK } from "http-status-codes";
import OldToken from "../models/OldToken";
import { BadRequestError } from "../helpers/error";

@Controller("logout")
class LogoutController {
    @Post()
    private logout(req: Request, res: Response, next: NextFunction): void {
        // add the jwt to the OldToken table and remove it from the headers,
        const { token } = req.cookies

        OldToken.create({ token: token })
            .then((result) => {
                if (result) {
                    res.status(OK).clearCookie("token").send("Successfully logged out.");
                }
                else {
                    return BadRequestError("Whoops! Something went wrong!");
                }
            })
            .catch(next)
    }
}

export default LogoutController;
