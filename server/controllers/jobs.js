import Job from '../models/Job.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError } from '../errors/index.js';
import JobShcema from '../models/Job.js';

const getSortType = (value) => {
  switch (value) {
    case 'latest': {
      return '-createdAt';
    }
    case 'oldest': {
      return 'createdAt';
    }
    case 'a-z': {
      return 'position';
    }
    case 'z-a': {
      return '-position';
    }
    default: {
      throw new NotFoundError('not found this sort params');
    }
  }
}

export const getAllJobs = async (req, resp) => {
  const { status, jobType, sort, search } = req.query;

  const queryObject = {
    createdBy: req.user.userId,
  };

  if (search) {
    queryObject.position = {
      $regex: search,
      $options: 'i',
    };
  }
  if (status && status !== 'all') {
    queryObject.status = status;
  }
  if (jobType && jobType !== 'all') {
    queryObject.jobType = jobType;
  }

  let result = Job.find(queryObject);

  const sortType = getSortType(sort);
  result.sort(sortType);

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const totalJobs = await JobShcema.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalJobs / limit);

  const jobs = await result;
  resp.status(StatusCodes.OK).json({ jobs, totalJobs, numOfPages });
};

export const getJod = async (req, resp) => {
  const {
    user: { userId },
    params: { id: jobId}
  } = req;
  const job = await Job.findOne({
    _id: jobId,
    createdBy: userId,
  });
  if (!job) {
    throw new NotFoundError(`Not foun job from id:  ${jobId}`);
  }
  resp.status(StatusCodes.OK).json({ job });

};
export const createJob = async (req, resp) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  resp.status(StatusCodes.CREATED).json({ job });
};
export const updateJob = async (req, resp) => {
  const {
    body: { company, position },
    user: { userId },
    params: { id: jobId}
  } = req;

  if (company === '' || position === '') {
    throw new BadRequestError('Company or position fields cannot be empty');
  }

  const job = await Job.findByIdAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true, runValidators: true },
  );

  if (!job) {
    throw new NotFoundError(`Not foun job from id:  ${jobId}`);
  }

  resp.status(StatusCodes.OK).json({ job });
};

export const deleteJod = async (req, resp) => {
  const {
    user: { userId },
    params: { id: jobId}
  } = req;

  const job = await Job.findOneAndRemove({
    _id: jobId,
    createdBy: userId,
  });

  if (!job) {
    throw new NotFoundError(`Not found job from id: ${jobId}`);
  }

  resp.status(StatusCodes.OK).send();
};

