import type {ServerType} from '../../utils/serverTypes';
import type {RemoteModelInfo} from '../../utils/types';
import {normalizeUrl} from '../http';

const DETECT_TIMEOUT_MS = 5000;

/**
 * Detect server type from response headers and model metadata.
 * Checks (cheapest first):
 * 1. Server header === 'llama.cpp'
 * 2. Any model owned_by === 'organization_owner' → LM Studio
 * 3. GET / body === 'Ollama is running' → Ollama
 * 4. Model ids with :web / :think / :shell suffixes → Kaggle Bridge
 * 5. GET /health or /v1/backend-info looks like Kaggle Bridge
 * 6. Unknown → undefined
 */
export async function detectServerType(
  serverUrl: string,
  models: RemoteModelInfo[],
  headers: Record<string, string>,
): Promise<ServerType | undefined> {
  const serverHeader = headers.server || headers.Server || '';
  if (serverHeader === 'llama.cpp') {
    return 'llama.cpp';
  }

  if (models.some(m => m.owned_by === 'organization_owner')) {
    return 'LM Studio';
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), DETECT_TIMEOUT_MS);
    try {
      const response = await fetch(normalizeUrl(serverUrl), {
        method: 'GET',
        signal: controller.signal,
      });
      const body = await response.text();
      if (body.trim() === 'Ollama is running') {
        return 'Ollama';
      }
    } finally {
      clearTimeout(timeout);
    }
  } catch {
    // not Ollama
  }

  if (
    models.some(
      m =>
        typeof m.id === 'string' &&
        (/:(web|shell|think|nothink|low|medium|high)(?:$|:)/.test(m.id) ||
          m.id.includes(':shell') ||
          m.id.includes(':web')),
    )
  ) {
    return 'Kaggle Bridge';
  }

  if (await probeKaggleBridge(serverUrl)) {
    return 'Kaggle Bridge';
  }

  return undefined;
}

async function probeKaggleBridge(serverUrl: string): Promise<boolean> {
  const base = normalizeUrl(serverUrl).replace(/\/$/, '');
  const paths = ['/health', '/v1/backend-info', '/v1/controls'];

  for (const path of paths) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), DETECT_TIMEOUT_MS);
      try {
        const response = await fetch(`${base}${path}`, {
          method: 'GET',
          signal: controller.signal,
        });
        if (response.status === 401 || response.status === 403) {
          return true;
        }
        if (!response.ok) {
          continue;
        }
        const text = (await response.text()).toLowerCase();
        if (
          text.includes('kaggle') ||
          text.includes('bridge') ||
          path !== '/health'
        ) {
          return true;
        }
      } finally {
        clearTimeout(timeout);
      }
    } catch {
      // next path
    }
  }
  return false;
}
