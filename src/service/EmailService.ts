import nodemailer from 'nodemailer';
import {UserRepository} from "../repository/Users";
import {User} from "../repository/Users";
import {HandledError} from "../HandledError";

const userRepo: UserRepository = new UserRepository();

export const sendMail = async (from: string, to: string, subject: string, message: string): Promise<void> => {
    const transporter = nodemailer.createTransport({
        service: process.env.MAIL_HOST,
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD
        }
    });
    const formattedMessage: string = `<h1>${message}</h1>`

    const mailOptions = {
        from: from,
        to: to,
        subject: subject,
        html: formattedMessage,
    };

    const user: User | null = await userRepo.getFromMail(from);
    if (user) {
        if (user.emailsSent < 1000) {
            await transporter.sendMail(mailOptions);
            await userRepo.incrementEmailCount(from);
        }
        else {
            throw new HandledError("You have reached your daily limit of emails");
        }
    }
    else {
        throw new HandledError("User is not allowed to be in this platform");
    }
}