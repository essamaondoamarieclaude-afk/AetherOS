import { Router } from 'express';
import {
  getTopology,
  getEntityDetails,
  getHealthReport,
} from '../controllers/infrastructureController.js';

const router = Router();

router.get('/topology', getTopology);
router.get('/entities/:entityId', getEntityDetails);
router.get('/health', getHealthReport);

export default router;
