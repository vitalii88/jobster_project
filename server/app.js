import * as dotenv from 'dotenv';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import xss from 'xss-clean';
import dbConnector from './db/dbConnector.js';
import notFoundMiddleware from './middleware/notFound.js';
import errorHandlerMiddleware from './middleware/errorHandler.js';
import * as routers from './routes/index.js'
import authMiddleware from './middleware/authentication.js';

dotenv.config();

const PORT = process.env.PORT || 5001;

const app = express();
app.set('trust proxy', 1)

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(xss());

//routers
app.use('/api/v1/auth', routers.authRouters);
app.use('/api/v1/jobs', authMiddleware, routers.jobsRouters);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

dbConnector(process.env.MONGO_DB_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server run on porn: ${PORT}`);
    });
  }).catch((error) => console.log(error));

