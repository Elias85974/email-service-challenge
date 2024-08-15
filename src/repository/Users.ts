import { prismaClient } from "../constants";
import { HandledError } from "../HandledError";

export type User = {
    id: number,
    email: string,
    userName: string,
    password: string,
    emailsSent: number
};

export class UserRepository {
    async createUser(registerData: { email: string, userName: string, password: string }): Promise<void> {
        await prismaClient.user.create({
            data: registerData
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