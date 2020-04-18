import { Response } from "express";
import { ErrorHandlerProps } from "../helpers/error";

const ErrorHandlerMiddleware = (err: ErrorHandlerProps, res: Response): void => {
    const { statusCode, message } = err;

    console.log(err); // TODO: Have better error logging.

    res.status(statusCode).json({ status: "Error", statusCode: statusCode , message: message });
}

export default ErrorHandlerMiddleware;
