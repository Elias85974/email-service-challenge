import {UserRepository} from "../repository/Users";
import jwt from 'jsonwebtoken';
import {HandledError} from "../HandledError";
import {User} from "../constants";
import bcrypt from 'bcrypt';

const secretKey: string = process.env.JWT_SECRET as string;
const userRepo: UserRepository = new UserRepository();

export async function login(loginData: {email: string, password: string}): Promise<string> {
    const foundUser: User | null = await userRepo.getFromMail(loginData.email);
    if (foundUser && bcrypt.compareSync(loginData.password, foundUser.password)) {
        return jwt.sign({ email: foundUser.email }, secretKey, { expiresIn: 3600 });
    }
    throw new HandledError("Username or password did not match");
}