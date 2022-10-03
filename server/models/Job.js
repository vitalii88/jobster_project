import mongoose from 'mongoose';

const JobShcema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Please, enter company name'],
      maxlength: 50,
    },
    position: {
      type: String,
      required: [true, 'Please, enter position'],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ['interview', 'declined', 'pending'],
      default: 'pending',
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please, provide User'],
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Job', JobShcema);
