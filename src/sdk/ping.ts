import httpClient, {
  type NormalizedResult,
  wrapRequest,
} from './httpClient';

export type PingResult = NormalizedResult<unknown>;

// Appelle GET /ping sur le backend et retourne un objet normalisé:
//  - succès: { ok: true, status, data }
//  - erreur: { ok: false, status, message, data }
export async function ping(): Promise<PingResult> {
  return wrapRequest(httpClient.get('/ping'));
}


