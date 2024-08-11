import { getFromMail } from "../repository/Users";
import jwt from 'jsonwebtoken';
import {HandledError} from "../HandledError";

// @ts-ignore
const secretKey: string = process.env.JWT_SECRET;

export async function login(loginData: {email: string, password: string}): Promise<string> {
    const foundUser = await getFromMail(loginData.email);
    if (foundUser && foundUser.password === loginData.password) {
        return jwt.sign({ email: foundUser.email }, secretKey, { expiresIn: 3600 });
    }
    throw new HandledError("Username or password did not match");
}