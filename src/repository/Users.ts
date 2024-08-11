import { prismaClient } from "../constants";

export async function createUser(registerData: {email: string, userName: string, password: string}): Promise<void> {
     await prismaClient.user.create({
        data:  registerData
     })
}

export async function getFromMail(email: string): Promise<{id: number, email: string, userName: string, password: string} | null>{
    return prismaClient.user.findFirst({
        where: {
            email: email
        }
    })
}

export const allUsers = async() => { await prismaClient.user.findMany() };