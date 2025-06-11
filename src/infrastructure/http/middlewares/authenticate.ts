import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Sentry from "../../logging/sentry";

export interface AuthenticatedRequest extends Request {
    user?: any;
}

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction): void  => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'No token provided' });
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        req.user = decoded;
        next();
    } catch (error) {
        Sentry.captureException(error);
        res.status(401).json({ message: 'Invalid token' });
        return;
    }
};
