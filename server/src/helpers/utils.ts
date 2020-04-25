import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

export const hashPassword = (password: string): Promise<string> => {
    return bcrypt.hash(password, 10);
}

export const comparePasswords = (plainPassword: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(plainPassword, hashedPassword);
}

export const generateJWT = (id: string): string => {
    const secret = <jwt.Secret>process.env.JWT_KEY

    return jwt.sign({ id: id }, secret, { expiresIn: 86400 });
}
