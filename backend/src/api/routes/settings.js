import { Router } from 'express';
import {
  getSettings,
  updateSettings,
  testIntegration,
} from '../controllers/settingsController.js';

const router = Router();

router.get('/', getSettings);
router.put('/', updateSettings);
router.post('/test/:integration', testIntegration);

export default router;
