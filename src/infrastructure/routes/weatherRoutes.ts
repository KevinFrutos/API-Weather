import { Router } from 'express';
import { authenticate } from "../http/middlewares/authenticate";
import { weather } from "../controllers/authenticate/WeatherController";

const router = Router();

router.post('/forecast', authenticate, weather);

export default router;
