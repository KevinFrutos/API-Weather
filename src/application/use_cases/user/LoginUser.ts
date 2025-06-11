import { IUserRepository } from '../../../domain/repositories/UserRepository';
import { generateToken } from '../../../infrastructure/http/utils/jwt';
import { ICacheService } from "../../../domain/ports/CacheService";
import { authTokenPrefix, oneHourTTL } from "../../../infrastructure/cache/RedisCacheService";

export class LoginUser {
    constructor(
        private userRepository: IUserRepository,
        private cacheService: ICacheService
    ) {}

    async execute(email: string, password: string) {
        const user = await this.userRepository.findByEmail(email);
        if (!user || !(await user.comparePassword(password))) {
            throw new Error('Invalid credentials');
        }

        const redisKey = `${authTokenPrefix}:${user._id!}`;
        const cachedToken = await this.cacheService.get(redisKey);

        if (cachedToken) {
            return cachedToken;
        }

        const token = generateToken(user._id!);

        await this.cacheService.set(redisKey, token, oneHourTTL);

        return token;
    }
}
