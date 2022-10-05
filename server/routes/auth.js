import { Router } from 'express';
import authMiddleware from '../middleware/authentication.js';
import { register, login, updateUser } from '../controllers/auth.js'
const router = Router();

router.post('/register', register);
router.post('/login', login);
router.patch('/updateUser', authMiddleware, updateUser);

export default router;
