import Redis from 'ioredis';
import { ICacheService } from "../../domain/ports/CacheService";
import dotenv from 'dotenv';

dotenv.config();

export const oneHourTTL = 3600;
export const authTokenPrefix = 'auth-token';

export class RedisCacheService implements ICacheService {
    private client: Redis;

    constructor() {
        this.client = new Redis({
            host: process.env.REDIS_HOST || '127.0.0.1',
            port: parseInt(process.env.REDIS_PORT || '6379'),
            password: process.env.REDIS_PASSWORD
        });

        this.client.on('error', (err) => {
            console.error('[Redis error]', err);
        });
    }

    async set(key: string, value: string, ttl: number = oneHourTTL): Promise<void> {
        await this.client.set(key, value, 'EX', ttl);
    }

    async get(key: string): Promise<string | null> {
        return this.client.get(key);
    }

    async delete(key: string): Promise<void> {
        await this.client.del(key);
    }
}
