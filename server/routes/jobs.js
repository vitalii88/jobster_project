import { Router } from 'express';
import * as jodsController from '../controllers/jobs.js';
const router = Router();

router.route('/')
  .post(jodsController.createJob)
  .get(jodsController.getAllJobs);

router.route('/:id')
  .get(jodsController.getJod)
  .delete(jodsController.deleteJod)
  .patch(jodsController.updateJob);

export default router;
