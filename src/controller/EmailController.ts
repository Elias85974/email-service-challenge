import { router } from "../constants";
import {sendEmail} from "../service/EmailService";

router.post("/sendEmail", (req, res) => {
    const data: {sender: string, recipient: string, message: string} = req.body;
    try {
        if (!data.message || !data.recipient || !data.sender) {
            res.status(400).send({message: "Please send me the required data to send your email"});
        }
        else {
            sendEmail(data.sender, data.recipient, data.message);
            res.status(200).send({message: "Everything working correctly"});
        }
    }
    catch (e) {
        res.status(500).send("Something went wrong while trying to send your email");
    }
})

export default router;