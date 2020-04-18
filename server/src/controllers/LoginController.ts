import { NextFunction, Response, Request } from "express";
import { Controller, Post, Wrapper } from "@overnightjs/core";
import { BAD_REQUEST, NOT_FOUND, OK, UNAUTHORIZED } from "http-status-codes";
import * as ExpressAsyncHandler from "express-async-handler";
import User from "../models/User";
import { ErrorHandler } from "../helpers/error";
import { comparePasswords, generateJWT } from "../helpers/utils";

interface UserProfileData {
    id: string;
    group_id: string;
    email: string;
    reminder_emails: boolean;
}

@Controller("login")
class LoginController {
    @Post()
    @Wrapper(ExpressAsyncHandler)
    private login(req: Request, res: Response, next: NextFunction): void {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new ErrorHandler(BAD_REQUEST, "Invalid email or password.");
        }

        User.findOne({
            where: {
                email: email
            }
        }).then(async (user) => {
                if (!user) {
                    throw new ErrorHandler(NOT_FOUND, "User not found.");
                }

                const passwordsMatch = await comparePasswords(password, user.password);

                if (passwordsMatch) {
                    // We'll get only the data that needs to be sent to the client,
                    const userProfileData: UserProfileData = {
                        id: user.id,
                        group_id: user.group_id,
                        email: user.email,
                        reminder_emails: user.reminder_emails
                    }
                    const token = generateJWT(user.id);

                    res.status(OK)
                        .cookie("token", token, { maxAge: 86400 })
                        .json(userProfileData);
                }
                else {
                    throw new ErrorHandler(UNAUTHORIZED, "Invalid login credentials.");
                }
            })
            .catch(next);
    }
}

export default LoginController;
