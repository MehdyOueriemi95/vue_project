# 📊 Schéma du Flux d'Affichage - Mariton ERP POC

## 🎯 Vue d'ensemble du flux

```
┌─────────────────────────────────────────────────────────────────┐
│                        index.html                               │
│  <div id="app"></div>  ← Point d'entrée de l'application        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                        main.ts                                  │
│  • Initialise Vue App                                           │
│  • Configure le Router                                          │
│  • Charge les thèmes DevExtreme                                 │
│  • Monte l'app sur #app                                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                        App.vue                                  │
│  • Composant racine                                             │
│  • Gère la taille d'écran (responsive)                          │
│  • Détermine le layout selon la route                           │
│  • Affiche <router-view>                                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                        router.ts                                │
│  • Vérifie l'authentification (beforeEach)                      │
│  • Sélectionne le layout (meta.layout)                          │
│  • Charge le composant de la vue                                │
└────────────────────────────┬────────────────────────────────────┘
                             │
        ┌────────────────────┴────────────────────┐
        │                                         │
        ▼                                         ▼
┌───────────────────────┐              ┌───────────────────────┐
│  Layout:              │              │  Layout:              │
│  side-nav-inner-      │              │  single-card.vue      │
│  toolbar.vue          │              │  (Formulaires)        │
│  (Pages principales)  │              │                       │
└───────────┬───────────┘              └───────────┬───────────┘
            │                                      │
            ▼                                      ▼
    ┌───────────────┐                    ┌───────────────┐
    │  Vue (Page)   │                    │  Vue (Form)   │
    │  ex: home-page│                    │  ex: login-   │
    │     .vue      │                    │    form.vue   │
    └───────────────┘                    └───────────────┘
```

---

## 📁 Structure des Dossiers et Rôles

```
vue_project/
│
├── 📄 index.html                    ← Point d'entrée HTML
│   └── <div id="app"></div>         ← Où Vue monte l'application
│
├── 📁 src/
│   │
│   ├── 📄 main.ts                   ← 🚀 ENTRÉE PRINCIPALE
│   │   ├── Crée l'app Vue
│   │   ├── Configure le router
│   │   ├── Charge les thèmes DevExtreme
│   │   └── Monte sur #app
│   │
│   ├── 📄 App.vue                   ← 🎨 COMPOSANT RACINE
│   │   ├── Gère le responsive (taille d'écran)
│   │   ├── Détermine le layout via $route.meta.layout
│   │   ├── Affiche <router-view> (contenu de la route)
│   │   └── Inclut le footer
│   │
│   ├── 📄 router.ts                 ← 🗺️ GESTION DES ROUTES
│   │   ├── Définit toutes les routes
│   │   ├── Vérifie l'auth (beforeEach)
│   │   ├── Assigne un layout à chaque route (meta.layout)
│   │   └── Redirige si non authentifié
│   │
│   ├── 📁 layouts/                  ← 🏗️ STRUCTURE DES PAGES
│   │   │
│   │   ├── 📄 side-nav-inner-toolbar.vue  ← Layout principal
│   │   │   ├── Menu latéral (Drawer)
│   │   │   ├── Header toolbar
│   │   │   ├── Zone de contenu (<slot />)
│   │   │   └── Footer (<slot name="footer" />)
│   │   │
│   │   └── 📄 single-card.vue            ← Layout simple
│   │       └── Pour formulaires (login, signup, etc.)
│   │
│   ├── 📁 views/                    ← 📄 PAGES/VUES
│   │   ├── home-page.vue           ← Page d'accueil
│   │   ├── profile-page.vue         ← Page profil
│   │   ├── users-page.vue           ← Liste utilisateurs
│   │   ├── post-page.vue            ← Liste posts
│   │   ├── create-post-form.vue     ← Formulaire création post
│   │   ├── login-form.vue           ← Formulaire connexion
│   │   ├── create-account-form.vue  ← Formulaire inscription
│   │   └── reset-password-form.vue  ← Formulaire reset password
│   │
│   ├── 📁 components/               ← 🧩 COMPOSANTS RÉUTILISABLES
│   │   ├── header-toolbar.vue       ← Barre d'en-tête
│   │   ├── side-nav-menu.vue        ← Menu de navigation latéral
│   │   ├── user-panel.vue           ← Panneau utilisateur
│   │   ├── theme-switcher.vue       ← Sélecteur de thème
│   │   └── app-footer.vue           ← Pied de page
│   │
│   ├── 📄 app-navigation.ts         ← 📋 CONFIGURATION MENU
│   │   └── Définit les items du menu (Home, Examples, Posts)
│   │
│   ├── 📄 auth.ts                   ← 🔐 AUTHENTIFICATION
│   │   ├── loggedIn()               ← Vérifie si connecté
│   │   ├── logIn()                  ← Connexion
│   │   ├── logOut()                 ← Déconnexion
│   │   └── getUser()                ← Récupère l'utilisateur
│   │
│   └── 📁 sdk/                      ← 🌐 APPELS API
│       ├── httpClient.ts            ← Client HTTP (Axios)
│       ├── users.ts                 ← Fonctions API utilisateurs
│       ├── posts.ts                 ← Fonctions API posts
│       └── ping.ts                  ← Test de connexion
```

