import { Request, Response, NextFunction } from "express";
import { Controller, ClassWrapper, Get, Post, Put } from "@overnightjs/core";
import { v4 as uuidv4 } from "uuid";
import { OK } from "http-status-codes";
import * as ExpressAsyncHandler from "express-async-handler";
import User from "../models/User";
import Bill, { BillProps } from "../models/Bill";
import { BadRequestError, UnauthorizedError, NotFoundError } from "../helpers/error";

@Controller("bills")
@ClassWrapper(ExpressAsyncHandler)
class BillsController {
    @Get(":group_id")
    private async getAllBills(req: Request, res: Response): Promise<void> {
        const { group_id } = req.params;

        const bills: BillProps[] = await Bill.findAll({
            where: { group_id: group_id },
            attributes: [ "id", "name", "due_date", "amount_due" ]
        });

        if (!bills) {
            return NotFoundError(`Bills for group: ${group_id} not found.`);
        }

        res.status(OK).json(bills);
    }

    @Get("view/:id")
    private async getBill(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { id } = req.params;
        
        Bill.findByPk(id)
            .then((bill) => {
                if (!bill) {
                    return NotFoundError(`Bill not found`);
                }

                res.status(OK).json(bill);
            })
            .catch(next);
    }

    @Put("update")
    private updateBill(req: Request, res: Response, next: NextFunction): void {
        Bill.update(req.body, { where: { id: req.body.id } })
            .then((result) => {
                if (!result[0]) {
                    return NotFoundError(`Bill with id ${req.body.id} not found.`);
                }
                res.status(OK).json(result);
            })
            .catch(next)
    }

    @Post()
    private create(req: Request, res: Response, next: NextFunction): void {
        const { group_id, name, due_date, amount_due, amount_left, login, password, url, notes } = req.body;

        if (!group_id) {
            return UnauthorizedError("Group id is missing.");
        }

        User.findOne({ where: { group_id: group_id } })
            .then(async (user) => {
                if (!user) {
                    return UnauthorizedError(`User with group id: ${group_id} not found`);
                }

                if (!name) {
                    return BadRequestError("Please provide a name for your new bill.");
                }
        
                const id = uuidv4();
                const newBill: BillProps = {
                    id: id,
                    group_id: group_id,
                    name: name,
                    due_date: due_date,
                    amount_due: amount_due,
                    amount_left: amount_left,
                    login: login,
                    password: password,
                    url: url,
                    notes: notes
                }

                Bill.create(newBill)
                    .then(() => res.status(OK).send("New bill created."))
                    .catch(next);
            })
            .catch(next);
    }
}

export default BillsController;
