import { router } from "../constants";
import { register } from "../service/RegisterService";
import { login } from "../service/LoginService"
import { HandledError } from "../HandledError";

router.post("/register", async (req, res) => {
    try {
        const registerData = req.body;
        if (!registerData.email || !registerData.userName || !registerData.password) {
            res.status(400).send("Send me all the fields");
        }
        await register(registerData);
        res.status(200).send({message: "All things working correctly"});
    }
    catch (e: any) {
        if (e instanceof HandledError) {
            res.status(500).send(e.message);
        }
        res.status(500).send("Something went wrong while creating the user");
    }
})

router.post("/login", async (req, res) => {
    try {
        const token = await login(req.body);
        res.header("token", token);
        res.status(200).send({message: "All things working correctly"});
    }
    catch (e: any) {
        if (e instanceof HandledError) {
            res.status( 500).send({message: e.message});
        }
        res.status(500).send({message: "Something went wrong while logging the user"});
    }
})

export default router;