import mongoose from 'mongoose';

const telemetrySnapshotSchema = new mongoose.Schema({
  snapshotId: { type: String, required: true, unique: true },
  entityId: { type: String, index: true },
  entityName: String,
  entityType: String,
  metrics: [{
    metricId: String,
    displayName: String,
    unit: String,
    value: Number,
    dimensions: mongoose.Schema.Types.Mixed,
    timestamp: Date,
  }],
  problems: [{
    problemId: String,
    title: String,
    severity: String,
    status: String,
    impactedEntities: [String],
  }],
  topology: {
    dependencies: [String],
    health: String,
  },
}, {
  timestamps: true,
});

telemetrySnapshotSchema.index({ entityId: 1, createdAt: -1 });
telemetrySnapshotSchema.index({ 'metrics.metricId': 1 });

export const Telemetry = mongoose.model('Telemetry', telemetrySnapshotSchema);
