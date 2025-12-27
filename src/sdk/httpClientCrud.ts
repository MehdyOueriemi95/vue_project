import axios, { type AxiosResponse } from 'axios';

// En développement, utilise le proxy Vite pour contourner CORS
// En production, utilise l'URL complète de l'API
const baseURL: string | undefined = import.meta.env.DEV
  ? '/api' // Proxy Vite en développement
  : import.meta.env.VITE_API_CRUD_TEST || 'https://api-pour-apprendre.fr/api/v1';

// Log pour déboguer l'URL de base utilisée
if (import.meta.env.DEV) {
  console.log('[httpClientCrud] Mode développement - baseURL:', baseURL);
}

if (!baseURL) {
  // Format commun: le SDK reste utilisable mais loggue un warning en dev
  // Pense à définir VITE_API_CRUD_TEST dans ton fichier .env à la racine du projet.
  console.warn(
    '[SDK] VITE_API_CRUD_TEST est manquant. Les appels HTTP risquent d\'échouer.',
  );
}

// Instance Axios partagée par tout le SDK
const httpClientCrud = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur de requête pour déboguer les URLs appelées
httpClientCrud.interceptors.request.use(
  (config) => {
    const fullUrl = config.baseURL + config.url;
    console.log('=== REQUÊTE HTTP ===');
    console.log('[httpClientCrud] URL complète:', fullUrl);
    console.log('[httpClientCrud] Méthode:', config.method?.toUpperCase());
    console.log('[httpClientCrud] Headers:', JSON.stringify(config.headers, null, 2));
    console.log('[httpClientCrud] Body (objet):', config.data);
    console.log('[httpClientCrud] Body (JSON):', JSON.stringify(config.data, null, 2));
    console.log('===================');
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface NormalizedError {
  ok: false;
  status: number | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  message: string;
}

export interface NormalizedSuccess<T = unknown> {
  ok: true;
  status: number;
  data: T;
}

export type NormalizedResult<T = unknown> =
  | NormalizedSuccess<T>
  | NormalizedError;

// Interceptor de réponse: on normalise les erreurs dans error.normalized
httpClientCrud.interceptors.response.use(
  (response) => {
    console.log('=== RÉPONSE SUCCÈS ===');
    console.log('[httpClientCrud] Status:', response.status);
    console.log('[httpClientCrud] Headers:', JSON.stringify(response.headers, null, 2));
    console.log('[httpClientCrud] Data:', JSON.stringify(response.data, null, 2));
    console.log('=====================');
    return response;
  },
  (error: any) => {
    console.log('=== RÉPONSE ERREUR ===');
    console.log('[httpClientCrud] Type d\'erreur:', error.name);
    console.log('[httpClientCrud] Message:', error.message);
    console.log('[httpClientCrud] Code:', error.code);
    console.log('[httpClientCrud] Status:', error.response?.status);
    console.log('[httpClientCrud] Status Text:', error.response?.statusText);
    console.log('[httpClientCrud] Request URL:', error.config?.url);
    console.log('[httpClientCrud] Request Method:', error.config?.method);
    console.log('[httpClientCrud] Headers:', JSON.stringify(error.response?.headers, null, 2));
    console.log('[httpClientCrud] Data:', JSON.stringify(error.response?.data, null, 2));
    console.log('[httpClientCrud] Erreur complète:', error);
    console.log('=====================');

    const status: number | null = error.response?.status ?? null;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data = error.response?.data ?? null;

    const normalizedError: NormalizedError = {
      ok: false,
      status,
      data,
      message:
        (data && (data as any).message) ??
        error.message ??
        'Erreur inattendue lors de l\'appel HTTP.',
    };

    // On attache la version normalisée à l'erreur pour les appels qui veulent inspecter finement
    // (le SDK de plus haut niveau utilisera plutôt wrapRequest ci-dessous).
    // eslint-disable-next-line no-param-reassign
    (error as any).normalized = normalizedError;

    return Promise.reject(error);
  },
);

// Petit helper pour que les fonctions du SDK retournent toutes le même format:
//   - succès: { ok: true, status, data }
//   - erreur: { ok: false, status, message, data }
export function wrapRequest<T = unknown>(
  promise: Promise<AxiosResponse<T>>,
): Promise<NormalizedResult<T>> {
  return promise
    .then((response): NormalizedSuccess<T> => ({
      ok: true,
      status: response.status,
      data: response.data,
    }))
    // .then((result) => {
    //   if (!result?.data?.totalCount) {
    //     result.data.totalCount = result.data.length;
    //   }
    //   return result;
    // })
    .catch((error: any) => {
      if (error.normalized) {
        return error.normalized as NormalizedError;
      }

      return {
        ok: false,
        status: null,
        data: null,
        message: error.message ?? 'Erreur HTTP inconnue.',
      } satisfies NormalizedError;
    });
}

export default httpClientCrud;


