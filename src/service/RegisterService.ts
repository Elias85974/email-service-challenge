import { UserRepository } from "../repository/Users";

const userRepo: UserRepository = new UserRepository();

export async function register(registerData: { email: string; userName: string; password: string; }): Promise<void> {
    await userRepo.createUser(registerData);
}