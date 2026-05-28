import { Router } from 'express';
import {
  getIncidents,
  getIncidentById,
  analyzeIncident,
  approveRemediation,
  closeIncident,
} from '../controllers/incidentsController.js';

const router = Router();

router.get('/', getIncidents);
router.get('/:id', getIncidentById);
router.post('/:id/analyze', analyzeIncident);
router.post('/:id/approve', approveRemediation);
router.post('/:id/close', closeIncident);

export default router;
