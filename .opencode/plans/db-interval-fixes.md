# Fix 1: MongoDB Graceful Fallback

## incidentsController.js
**File**: `backend/src/api/controllers/incidentsController.js`

### 1a. Add import (line 4)
```js
import { getMongoStatus } from '../../services/database/mongoClient.js';
```

### 1b. Guard `getIncidents` — return empty array when Mongo not connected
```js
export const getIncidents = async (req, res, next) => {
  try {
    if (!getMongoStatus().isConnected) {
      return res.json({ incidents: [], total: 0, offset: 0, limit: 50 });
    }
    const { status, severity, limit = 50, offset = 0 } = req.query;
    // ... rest unchanged
```

### 1c. Guard `getIncidentById` — return 503 when Mongo not connected
```js
export const getIncidentById = async (req, res, next) => {
  try {
    if (!getMongoStatus().isConnected) {
      return res.status(503).json({ error: 'Database unavailable' });
    }
    const incident = await Incident.findOne({ incidentId: req.params.id });
    // ... rest unchanged
```

### 1d. Guard `approveRemediation` — return 503 when Mongo not connected
```js
export const approveRemediation = async (req, res, next) => {
  try {
    if (!getMongoStatus().isConnected) {
      return res.status(503).json({ error: 'Database unavailable' });
    }
    const incident = await Incident.findOne({ incidentId: req.params.id });
    // ... rest unchanged
```

### 1e. Guard `closeIncident` — return 503 when Mongo not connected
```js
export const closeIncident = async (req, res, next) => {
  try {
    if (!getMongoStatus().isConnected) {
      return res.status(503).json({ error: 'Database unavailable' });
    }
    const incident = await Incident.findOne({ incidentId: req.params.id });
    // ... rest unchanged
```

## agentsController.js
**File**: `backend/src/api/controllers/agentsController.js`

### 2a. Add import (line 3)
```js
import { getMongoStatus } from '../../services/database/mongoClient.js';
```

### 2b. Guard `getAgentHistory` — return empty when Mongo not connected
```js
export const getAgentHistory = async (req, res, next) => {
  try {
    if (!getMongoStatus().isConnected) {
      return res.json({ entries: [], total: 0, offset: 0, limit: 50 });
    }
    const { agentName } = req.params;
    // ... rest unchanged
```

## predictionsController.js
**File**: `backend/src/api/controllers/predictionsController.js`

### 3a. Add import (line 3)
```js
import { getMongoStatus } from '../../services/database/mongoClient.js';
```

### 3b. Guard `getPredictions` — return empty when Mongo not connected
```js
export const getPredictions = async (req, res, next) => {
  try {
    if (!getMongoStatus().isConnected) {
      return res.json({ predictions: [], total: 0, offset: 0, limit: 20 });
    }
    const { limit = 20, offset = 0 } = req.query;
    // ... rest unchanged
```

### 3c. Guard `getPredictionById` — return 503 when Mongo not connected
```js
export const getPredictionById = async (req, res, next) => {
  try {
    if (!getMongoStatus().isConnected) {
      return res.status(503).json({ error: 'Database unavailable' });
    }
    const prediction = await AgentMemory.findOne({
      agentId: 'predictive-agent',
      sessionId: req.params.id,
    });
    // ... rest unchanged
```

---

# Fix 2: Reduce Agent Scan Frequency

## constants.js
**File**: `backend/src/utils/constants.js`

Change the intervals at lines 57-61:
```js
export const ANALYSIS_INTERVALS = {
  PREDICTIVE: 30 * 60 * 1000,     // 5 min -> 30 min
  INFRASTRUCTURE: 15 * 60 * 1000, // 1 min -> 15 min
  SECURITY: 15 * 60 * 1000,       // 2 min -> 15 min
};
```
