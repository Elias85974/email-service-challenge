import app from "../index";
import request from "supertest";
import {registrationUser} from "../constants";

const adminUser: registrationUser = {
    email: "admin.user@gmail.com",
    userName: "admin",
    password: "asdasd"
}
// The user that holds 1000 emails sent that day (thanks to initialConditions method)
const randomUser: registrationUser = {
    email: "random.user@gmail.com",
    userName: "randomUser",
    password: "123123"
}
const regularUser: registrationUser = {
    email: "regular.user@gmail.com",
    userName: 'regular8597',
    password: "asdasd"
};
// Using the same token for every action performed for ease
let token: string;
const testingKey: string = process.env.TESTING_KEY as string;

// Functions to set or reset the conditions needed for the test
// Comment them as necessary
function setInitialConditions(): void {
    it("A test made to initialize the conditions needed to work", async (): Promise<void> => {
        const res = await request(app)
            .put("/test/setTesting")
            .set('Authorization', "Bearer " + testingKey)
            .send({
                adminUser: adminUser,
                randomUser: randomUser
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual("All things working correctly");
    }, 30000);
}

function resetConditions(): void {
    it("A test made for resetting the conditions", async (): Promise<void> => {
        const res = await request(app)
            .put("/test/resetTesting")
            .set('Authorization', "Bearer " + (process.env.TESTING_KEY as string))
            .send({
                randomEmail: randomUser.email,
                regularEmail: regularUser.email
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual("All things working correctly");
    })
}

// group test using describe
describe("Email Service Challenge Testing", () => {

    setInitialConditions();

    it("Should successfully register a user", async (): Promise<void> => {
        const res = await request(app)
            .post('/user/register')
            .send(regularUser)

        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('All things working correctly');
    });

    it('Should login a user and return the token', async (): Promise<void> => {
        const res = await request(app)
            .post('/user/login')
            .send({ email: adminUser.email, password: adminUser.password });

        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('All things working correctly');
        expect(res.body.token).not.toBeNull();

        // Here we save the token needed for the test
        token = res.body.token;
    });

    it('Should not be able to send an email if not authenticated yet', async (): Promise<void> => {
        const res = await request(app)
            .post('/email/sendEmail')
            .send({
                email: adminUser.email,
                recipient: 'prov.chall@gmail.com',
                subject: 'Testing',
                message: 'Hello there'
            });

        expect(res.statusCode).toEqual(401);
        expect(res.body.message).toEqual('Unauthorized');
    });

    it('Should send an email correctly', async (): Promise<void> => {
        // Change the recipient to any gmail needed
        const recipient: string = 'prov.chall@gmail.com';
        const res = await request(app)
            .post('/email/sendEmail')
            .set('Authorization', 'Bearer ' + token)
            .send({
                sender: adminUser.email,
                recipient: recipient,
                subject: 'Testing',
                message: 'Hello there'
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('All things working correctly');
    });

    // It can be checked with the stats test that the randomUser had 1000 emails
    it("Should not be able to send an email after sending 1000 already", async () => {
        const res = await request(app)
            .post("/email/sendEmail")
            .set("Authorization", "Bearer " + token)
            .send({
                sender: randomUser.email,
                recipient: "prov.chall@gmail.com",
                subject: 'Testing',
                message: 'Hello there'
            })

        expect(res.statusCode).toEqual(500);
        expect(res.body.message).toEqual("You have reached your daily limit of emails");
    })

    it('Should block the user that is not admin to see the stats', async (): Promise<void> => {
        const res = await request(app)
            .get("/admin/stats")
            .send({
                email: randomUser.email
            })

        expect(res.statusCode).toEqual(401);
        expect(res.body.message).toEqual("Unauthorized");
    });

    it('Get the stats, the admin should have the email just sent and the just registered user should not appear',
        async (): Promise<void> => {
            const res = await request(app)
                .get('/admin/stats')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    email: adminUser.email
                });

            expect(res.statusCode).toEqual(200);
            const stats = res.body.statistics;
            const adminStats = stats.find((stat: {email: string, emailsSent: number }) => stat.email === adminUser.email);

            // Check that the admin user's stats are present and correct
            expect(adminStats).toBeDefined();
            expect(adminStats.emailsSent).toBeGreaterThanOrEqual(1); // Adjust this as necessary

            const randomUserStats = stats.find((stat: {email: string, emailsSent: number }) => stat.email === randomUser.email);
            expect(randomUserStats).toBeDefined();
            expect(randomUserStats.emailsSent).toEqual(1000); // Showing that the random user had 1000 emails

            // Check that the just registered user does not appear in the stats because no email were sent
            const regularUserStats = stats.find((stat: {email: string, emailsSent: number }) => stat.email === regularUser.email);
            expect(regularUserStats).toBeUndefined();
        });

    it('Complete test that shows the increment of the emails sent', async (): Promise<void> => {
        // Get the initial stats, the admin already sent one email
        let res = await request(app)
            .get('/admin/stats')
            .set('Authorization', 'Bearer ' + token)
            .send({
                email: adminUser.email
            });

        expect(res.statusCode).toEqual(200);
        const initialStats: {email: string, emailsSent: number}[] = res.body.statistics;
        const initialAdminStats: {email: string, emailsSent: number} | undefined = initialStats.find(
            stat => stat.email === adminUser.email);

        if (!initialAdminStats) {
            // Break the test
            expect(1).toEqual(2);
            return;
        }

        // Send an email
        res = await request(app)
            .post('/email/sendEmail')
            .set('Authorization', 'Bearer ' + token)
            .send({
                sender: adminUser.email,
                recipient: 'prov.chall@gmail.com',
                subject: 'Testing',
                message: 'Hello there'
            });

        expect(res.statusCode).toEqual(200);

        // Get the stats again
        res = await request(app)
            .get('/admin/stats')
            .set('Authorization', 'Bearer ' + token)
            .send({
                email: adminUser.email
            });

        expect(res.statusCode).toEqual(200);
        const finalStats = res.body.statistics;
        const finalAdminStats = finalStats.find(
            (stat: {email: string, emailsSent: number }) => stat.email === adminUser.email);

        // Check that the stats have been incremented by 1
        expect(finalAdminStats.emailsSent).toEqual(initialAdminStats.emailsSent + 1);
    });

    resetConditions();
});