import mongoose from 'mongoose';

const playbookStepSchema = new mongoose.Schema({
  order: Number,
  description: String,
  command: String,
  expectedOutcome: String,
  validationQuery: String,
  timeout: Number,
  automated: { type: Boolean, default: false },
});

const playbookSchema = new mongoose.Schema({
  playbookId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: String,
  triggerConditions: [{
    metric: String,
    operator: { type: String, enum: ['gt', 'lt', 'eq', 'gte', 'lte'] },
    threshold: Number,
    severity: String,
  }],
  affectedEntityTypes: [String],
  steps: [playbookStepSchema],
  successCriteria: String,
  rollbackPlaybookId: String,
  version: { type: Number, default: 1 },
  createdBy: String,
  lastTested: Date,
  successRate: { type: Number, default: 0 },
}, {
  timestamps: true,
});

export const Playbook = mongoose.model('Playbook', playbookSchema);
