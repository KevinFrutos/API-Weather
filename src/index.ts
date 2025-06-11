import mongoose from 'mongoose';
import app from "./app";
import Sentry from "./infrastructure/logging/sentry";


const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });
    } catch (error) {
        Sentry.captureException(error);
        console.error('Connection error:', error);
    }
};

startServer();
