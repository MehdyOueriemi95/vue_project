import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@sdk': fileURLToPath(new URL('./src/sdk', import.meta.url))
    },
  },
  server: {
    proxy: {
      // Proxy pour contourner CORS en développement
      '/api': {
        target: 'https://api-pour-apprendre.fr',
        changeOrigin: true,
        secure: true,
        followRedirects: true,
        rewrite: (path) => {
          const newPath = path.replace(/^\/api/, '/api/v1');
          console.log(`[Proxy] ${path} -> ${newPath}`);
          return newPath;
        },
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.log('[Proxy Error]', err);
          });
          proxy.on('proxyReq', (proxyReq, req) => {
            console.log('[Proxy Request]', req.method, req.url);
            // Supprimer les headers qui pourraient causer des problèmes
            proxyReq.removeHeader('origin');
            proxyReq.removeHeader('referer');
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('[Proxy Response]', req.method, req.url, proxyRes.statusCode);
            // Forcer l'ajout des headers CORS pour toutes les réponses
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Dg-Info, X-Requested-With');
            res.setHeader('Access-Control-Allow-Credentials', 'true');
          });
        },
        // Gérer les requêtes OPTIONS (preflight) localement
        bypass(req, res) {
          if (req.method === 'OPTIONS') {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Dg-Info, X-Requested-With');
            res.setHeader('Access-Control-Max-Age', '86400');
            res.statusCode = 204;
            res.end();
            return false; // Ne pas proxy cette requête
          }
        }
      }
    }
  }
})
