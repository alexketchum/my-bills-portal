import { Response } from "express";
import { ErrorHandlerProps } from "../helpers/error";
import ErrorLogger from "../helpers/logger";

const ErrorHandlerMiddleware = (err: ErrorHandlerProps, res: Response): void => {
    const { statusCode, message } = err;

    ErrorLogger(err.message, err.stack);
    res.status(statusCode ? statusCode : 400).json({ message: message });
}

export default ErrorHandlerMiddleware;
