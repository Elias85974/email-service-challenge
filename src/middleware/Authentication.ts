import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

const secretKey: string = process.env.JWT_SECRET as string;
const TOKEN_EXPIRATION_TIME: number = 3600; // 1 hour in seconds
const RENEWAL_THRESHOLD: number = 300; // 5 minutes in seconds
type decodedToken = {
    email: string,
    expiration: number
};

export async function createToken(email: string): Promise<string> {
    return jwt.sign({email: email}, secretKey, {expiresIn: TOKEN_EXPIRATION_TIME});
}

export const auth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        let token: string | undefined = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            throw new Error('Token not provided');
        }

        const decoded: decodedToken = jwt.verify(token, secretKey) as decodedToken;

        // Check if token is close to expiry and renew it
        const timeDifference: number = decoded.expiration * 1000 - Date.now();
        if (timeDifference <= RENEWAL_THRESHOLD * 1000) {
            // Token is close to expiry, generate a new one
            token = jwt.sign({ email: decoded.email }, secretKey, { expiresIn: TOKEN_EXPIRATION_TIME });
        }

        res.header("Token", token);
        next();
    } catch (e: any) {
        res.status(401).send({ message: 'Unauthorized' });
    }
};