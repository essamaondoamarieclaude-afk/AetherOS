import { Router } from 'express';
import { handleDynatraceWebhook } from './dynatraceWebhook.js';

const router = Router();

router.post('/dynatrace', handleDynatraceWebhook);

export default router;
