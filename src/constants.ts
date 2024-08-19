import { PrismaClient } from '@prisma/client';
import { Router } from "express";

export const prismaClient: PrismaClient = new PrismaClient();
export const router: Router = Router();
export type User = {
    id: number,
    email: string,
    userName: string,
    password: string,
};
export type registrationUser = {
    email: string,
    userName: string,
    password: string
}
export type Email = {
    sender: string,
    recipient: string,
    subject: string,
    message: string
};