import config from '../config/index.js';
import logger from '../utils/logger.js';

class AgentBuilderClient {
  constructor() {
    this.project = config.googleCloud.project;
    this.location = config.googleCloud.agentBuilder.location;
    this.dataStore = config.googleCloud.agentBuilder.dataStore;
    this.baseUrl = `https://discoveryengine.googleapis.com/v1alpha/projects/${this.project}/locations/${this.location}/dataStores/${this.dataStore}`;
  }

  async search(query, options = {}) {
    const { pageSize = 10, filter } = options;

    try {
      const response = await fetch(
        `${this.baseUrl}/servingConfigs/default_search:search`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${await this._getAccessToken()}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query,
            pageSize,
            filter,
            queryExpansionSpec: { condition: 'AUTO' },
            spellCorrectionSpec: { mode: 'AUTO' },
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`Agent Builder search failed: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      logger.error('Agent Builder search error', { error: err.message });
      throw err;
    }
  }

  async queryAgent(agentId, query, sessionId = null) {
    try {
      const response = await fetch(
        `${this.baseUrl}/engines/${agentId}/sessions/${sessionId || 'default'}:query`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${await this._getAccessToken()}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: { text: query } }),
        },
      );

      if (!response.ok) {
        throw new Error(`Agent Builder query failed: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      logger.error('Agent Builder query error', { error: err.message });
      throw err;
    }
  }

  async _getAccessToken() {
    try {
      const { GoogleAuth } = await import('google-auth-library');
      const auth = new GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/cloud-platform'],
      });
      const client = await auth.getClient();
      const token = await client.getAccessToken();
      return token.token;
    } catch {
      logger.warn('Google Auth unavailable, using placeholder token');
      return 'placeholder-token';
    }
  }
}

export const agentBuilder = new AgentBuilderClient();
