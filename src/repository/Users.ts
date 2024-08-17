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

    async getIdFromMail(email: string): Promise<number> {
        try {
            const user = await prismaClient.user.findFirstOrThrow({
                where: {
                    email: email
                },
            })
            return user.id;
        }
        catch (e) {
            throw new HandledError("No user found in your request");
        }
    }

    async getAllUsersStatistics(): Promise<{ email: string, emailsSent: number }[]> {
    const users = await prismaClient.user.findMany({
        select: {
            email: true,
            emails: {
                where: {
                    date: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0)),
                        lt: new Date(new Date().setHours(23, 59, 59, 999))
                    }
                }
            }
        }
    });

    return users.map(user => ({
        email: user.email,
        emailsSent: user.emails.length
    })).filter(user => user.emailsSent > 0);
}

    async isAdmin(email: string): Promise<boolean> {
        const foundUser: User | null = await this.getFromMail(email);
        if (foundUser) {
            return foundUser.id === 1;
        }
        throw new HandledError("User is not allowed to be in this platform");
    }

    async getCurrentDayMailsCount(email: string): Promise<number> {
        const user = await prismaClient.user.findFirst({
            where: {
                email: email
            },
            include: {
                emails: true
            }
        });

        if (!user) {
            throw new HandledError("User not found");
        }

        return user.emails.length;
    }
}