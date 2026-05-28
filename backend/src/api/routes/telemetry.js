import { Router } from 'express';
import {
  queryMetrics,
  queryLogs,
  runUsql,
  getTelemetrySnapshot,
} from '../controllers/telemetryController.js';

const router = Router();

router.get('/metrics', queryMetrics);
router.get('/logs', queryLogs);
router.post('/usql', runUsql);
router.get('/snapshot/:entityId', getTelemetrySnapshot);

export default router;
