import mongoose from 'mongoose';

const agentMemorySchema = new mongoose.Schema({
  agentId: { type: String, required: true, index: true },
  sessionId: { type: String, required: true },
  incidentId: { type: String, index: true },
  input: mongoose.Schema.Types.Mixed,
  output: mongoose.Schema.Types.Mixed,
  confidenceScore: Number,
  processingTimeMs: Number,
  toolsUsed: [String],
  feedback: {
    helpful: Boolean,
    rating: Number,
    correctedBy: String,
  },
  context: {
    dynatraceProblemId: String,
    relatedEntities: [String],
    metricsUsed: [String],
  },
}, {
  timestamps: true,
});

agentMemorySchema.index({ agentId: 1, createdAt: -1 });
agentMemorySchema.index({ incidentId: 1, agentId: 1 });

export const AgentMemory = mongoose.model('AgentMemory', agentMemorySchema);
