import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import authMiddleware from '../middleware/authentication.js';
import demoUser from '../middleware/demoUser.js';
import { register, login, updateUser } from '../controllers/auth.js'

const router = Router();

const apiLimiter = rateLimit({
  windowMs: 15*60*1000,
  max: 10,
  message: {
    msg: 'To many request from this IP, Please try again after 15 minutes',
  },
});

router.post('/register', apiLimiter, register);
router.post('/login', apiLimiter, login);
router.patch('/updateUser', authMiddleware, demoUser, updateUser);

export default router;
