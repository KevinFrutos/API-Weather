import UserModel from './UserModel';
import { IUserRepository } from '../../../domain/repositories/UserRepository';
import { IUser } from '../../../domain/models/User';

export class UserRepositoryImpl implements IUserRepository {
    async findByEmail(email: string): Promise<IUser | null> {
        return UserModel.findOne({ email });
    }

    async create(user: Partial<IUser>): Promise<Partial<IUser>> {
        return UserModel.create(user);
    }
}
