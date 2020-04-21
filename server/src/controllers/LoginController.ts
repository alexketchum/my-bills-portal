import { NextFunction, Response, Request } from "express";
import { Controller, Post, Wrapper } from "@overnightjs/core";
import { OK } from "http-status-codes";
import * as ExpressAsyncHandler from "express-async-handler";
import User from "../models/User";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../helpers/error";
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
            return BadRequestError("Missing email or password");
        }

        User.findOne({
            where: {
                email: email
            }
        }).then(async (user) => {
                if (!user) {
                    return NotFoundError(`User: ${email} not found.`);
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
                    return UnauthorizedError("Invalid email or password.");
                }
            })
            .catch(next);
    }
}

export default LoginController;
