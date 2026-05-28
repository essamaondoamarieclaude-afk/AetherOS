import logger from '../../utils/logger.js';
import { SOCKET_EVENTS } from '../../utils/constants.js';
import { orchestrator } from '../agents/orchestrator.js';
import { ANALYSIS_INTERVALS } from '../../utils/constants.js';

let predictiveInterval = null;
let infraInterval = null;
let securityInterval = null;

export const socketManager = (io) => {
  orchestrator.setSocketIO(io);

  io.on('connection', (socket) => {
    logger.info(`Client connected: ${socket.id}`);

    socket.emit(SOCKET_EVENTS.CONNECTION_ACK, {
      socketId: socket.id,
      timestamp: new Date().toISOString(),
      message: 'Connected to AetherOS real-time telemetry stream',
    });

    socket.on('subscribe:incident', (incidentId) => {
      socket.join(`incident:${incidentId}`);
      logger.debug(`Socket ${socket.id} subscribed to incident ${incidentId}`);
    });

    socket.on('unsubscribe:incident', (incidentId) => {
      socket.leave(`incident:${incidentId}`);
    });

    socket.on('analyst:action', (data) => {
      logger.info('Analyst action received', { socketId: socket.id, ...data });
      io.emit(SOCKET_EVENTS.ANALYST_ACTION, {
        ...data,
        sourceSocket: socket.id,
        timestamp: new Date().toISOString(),
      });
    });

    socket.on('request:analysis', async (data) => {
      logger.info(`Analysis requested by ${socket.id}`, { data });
      try {
        const result = await orchestrator.handleProblemEvent(data);
        socket.emit('analysis:result', result);
      } catch (err) {
        socket.emit('analysis:error', { error: err.message });
      }
    });

    socket.on('disconnect', (reason) => {
      logger.info(`Client disconnected: ${socket.id} (${reason})`);
    });
  });

  startScheduledAnalyses(io);
};

const startScheduledAnalyses = (io) => {
  predictiveInterval = setInterval(async () => {
    try {
      await orchestrator.runPredictiveAnalysis();
    } catch (err) {
      logger.error('Scheduled predictive analysis failed', { error: err.message });
    }
  }, ANALYSIS_INTERVALS.PREDICTIVE);

  infraInterval = setInterval(async () => {
    try {
      await orchestrator.runInfrastructureScan();
    } catch (err) {
      logger.error('Scheduled infrastructure scan failed', { error: err.message });
    }
  }, ANALYSIS_INTERVALS.INFRASTRUCTURE);

  securityInterval = setInterval(async () => {
    try {
      await orchestrator.runSecurityAnalysis();
    } catch (err) {
      logger.error('Scheduled security analysis failed', { error: err.message });
    }
  }, ANALYSIS_INTERVALS.SECURITY);

  logger.info('Scheduled agent analyses started');
};

export const stopScheduledAnalyses = () => {
  if (predictiveInterval) clearInterval(predictiveInterval);
  if (infraInterval) clearInterval(infraInterval);
  if (securityInterval) clearInterval(securityInterval);
  logger.info('Scheduled analyses stopped');
};
