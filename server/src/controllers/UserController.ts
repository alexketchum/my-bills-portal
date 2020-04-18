import { NextFunction, Response, Request } from "express";
import { Controller, Put, Wrapper, Delete } from "@overnightjs/core";
import { BAD_REQUEST, NOT_FOUND, OK, UNAUTHORIZED } from "http-status-codes";
import * as ExpressAsyncHandler from "express-async-handler";
import User from "../models/User";
import { ErrorHandler } from "../helpers/error";
import { comparePasswords, hashPassword } from "../helpers/utils";

@Controller("user")
class UserController {
    @Put("update")
    @Wrapper(ExpressAsyncHandler)
    private async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { id, email, newPassword, originalPassword } = req.body;
        const user = await User.findByPk(id);

        if (!user) {
            throw new ErrorHandler(NOT_FOUND, "User not found.");
        }

        if (email && user.email != email) {
            user.email = email
        }

        if (newPassword && originalPassword) {
            const passwordsMatch = await comparePasswords(originalPassword, user.password);

            if (passwordsMatch) {
                if (newPassword == originalPassword) {
                    throw new ErrorHandler(BAD_REQUEST, "New password must be different from the current password.");
                }

                user.password = await hashPassword(newPassword);
            }
            else {
                throw new ErrorHandler(UNAUTHORIZED, "Wrong password entered.");
            }
        }

        user.save()
            .then(() => res.status(OK).send("User updated."))
            .catch(next);
    }

    @Delete("delete.:id")
    private deleteUser(req: Request, res: Response, next: NextFunction): void {
        // TODO: delete user from user table and all bills associated with the user
        // (unless there is another user associated with the bills)
    }
}

export default UserController;
