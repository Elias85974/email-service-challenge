import {UserRepository} from "../repository/Users";
import {HandledError} from "../HandledError";
import {User} from "../constants";
import bcrypt from 'bcrypt';
import {createToken} from "../middleware/Authentication";

const secretKey: string = process.env.JWT_SECRET as string;
const userRepo: UserRepository = new UserRepository();

export async function login(loginData: {email: string, password: string}): Promise<string> {
    const foundUser: User | null = await userRepo.getFromMail(loginData.email);
    if (foundUser && bcrypt.compareSync(loginData.password, foundUser.password)) {
        return await createToken(foundUser.email);
    }
    throw new HandledError("Username or password did not match");
}