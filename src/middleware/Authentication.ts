import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

const secretKey: string = process.env.JWT_SECRET as string;

export const auth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        let token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            throw new Error('Token not provided');
        }

        // Remove surrounding double quotes if present
        token = token.replace(/^"|"$/g, '');

        jwt.verify(token, secretKey);
        next();
    } catch (e: any) {
        res.status(401).send({ message: 'Unauthorized' });
    }
};