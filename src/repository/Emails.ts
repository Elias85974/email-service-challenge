import {Email, prismaClient} from "../constants";
import {UserRepository} from "./Users";

const userRepo: UserRepository = new UserRepository();

export class EmailsRepository {
    async sendMail(email: Email) {
        return prismaClient.email.create({
            data: {
                subject: email.subject,
                senderId: await userRepo.getIdFromMail(email.sender),
                message: email.message,
                date: new Date()
            }
        })
    }
}