import { BAD_REQUEST, NOT_FOUND, UNAUTHORIZED } from "http-status-codes";

export interface ErrorHandlerProps {
    statusCode: number;
    message: string;
    stack?: string
}

class ErrorHandler extends Error implements ErrorHandlerProps {
    statusCode: number;
    message: string;
    stack?: string;

    constructor(statusCode: number, message: string) {
        super();

        this.statusCode = statusCode;
        this.message = message;
        this.stack = Error().stack;
    }
}

export const BadRequestError = (message: string): void => {
    throw new ErrorHandler(BAD_REQUEST, message);
}

export const NotFoundError = (message: string): void => {
    throw new ErrorHandler(NOT_FOUND, message);
}

export const UnauthorizedError = (message: string): void => {
    throw new ErrorHandler(UNAUTHORIZED, message);
}
