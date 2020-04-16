import { Request, Response, NextFunction } from "express";
import { Controller, Post, Wrapper } from "@overnightjs/core";
import { v4 as uuidv4 } from "uuid";
import validator from "validator";
import { OK, BAD_REQUEST } from "http-status-codes";
import * as ExpressAsyncHandler from "express-async-handler";
import User from "../models/User";
import { hashPassword } from "../helpers/utils";
import { ErrorHandler } from "../helpers/error";

interface NewUserData {
    id: string;
    group_id: string;
    email: string;
    password: string;
}

@Controller("signup")
class SignupController {
    @Post()
    @Wrapper(ExpressAsyncHandler)
    private async create(req: Request, res: Response, next: NextFunction) {
        const { email, password } = req.body;

        // Make sure the email and password are good.
        if (!email || !password) {
            throw new ErrorHandler(BAD_REQUEST, "Missing email or password.");
        }
        
        if (!validator.isEmail(email)) {
            throw new ErrorHandler(BAD_REQUEST, "Invalid email adress.");
        }

        // Next we'll hash the password and generate some ids,
        const hashedPassword = await hashPassword(password);
        const userId = uuidv4();
        const groupId = uuidv4();

        const newUser: NewUserData = {
            id: userId,
            group_id: groupId,
            email: email,
            password: hashedPassword
        }

        User.create(newUser)
            .then(() => res.status(OK).send("New user created"))
            .catch(next)
    }
}

export default SignupController;
