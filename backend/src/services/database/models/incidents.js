import mongoose from 'mongoose';

const incidentSchema = new mongoose.Schema({
  incidentId: { type: String, required: true, unique: true, index: true },
  dynatraceProblemId: { type: String, index: true },
  title: { type: String, required: true },
  severity: {
    type: String,
    enum: ['info', 'low', 'medium', 'high', 'critical'],
    required: true,
  },
  status: {
    type: String,
    enum: ['open', 'analyzing', 'remediating', 'resolved', 'closed'],
    default: 'open',
  },
  affectedEntities: [{
    entityId: String,
    displayName: String,
    type: String,
  }],
  rootCause: {
    summary: String,
    failingEntity: String,
    confidenceScore: Number,
    causalChain: [String],
    analyzedBy: String,
    analyzedAt: Date,
  },
  remediation: {
    plan: String,
    steps: [String],
    owner: String,
    rollbackProcedure: String,
    estimatedResolutionMinutes: Number,
    approved: { type: Boolean, default: false },
    approvedBy: String,
    approvedAt: Date,
    resolvedAt: Date,
  },
  timeline: [{
    timestamp: { type: Date, default: Date.now },
    event: String,
    actor: String,
    details: String,
  }],
  tags: [String],
}, {
  timestamps: true,
});

incidentSchema.index({ status: 1, severity: -1 });
incidentSchema.index({ createdAt: -1 });

export const Incident = mongoose.model('Incident', incidentSchema);
