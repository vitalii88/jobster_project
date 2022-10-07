import { Router } from 'express';
import * as jodsController from '../controllers/jobs.js';
import demoUser from '../middleware/demoUser.js';

const router = Router();

router.route('/')
  .post(demoUser, jodsController.createJob)
  .get(jodsController.getAllJobs);

router.route('/:id')
  .get(jodsController.getJod)
  .delete(demoUser, jodsController.deleteJod)
  .patch(demoUser, jodsController.updateJob);

export default router;
