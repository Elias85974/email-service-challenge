import { router } from "../constants";
import {HandledError} from "../HandledError";
import {getStats} from "../service/AdminService";

router.get("/stats", async (req, res) => {
    try {
        const statistics: {email: string, emailsSent: number}[] = await getStats();
        res.status(200).send(statistics);
    }
    catch (e: any) {
        console.error(e);
        res.status(500);
        if (e instanceof HandledError) {
            res.send({message: e.message});
        }
        res.send({message: "Something went wrong when getting your stats"});
    }
})

export default router;