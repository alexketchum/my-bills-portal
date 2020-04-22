import { NextFunction, Response, Request } from "express";
import { Controller, Put, Wrapper, Delete, ClassWrapper } from "@overnightjs/core";
import { OK } from "http-status-codes";
import * as ExpressAsyncHandler from "express-async-handler";
import validator from "validator";
import User from "../models/User";
import Bill from "../models/Bill";
import { NotFoundError, BadRequestError, UnauthorizedError } from "../helpers/error";
import { comparePasswords, hashPassword } from "../helpers/utils";

@Controller("user")
@ClassWrapper(ExpressAsyncHandler)
class UserController {
    @Put("update")
    private async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { id, email, newPassword, originalPassword } = req.body;
        const user = await User.findByPk(id);

        if (!user) {
            return NotFoundError(`User not found`);
        }

        if (!email || !validator.isEmail(email)) {
            return BadRequestError("Invalid email address.")
        }

        user.email = email

        if (newPassword && originalPassword) {
            const passwordsMatch = await comparePasswords(originalPassword, user.password);

            if (passwordsMatch) {
                if (newPassword == originalPassword) {
                    return BadRequestError("New password must be different from the current password.");
                }

                user.password = await hashPassword(newPassword);
            }
            else {
                return UnauthorizedError("Wrong password entered.");
            }
        }

        user.save()
            .then(() => res.status(OK).send("User updated."))
            .catch(next);
    }

    @Delete("delete/")
    private async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { id, group_id } = req.body;
        const userGroup = await User.findAll({ where: { group_id: group_id }});

        // If there is only one user with the group id than we'll delete all bills in that group,
        if (userGroup.length == 1) {
            Bill.destroy({ where: { group_id: group_id} })
                .then((result) => console.log(`Bills in group ${group_id} have been deleted`))
                .catch(next);
        }

        User.destroy({ where: { id: id } })
            .then(() => res.status(OK).send("User successfully deleted."))
            .catch(next);
    }
}

export default UserController;
