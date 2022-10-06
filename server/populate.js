import * as dotenv from 'dotenv';
import dbConnector from './db/dbConnector.js';
import myJson from './mocks/mock-jobs-data.json' assert {type: 'json'};
import JodSchema from './models/Job.js';


dotenv.config();
const start = async () => {
  try {
    await dbConnector(process.env.MONGO_DB_URL);
    await JodSchema.create(myJson);
    console.log('Success!');
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
