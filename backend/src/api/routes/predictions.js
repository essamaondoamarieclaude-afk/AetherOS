import { Router } from 'express';
import {
  getPredictions,
  getPredictionById,
  triggerPrediction,
} from '../controllers/predictionsController.js';

const router = Router();

router.get('/', getPredictions);
router.get('/:id', getPredictionById);
router.post('/analyze', triggerPrediction);

export default router;
