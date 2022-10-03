import jwt from 'jsonwebtoken';
import UserSchema from '../models/User.js';
import { AuthenticatedError } from '../errors/index.js'

const authMiddleware = async (req, resp, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AuthenticatedError('Authentication error');
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = UserSchema.findById(payload.id).select('-password');
    req.user = user;

    req.user = { userId: payload.userId, name: payload.name };
    next();
  } catch (error) {
    throw new AuthenticatedError('Authentication invalid');
  }
}

export default authMiddleware;
