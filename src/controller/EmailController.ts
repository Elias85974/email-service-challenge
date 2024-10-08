import {Email, router} from "../constants";
import {sendMail} from "../service/EmailService";
import {HandledError} from "../HandledError";

router.post("/sendEmail", async (req, res) => {
    const email: Email = req.body;
    try {
        if (!email || !email.message || !email.recipient || !email.sender || !email.subject) {
            res.status(400).send({message: "Please send me the required data to send your email"});
        }
        else {
            await sendMail(email);
            res.status(200).send({ message: "All things working correctly" });
        }
    }
    catch (e) {
        console.error("Error sending the mail: ", e);
        res.status(500);
        if (e instanceof HandledError) {
            res.send({message: e.message});
        }
        else {
            res.send({message: "Something went wrong while trying to send your email"});
        }
    }
})

export default router;