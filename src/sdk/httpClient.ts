import axios, { type AxiosResponse } from 'axios';

const baseURL: string | undefined = import.meta.env.VITE_API_BASE_URL;

if (!baseURL) {
  // Format commun: le SDK reste utilisable mais loggue un warning en dev
  // Pense à définir VITE_API_BASE_URL dans ton fichier .env à la racine du projet.
  console.warn(
    '[SDK] VITE_API_BASE_URL est manquant. Les appels HTTP risquent d’échouer.',
  );
}

// Instance Axios partagée par tout le SDK
const httpClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

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
httpClient.interceptors.response.use(
  (response) => response,
  (error: any) => {
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
        'Erreur inattendue lors de l’appel HTTP.',
    };

    // On attache la version normalisée à l’erreur pour les appels qui veulent inspecter finement
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
    .then((response) => ({
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

export default httpClient;


