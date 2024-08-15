import {prismaClient, User} from "../constants";
import { HandledError } from "../HandledError";
import bcrypt from 'bcrypt';

export class UserRepository {
    async createUser(registerData: { email: string, userName: string, password: string }): Promise<void> {
        const hashedPassword: string = await bcrypt.hash(registerData.password, 16);
        await prismaClient.user.create({
            data: {
                email: registerData.email,
                userName: registerData.userName,
                password: hashedPassword
            }
        });
    }

    async getFromMail(email: string): Promise<User | null> {
        return prismaClient.user.findFirst({
            where: {
                email: email
            }
        });
    }

    async incrementEmailCount(email: string): Promise<void> {
        try {
            await prismaClient.user.update({
                where: {
                    email: email
                },
                data: {
                    emailsSent: {
                        increment: 1
                    }
                }
            });
        } catch (e) {
            throw new HandledError("User is not allowed to be in this platform");
        }
    }

    async allUsers(): Promise<User[]> {
        return prismaClient.user.findMany();
    }
}