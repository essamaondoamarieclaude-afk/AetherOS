import { Router } from 'express';
import incidentsRouter from './incidents.js';
import agentsRouter from './agents.js';
import telemetryRouter from './telemetry.js';
import predictionsRouter from './predictions.js';
import infrastructureRouter from './infrastructure.js';
import securityRouter from './security.js';
import settingsRouter from './settings.js';
import authRouter from './auth.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/incidents', incidentsRouter);
router.use('/agents', agentsRouter);
router.use('/telemetry', telemetryRouter);
router.use('/predictions', predictionsRouter);
router.use('/infrastructure', infrastructureRouter);
router.use('/security', securityRouter);
router.use('/settings', settingsRouter);

export default router;
