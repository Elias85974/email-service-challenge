import { createUser } from "../repository/Users";

export async function register(registerData: { email: string; userName: string; password: string; }): Promise<void> {
    await createUser(registerData);
}