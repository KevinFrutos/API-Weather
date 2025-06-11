import { Router } from 'express';
import { register, login } from '../controllers/authenticate/AuthController';

const router = Router();

router.post('/register', register);
router.post('/login', login);

export default router;
