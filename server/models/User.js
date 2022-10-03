import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please, provide name'],
    minLength: 3,
    maxLength: 30,
  },
  email: {
    type: String,
    required: [true, 'Please, provide name'],
    matches: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please, provide valide email',
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please, provide password'],
    minLength: 3,
  }
});

UserSchema.pre('save', async function(){
  const sult = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, sult);
});

UserSchema.methods.createJWT = function (){
  return jwt.sign(
    {
      userId: this._id,
      name: this.name,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    },
  );
};

UserSchema.methods.comparePassword = async function (candidatePassword){
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
}

export default mongoose.model('User', UserSchema);
