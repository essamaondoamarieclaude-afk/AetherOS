import { Router } from 'express';
import {
  getSecurityAlerts,
  runSecurityAnalysis,
  getComplianceStatus,
} from '../controllers/securityController.js';

const router = Router();

router.get('/alerts', getSecurityAlerts);
router.post('/analyze', runSecurityAnalysis);
router.get('/compliance', getComplianceStatus);

export default router;
