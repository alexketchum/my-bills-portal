import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import OldToken from "../models/OldToken";
import { UnauthorizedError } from "../helpers/error";

const CheckToken = (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.cookies;

    // If a token is the cookies, than we'll verify it
    // This will make sure that it's not only a valid token, but that it's not expired
    if (token) {
        jwt.verify(token, <jwt.Secret>process.env.JWT_KEY, (err: any, result: any) => {
            if (err) {
                return UnauthorizedError("Invalid token.")
            }
            
            // This is a secondary measure to make sure that this token isn't in the OldTokens table,
            // Users should never hit this point since their token will either expire or it will be removed upon logging out.
            OldToken.findOne({ where: { token: token } })
                .then((results) => {
                    if (results) {
                        return UnauthorizedError("Invalid token.");
                    }
                })
                .catch(next);
        })
    }
    else {
        return UnauthorizedError("Missing token.");
    }

    next();
}

export default CheckToken;
