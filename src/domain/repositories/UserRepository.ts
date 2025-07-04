import { IUser } from '../models/User';

export interface IUserRepository {
    findByEmail(email: string): Promise<IUser | null>;
    create(user: Partial<IUser>): Promise<Partial<IUser>>;
}
