import {NextFunction, Request, Response} from "express";

export const testingAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token: string | undefined = req.header('Authorization')?.replace('Bearer ', '');

        if (!token && token !== (process.env.TESTING_KEY as string)) {
            throw new Error();
        }

        next();
    } catch (e: any) {
        res.status(401).send({ message: 'Unauthorized' });
    }
}