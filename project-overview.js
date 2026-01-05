// Ce fichier explique les fonctionnalités principales et les objectifs du projet Vue.js contenu dans ce répertoire.

/**
 * Vue Project Overview
 * ---------------------
 * Ce projet est une application Vue.js construite avec Vite. Il est structuré pour inclure :
 * 
 * 1. **Composants Vue** :
 *    - Les composants réutilisables sont situés dans `src/components/`.
 *    - Ces composants incluent des éléments d'interface utilisateur tels que :
 *      - `app-footer.vue` : Gère le pied de page de l'application.
 *      - `header-toolbar.vue` : Barre d'outils en haut de l'application.
 *      - `side-nav-menu.vue` : Menu de navigation latéral.
 *      - `theme-switcher.vue` : Permet de changer le thème de l'application.
 *      - `user-panel.vue` : Affiche les informations de l'utilisateur connecté.
 * 
 * 2. **Vues** :
 *    - Les pages principales de l'application sont dans `src/views/`.
 *    - Chaque vue représente une page ou une fonctionnalité clé :
 *      - `home-page.vue` : Page d'accueil de l'application.
 *      - `login-form.vue` : Formulaire de connexion.
 *      - `post-page.vue` : Affiche les détails d'un post spécifique.
 *      - `users-page.vue` : Liste et gestion des utilisateurs.
 *      - `create-post-form.vue` : Permet de créer un nouveau post.
 * 
 * 3. **Services SDK** :
 *    - Les services pour les appels HTTP et la gestion des données sont dans `src/sdk/`.
 *    - Ces services incluent :
 *      - `httpClient.ts` : Gère les requêtes HTTP génériques.
 *      - `ping.ts` : Vérifie la connectivité avec le serveur.
 *      - `users.ts` : Gère les opérations liées aux utilisateurs (CRUD).
 *      - `posts.ts` : Gère les opérations liées aux posts (CRUD).
 * 
 * 4. **Thèmes** :
 *    - Les fichiers de styles et de thèmes sont dans `src/themes/`.
 *    - Contient des fichiers JSON pour les métadonnées et des fichiers CSS/SCSS générés automatiquement.
 *    - Les thèmes incluent des variantes claires et sombres pour une meilleure accessibilité.
 * 
 * 5. **Utilitaires** :
 *    - Les fonctions utilitaires sont dans `src/utils/`.
 *    - Exemple : `media-query.ts` pour gérer les requêtes média et adapter l'interface utilisateur.
 * 
 * 6. **Configuration** :
 *    - Les fichiers de configuration incluent :
 *      - `vite.config.js` : Configuration de Vite pour le développement et la production.
 *      - `tsconfig.json` : Configuration TypeScript pour le typage statique.
 *      - `eslint.config.js` : Configuration ESLint pour le linting du code.
 *      - `devextreme.json` : Configuration spécifique à DevExtreme (si utilisé).
 * 
 * 7. **Entrée principale** :
 *    - Le point d'entrée de l'application est `src/main.ts`.
 *    - Ce fichier :
 *      - Monte l'application Vue.
 *      - Configure le routeur pour la navigation entre les pages.
 *      - Applique les styles globaux.
 * 
 * 8. **Ressources publiques** :
 *    - Les fichiers statiques (images, icônes, etc.) sont dans le dossier `public/`.
 *    - Ces ressources sont accessibles directement via des URL.
 * 
 * 9. **Objectifs du projet** :
 *    - Fournir une interface utilisateur moderne et réactive.
 *    - Permettre une gestion efficace des utilisateurs et des posts.
 *    - Offrir une expérience utilisateur personnalisable grâce aux thèmes.
 *    - Utiliser des pratiques modernes de développement pour assurer la maintenabilité et l'évolutivité.
 * 
 * 10. **Technologies utilisées** :
 *     - **Vue.js** : Framework JavaScript pour construire l'interface utilisateur.
 *     - **Vite** : Outil de construction rapide pour le développement Vue.
 *     - **TypeScript** : Superset de JavaScript pour un typage statique.
 *     - **SCSS** : Préprocesseur CSS pour des styles plus dynamiques.
 *     - **DevExtreme** : Bibliothèque de composants (si applicable).
 * 
 * Ce projet est conçu pour être modulaire, maintenable et extensible. Il suit les meilleures pratiques de développement Vue.js et est prêt pour une mise en production.
 */