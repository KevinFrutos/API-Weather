import express from 'express';
import Sentry from "./infrastructure/logging/sentry";
import dotenv from 'dotenv';
import authRoutes from './infrastructure/routes/authRoutes';

dotenv.config();

const app = express();

Sentry.setupExpressErrorHandler(app);

app.use(express.json());
app.use('/api/v1/auth', authRoutes);

export default app;
