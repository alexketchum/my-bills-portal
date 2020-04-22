import * as fs from "fs";
import * as path from "path";

const ErrorLogger = (message: string, stackTrace?: string): void => {
    const filePath = path.join(__dirname, "../../", "log/error.log");
    const errorMessage = `${new Date()} - ${message}\n${stackTrace}\n\n`;

    fs.appendFile(filePath, errorMessage, (err) => {
        if (err) {
            throw err;
        }
    });
}

export default ErrorLogger;