---

## 🔄 Flux Détaillé d'une Requête d'Affichage

### Exemple : Affichage de la page `/home`

```
1️⃣ UTILISATEUR CLIQUE SUR "HOME" DANS LE MENU
   │
   ▼
2️⃣ side-nav-menu.vue
   └── handleItemClick() → router.push("/home")
   │
   ▼
3️⃣ router.ts - beforeEach()
   ├── Vérifie si route nécessite auth (requiresAuth: true)
   ├── Vérifie auth.loggedIn()
   └── Si OK → next() | Si KO → redirige vers /login-form
   │
   ▼
4️⃣ router.ts - Route /home
   ├── meta: { layout: defaultLayout }
   ├── component: Home
   └── Charge home-page.vue
   │
   ▼
5️⃣ App.vue
   ├── Lit $route.meta.layout → defaultLayout
   ├── Charge <component :is="defaultLayout">
   └── Passe les props (title, isXSmall, isLarge)
   │
   ▼
6️⃣ side-nav-inner-toolbar.vue (Layout)
   ├── Affiche le Drawer (menu latéral)
   │   └── side-nav-menu.vue (avec app-navigation.ts)
   ├── Affiche header-toolbar.vue
   │   ├── Bouton menu (mobile)
   │   ├── Titre
   │   ├── theme-switcher.vue
   │   └── user-panel.vue
   ├── Affiche <slot /> → Contenu de la route
   │   └── home-page.vue s'affiche ici
   └── Affiche <slot name="footer" />
       └── app-footer.vue
   │
   ▼
7️⃣ home-page.vue
   └── Affiche le contenu de la page d'accueil
```

---

## 🎨 Structure Visuelle d'une Page

```
┌────────────────────────────────────────────────────────────┐
│                    side-nav-inner-toolbar.vue              │
│                                                            │
│  ┌──────────────┐  ┌────────────────────────────────────┐  │
│  │              │  │  header-toolbar.vue                │  │
│  │              │  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌────┐ │  │
│  │              │  │  │ Menu │ │Titre │ │Theme │ │User│ │  │
│  │              │  │  └──────┘ └──────┘ └──────┘ └────┘ │  │
│  │              │  └────────────────────────────────────┘  │
│  │              │                                          │
│  │  side-nav-   │  ┌────────────────────────────────────┐  │
│  │  menu.vue    │  │                                    │  │
│  │              │  │  <slot />                          │  │
│  │  ┌────────┐  │  │  ┌──────────────────────────────┐  │  │
│  │  │ Home   │  │  │  │  home-page.vue               │  │  │
│  │  │        │  │  │  │  (ou autre vue selon route)  │  │  │
│  │  │Examples│  │  │  │                              │  │  │
│  │  │ Profile│  │  │  │  Contenu de la page...       │  │  │
│  │  │ Users  │  │  │  │                              │  │  │
│  │  │        │  │  │  └──────────────────────────────┘  │  │
│  │  │ Posts  │  │  │                                    │  │
│  │  └────────┘  │  └────────────────────────────────────┘  │
│  │              │                                          │
│  │              │  ┌────────────────────────────────────┐  │
│  │              │  │  <slot name="footer" />            │  │
│  │              │  │  app-footer.vue                    │  │
│  │              │  └────────────────────────────────────┘  │
│  └──────────────┘                                          │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## 🔐 Flux d'Authentification

```
1️⃣ UTILISATEUR NON AUTHENTIFIÉ ACCÈDE À /home
   │
   ▼
