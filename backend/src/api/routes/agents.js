import { Router } from 'express';
import {
  getAgentStatuses,
  triggerAgentAnalysis,
  getAgentHistory,
} from '../controllers/agentsController.js';

const router = Router();

router.get('/status', getAgentStatuses);
router.post('/:agentName/analyze', triggerAgentAnalysis);
router.get('/:agentName/history', getAgentHistory);

export default router;
