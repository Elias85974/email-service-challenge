import {UserRepository} from "../repository/Users";

const userRepo: UserRepository = new UserRepository();
export async function getStats(): Promise<{email: string, emailsSent: number}[]> {
    return await userRepo.getAllUsersStatistics();
}