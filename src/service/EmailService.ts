import nodemailer from 'nodemailer';
import {UserRepository} from "../repository/Users";
import {HandledError} from "../HandledError";
import {Email, User} from "../constants";

const userRepo: UserRepository = new UserRepository();

export const sendMail = async (email: Email): Promise<void> => {
    const transporter = nodemailer.createTransport({
        service: process.env.MAIL_HOST,
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD
        }
    });
    const formattedMessage: string = `<p>${email.sender} wrote:<br>${email.message.replace(/\n/g, '<br>')}</p>`;

    const mailOptions = {
        from: email.sender,
        to: email.recipient,
        subject: email.subject,
        html: formattedMessage,
    };

    const user: User | null = await userRepo.getFromMail(email.sender);
    if (user) {
        if (user.emailsSent < 1000) {
            await transporter.sendMail(mailOptions);
            await userRepo.incrementEmailCount(email.sender);
        }
        else {
            throw new HandledError("You have reached your daily limit of emails");
        }
    }
    else {
        throw new HandledError("User is not allowed to be in this platform");
    }
}