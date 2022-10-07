import { BadRequestError } from '../errors/index.js'

const demoUser = (req, resp, next) => {
  if (req.user.demoUser) {
    throw new BadRequestError('Demo User. Read only');
  }
  next();
};

export default demoUser;
