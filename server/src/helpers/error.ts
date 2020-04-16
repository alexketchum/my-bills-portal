export interface ErrorHandlerProps {
    statusCode: number;
    message: string;
}

export class ErrorHandler extends Error implements ErrorHandlerProps {
    statusCode: number;
    message: string;

    constructor(statusCode: number, message: string) {
        super();

        this.statusCode = statusCode;
        this.message = message;
    }
}
