import request from 'supertest';
import app from '../src/app';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

jest.mock('../src/infrastructure/cache/RedisCacheService', () => {
    return {
        RedisCacheService: jest.fn().mockImplementation(() => ({
            set: jest.fn(),
            get: jest.fn().mockResolvedValue(null),
            delete: jest.fn()
        }))
    };
});

jest.mock('../src/infrastructure/logging/sentry', () => {
    return {
        __esModule: true,
        default: {
            init: jest.fn(),
            captureException: jest.fn(),
            captureMessage: jest.fn(),
            setUser: jest.fn(),
            Handlers: {
                requestHandler: jest.fn(() => (req: any, res: any, next: any) => next()),
                tracingHandler: jest.fn(() => (req: any, res: any, next: any) => next()),
                errorHandler: jest.fn(() => (err: any, req: any, res: any, next: any) => next(err)),
            },
            setupExpressErrorHandler: jest.fn(),
            setupExpressErrorErrorHandler: jest.fn(),
        },
    };
});


beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
});

describe('Auth Routes', () => {
    it('should register a new user', async () => {
        const res = await request(app).post('/api/v1/auth/register').send({
            email: 'test@example.com',
            password: 'password123',
        });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('token');
    });

    it('should log in the user', async () => {
        await request(app).post('/api/v1/auth/register').send({
            email: 'login@example.com',
            password: 'mypassword',
        });

        const res = await request(app).post('/api/v1/auth/login').send({
            email: 'login@example.com',
            password: 'mypassword',
        });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
    });
});
