import {registrationUser, router} from "../constants";
import {HandledError} from "../HandledError";
import {resetConditions, setInitialConditions} from "../service/TestingService";

router.put("/setTesting", async (req, res) => {
    try {
        const data: {adminUser: registrationUser, randomUser: registrationUser} = req.body;
        await setInitialConditions(data.adminUser, data.randomUser);
        res.status(200).send({message: "All things working correctly"});
    }
    catch (e: any) {
        console.error(e);
        res.status(500);
        if (e instanceof HandledError) {
            res.send({message: e.message});
        }
        else {
            res.send({message: "Something went wrong when getting your stats"});
        }
    }
})

router.put("/resetTesting", async (req, res) => {
    try {
        const data: {randomEmail: string, regularEmail: string} = req.body;
        await resetConditions(data.randomEmail, data.regularEmail);
        res.status(200).send({message: "All things working correctly"});
    }
    catch (e: any) {
        console.error(e);
        res.status(500);
        if (e instanceof HandledError) {
            res.send({message: e.message});
        }
        else {
            res.send({message: "Something went wrong when getting your stats"});
        }
    }
})

export default router;