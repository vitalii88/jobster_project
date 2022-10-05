import UserSchema from '../models/User.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, AuthenticatedError } from '../errors/index.js'

export const register = async (req, resp) => {
  const user =  await UserSchema.create({ ...req.body });
  const token = user.createJWT();

  resp.status(StatusCodes.CREATED).json({
    user: {
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      name: user.name,
      token,
    },
  });
};

export const login = async (req, resp) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Please provide email or password');
  }
  const user = await UserSchema.findOne({ email });

  if (!user) {
    throw new AuthenticatedError('Invalid credentials');
  }

  const isCorrectPassword = await user.comparePassword(password);

  const token = user.createJWT();
  resp.status(StatusCodes.OK).json({
    user: {
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      name: user.name,
      token,
    },
  });
};

export const updateUser = async (req, resp) => {
  const { name, email, lastName, location } = req.body;
  const userId = req.user.userId;

  if (!name || !email || !lastName || !location) {
    throw new BadRequestError('Please provide all values');
  }
  const user = await UserSchema.findOne({ _id: userId });
  user.name = name;
  user.email = email;
  user.lastName = lastName;
  user.location = location;

  await user.save();

  const token = user.createJWT();

  resp.status(StatusCodes.OK).json({
    user: {
      name: user.name,
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      token,
    },
  });

}

