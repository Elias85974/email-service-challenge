import { UserRepository } from "../repository/Users";
import {EmailsRepository} from "../repository/Emails";
import {registrationUser} from "../constants";

const userRepo: UserRepository = new UserRepository();
const emailSRepo: EmailsRepository = new EmailsRepository();

export async function setInitialConditions(adminUser: registrationUser, randomUser: registrationUser) {
    // Check if admin user exists
    let admin = await userRepo.getFromMail(adminUser?.email);
    if (!admin) {
        // Create admin user
        await userRepo.createUser(adminUser);
    }

    // Create a random user
    try {
        const user = await userRepo.createUser(randomUser);

        // Store 1000 emails for the random user
        for (let i = 0; i < 1000; i++) {
            await emailSRepo.createEmail(user.id, {
                subject: `Email ${i}`,
                message: `This is email number ${i}`,
                recipient: "recipient@example.com",
            });
        }
        console.log("1000 emails just created");
    }
    catch (e) {
        console.error(e);
    }
}

export async function resetConditions(randomEmail: string, regularEmail: string) {
    // Get the random user
    const randomUser = await userRepo.getFromMail(randomEmail);
    const regularUser = await userRepo.getFromMail(regularEmail);

    if (randomUser) {
        // Delete the random user's emails
        await emailSRepo.deleteEmails(randomUser.id);

        // Delete the random user
        await userRepo.deleteUser(randomUser.id);
    }

    if (regularUser) {
        await userRepo.deleteUser(regularUser.id);
    }
}