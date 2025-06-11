import { IUserRepository } from '../../../domain/repositories/UserRepository';
import { generateToken } from '../../../infrastructure/http/utils/jwt';
import { ICacheService } from "../../../domain/ports/CacheService";
import { authTokenPrefix, oneHourTTL } from "../../../infrastructure/cache/RedisCacheService";

export class RegisterUser {
    constructor(
        private userRepository: IUserRepository,
        private cacheService: ICacheService
    ) {}

    async execute(email: string, password: string) {
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) throw new Error('Email already in use');

        const user = await this.userRepository.create({ email, password });

        const token = generateToken(user._id!);

        await this.cacheService.set(`${authTokenPrefix}:${user._id!}`, token, oneHourTTL);

        return token;
    }
}
