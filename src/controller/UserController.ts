import { router } from "../constants";
import { register } from "../service/RegisterService";
import { login } from "../service/LoginService"
import { HandledError } from "../HandledError";

type loginDataType = {
    email: string,
    password: string
}

type registerDataType = {
    email: string,
    userName: string,
    password: string
};

router.post("/register", async (req, res): Promise<void> => {
    try {
        const registerData: registerDataType = req.body;
        if (!registerData || !registerData.email || !registerData.userName || !registerData.password) {
            res.status(400).send("Send me all the fields");
        }
        else {
            await register(registerData);
            res.status(200).send({message: "All things working correctly"});
        }
    }
    catch (e: any) {
        console.error("Error registering the user: ", e);
        if (e instanceof HandledError) {
            res.status(500).send(e.message);
        }
        res.status(500).send("Something went wrong while creating the user");
    }
})

router.post("/login", async (req, res): Promise<void> => {
    try {
        const loginData: loginDataType = req.body;
        if (!loginData || !loginData.password || !loginData.email) {
            res.status(400).send({message: "Please send me the information needed correctly"})
        }
        const token: string = await login(req.body);
        res.header("Token", token);
        res.status(200).send({message: "All things working correctly"});
    }
    catch (e: any) {
        console.error("Error login the user: ", e);
        if (e instanceof HandledError) {
            res.status( 500).send({message: e.message});
        }
        res.status(500).send({message: "Something went wrong while logging the user"});
    }
})

export default router;