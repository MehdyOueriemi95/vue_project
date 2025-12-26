import httpClientCrud, {
  type NormalizedResult,
  wrapRequest,
} from './httpClientCrud';

export type PostsResult = NormalizedResult<unknown>;

// Appelle GET /ping sur le backend et retourne un objet normalisé:
//  - succès: { ok: true, status, data }
//  - erreur: { ok: false, status, message, data }
export async function getPosts(loadOptions: any): Promise<PostsResult> {
  // Ajouter un slash final pour éviter les redirections du serveur
  return wrapRequest(httpClientCrud.get('/posts/', { headers: {
    'X-Dg-Info': JSON.stringify(loadOptions)
   } }));
}

export async function getUserById(id: string): Promise<PostsResult> {
  return wrapRequest(httpClientCrud.get(`/users/${id}`));
}
