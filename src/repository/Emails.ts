import {Email, prismaClient} from "../constants";
import {UserRepository} from "./Users";

const userRepo: UserRepository = new UserRepository();

export class EmailsRepository {
    async sendMail(email: Email) {
        const { sender, ...emailData } = email;
        return prismaClient.email.create({
            data: {
                senderId: await userRepo.getIdFromMail(sender),
                date: new Date(),
                ...emailData
            }
        })
    }

    async createEmail(userId: number, emailData: { subject: string, message: string, recipient: string }): Promise<void> {
        await prismaClient.email.create({
            data: {
                senderId: userId,
                date: new Date(),
                ...emailData
            }
        });
    }

    async deleteEmails(userId: number): Promise<void> {
        await prismaClient.email.deleteMany({
            where: {
                senderId: userId,
            },
        });
    }
}