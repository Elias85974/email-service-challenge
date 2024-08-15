import {NextFunction, Request, Response} from "express";
import {HandledError} from "../HandledError";
import {UserRepository} from "../repository/Users";

const userRepo: UserRepository = new UserRepository();

export const adminAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data: { email: string } = req.body;
        if (!data || !data.email) {
            throw new HandledError("Email field missing");
        }
        const isAdmin: boolean = await userRepo.isAdmin(data.email);
        if (!isAdmin) {
            throw new HandledError("Admin allowed only");
        }
        next();
    }
    catch (e: any) {
        res.status(500);
        console.error("Error ocurred in the admin route: ", e);
        if (e instanceof HandledError) {
            res.send({message: e.message});
        }
        res.send({message: "Something went wrong in the admin authentication"});
    }
}