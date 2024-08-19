import nodemailer from 'nodemailer';
import {UserRepository} from "../repository/Users";
import {HandledError} from "../HandledError";
import {Email} from "../constants";
import {EmailsRepository} from "../repository/Emails";

const userRepo: UserRepository = new UserRepository();
const emailsRepo: EmailsRepository = new EmailsRepository();

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
    const emailsSent: number = await userRepo.getCurrentDayMailsCount(email.sender);
    if (emailsSent < 1000) {
        await transporter.sendMail(mailOptions);
        await emailsRepo.sendMail(email);
    }
    else {
        throw new HandledError("You have reached your daily limit of emails");
    }
}