2️⃣ router.ts - beforeEach()
   ├── to.matched.some(record => record.meta.requiresAuth) → true
   ├── auth.loggedIn() → false
   └── next({ name: "login-form", query: { redirect: "/home" }})
   │
   ▼
3️⃣ Route /login-form
   ├── meta: { layout: simpleLayout }  ← Layout simple
   └── component: login-form.vue
   │
   ▼
4️⃣ App.vue
   └── Charge single-card.vue (layout simple)
   │
   ▼
5️⃣ single-card.vue
   └── Affiche login-form.vue (sans menu, sans header complexe)
   │
   ▼
6️⃣ UTILISATEUR SE CONNECTE
   └── login-form.vue → auth.logIn()
   │
   ▼
7️⃣ Redirection vers la page demandée
   └── router.push(query.redirect || "/home")
```

---

## 📋 Mapping Routes → Layouts → Composants

| Route             | Layout                   | Vue                       | Auth Requise |
| ----------------- | ------------------------ | ------------------------- | ------------ |
| `/home`           | `side-nav-inner-toolbar` | `home-page.vue`           | ✅ Oui       |
| `/profile`        | `side-nav-inner-toolbar` | `profile-page.vue`        | ✅ Oui       |
| `/users`          | `side-nav-inner-toolbar` | `users-page.vue`          | ✅ Oui       |
| `/posts`          | `side-nav-inner-toolbar` | `post-page.vue`           | ✅ Oui       |
| `/posts/create`   | `side-nav-inner-toolbar` | `create-post-form.vue`    | ✅ Oui       |
| `/login-form`     | `single-card`            | `login-form.vue`          | ❌ Non       |
| `/create-account` | `single-card`            | `create-account-form.vue` | ❌ Non       |
| `/reset-password` | `single-card`            | `reset-password-form.vue` | ❌ Non       |

---

## 🔗 Dépendances entre Fichiers

```
index.html
  └── main.ts
      ├── App.vue
      │   ├── router.ts
      │   │   ├── auth.ts
      │   │   └── views/*.vue
      │   └── layouts/*.vue
      │       ├── components/header-toolbar.vue
      │       │   ├── components/user-panel.vue
      │       │   └── components/theme-switcher.vue
      │       └── components/side-nav-menu.vue
      │           └── app-navigation.ts
      └── router.ts
```

---

## 💡 Points Clés à Retenir

1. **index.html** : Point d'entrée → `<div id="app">`

2. **main.ts** : Initialise tout → Crée l'app Vue, configure le router

3. **App.vue** : Composant racine → Décide quel layout utiliser selon la route

4. **router.ts** :

   - Définit les routes
   - Vérifie l'authentification
   - Assigne un layout à chaque route (`meta.layout`)

5. **Layouts** : Structure de la page

   - `side-nav-inner-toolbar` : Pages principales (avec menu)
   - `single-card` : Formulaires (sans menu)

6. **Views** : Contenu réel de chaque page

7. **Components** : Éléments réutilisables (header, menu, footer, etc.)

8. **Flux** : Route → Router → Layout → Vue → Affichage

---

## 🎯 Exemple Concret : Page `/users`

```
1. Clic sur "Users" dans le menu
   ↓
2. router.push("/users")
   ↓
3. router.ts vérifie auth → OK
   ↓
4. Route /users → layout: side-nav-inner-toolbar, component: Users
   ↓
5. App.vue charge side-nav-inner-toolbar.vue
   ↓
6. Layout affiche :
   - Menu latéral (side-nav-menu.vue)
   - Header (header-toolbar.vue)
   - Contenu : users-page.vue (dans <slot />)
   - Footer (app-footer.vue)
   ↓
7. users-page.vue peut appeler sdk/users.ts pour récupérer les données
```

---

Ce schéma t'aide à comprendre comment tout s'articule ! 🚀
