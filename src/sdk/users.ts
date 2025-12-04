import httpClient, {
  type NormalizedResult,
  wrapRequest,
} from './httpClient';

export type UsersResult = NormalizedResult<unknown>;

// Appelle GET /ping sur le backend et retourne un objet normalisé:
//  - succès: { ok: true, status, data }
//  - erreur: { ok: false, status, message, data }
export async function getUsers(loadOptions: any): Promise<UsersResult> {
  return wrapRequest(httpClient.get('/users', { headers: {
    'X-Dg-Info': JSON.stringify(loadOptions)
   } }));
}

export async function getUserById(id: string): Promise<UsersResult> {
  return wrapRequest(httpClient.get(`/users/${id}`));
}

export async function updateUser(id: string | number, data: any): Promise<UsersResult> {
  return wrapRequest(httpClient.put(`/users/${id}`, data));
}

export async function insertUser(data: any): Promise<UsersResult> {
  return wrapRequest(httpClient.post('/users', data));
}

export async function deleteUser(id: string | number): Promise<UsersResult> {
  return wrapRequest(httpClient.delete(`/users/${id}`));
}
