import { Request, Response, NextFunction } from "express";
import { Controller, Post, Wrapper } from "@overnightjs/core";
import { v4 as uuidv4 } from "uuid";
import validator from "validator";
import { OK } from "http-status-codes";
import * as ExpressAsyncHandler from "express-async-handler";
import User, { UserProps } from "../models/User";
import { hashPassword } from "../helpers/utils";
import { BadRequestError } from "../helpers/error";

@Controller("signup")
class SignupController {
    @Post()
    @Wrapper(ExpressAsyncHandler)
    private async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { email, password } = req.body;

        // Make sure the email and password are good.
        if (!email || !password) {
            return BadRequestError("Missing email or password.");
        }
        
        if (!validator.isEmail(email)) {
            return BadRequestError("Invalid email address.");
        }

        // Next we'll hash the password and generate some ids,
        const hashedPassword = await hashPassword(password);
        const userId = uuidv4();
        const groupId = uuidv4();

        const newUser: UserProps = {
            id: userId,
            group_id: groupId,
            email: email,
            password: hashedPassword
        }

        User.create(newUser)
            .then(() => res.status(OK).send("New user created."))
            .catch(next)
    }
}

export default SignupController;
