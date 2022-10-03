import { StatusCodes } from 'http-status-codes';
import { CustomApiError } from './index.js';

class AuthenticatedError extends CustomApiError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  };
}

export default AuthenticatedError
