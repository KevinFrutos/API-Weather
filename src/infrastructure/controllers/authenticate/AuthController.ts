import { Request, Response } from 'express';
import { UserRepositoryImpl } from '../../db/user/UserRepositoryImpl';
import { RegisterUser } from '../../../application/use_cases/user/RegisterUser';
import { LoginUser } from '../../../application/use_cases/user/LoginUser';
import { RedisCacheService } from "../../cache/RedisCacheService";
import Sentry from "../../logging/sentry";

const cacheService = new RedisCacheService();
const userRepository = new UserRepositoryImpl();

export const register = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const useCase = new RegisterUser(userRepository, cacheService);
    try {
        const token = await useCase.execute(email, password);
        res.status(201).json({ token });
    } catch (error) {
        Sentry.captureException(error);
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Unexpected error occurred' });
        }
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const useCase = new LoginUser(userRepository, cacheService);
    try {
        const token = await useCase.execute(email, password);
        res.status(200).json({ token });
    } catch (error) {
        Sentry.captureException(error);
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Unexpected error occurred' });
        }
    }
};
