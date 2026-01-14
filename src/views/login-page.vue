<template>
  <!-- Wrapper global de la page (utile pour scoper des overrides DX si besoin) -->
  <main class="home-page">
    <!-- Breadcrumbs pour la navigation hiérarchique -->
    <Breadcrumbs
      :items="breadcrumbItems"
      root-label="Accueil"
      @select="onBreadcrumbSelect"
    />

    <section class="actions">
      <!-- Liste des actions disponibles, filtrées selon le mode de connexion -->
      <DxList
        class="actions-list"
        :items="visibleActions"
        item-key="key"
        :hover-state-enabled="false"
        :focus-state-enabled="false"
        selection-mode="none"
        :show-selection-controls="false"
        item-template="action"
      >
        <!-- Template personnalisé pour chaque action (bouton) -->
        <template #action="{ data }">
          <div class="action-card">
            <DxButton
              class="btn btn-small btn-primary"
              :text="data.label"
              :icon="data.icon"
              :disabled="data.disabled"
              @click="onActionClick(data)"
            />
          </div>
        </template>
      </DxList>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

import DxButton from 'devextreme-vue/button';
import DxList from 'devextreme-vue/list';

import { useAuthStore } from '../stores/useAuthStore';
import Breadcrumbs, { type BreadcrumbItem } from '../components/Breadcrumbs.vue';

/* =====================================================
   STORES & ROUTER
   ===================================================== */
const authStore = useAuthStore();
const router = useRouter();

/* =====================================================
   TYPES
   ===================================================== */
type ActionItem = {
  key: string; // identifiant unique
  label: string; // libellé affiché
  route?: string; // route vers laquelle naviguer
  icon?: string; // icône associée (optionnelle pour éviter les erreurs futures)
  modes: Array<'credentials' | 'badge'>; // modes d'authentification autorisés
  children?: ActionItem[]; // sous-actions éventuelles
  disabled?: boolean; // désactivation
};

/* =====================================================
   STATE (réactif)
   ===================================================== */
const currentPath = ref<BreadcrumbItem[]>([]);
const currentItems = ref<ActionItem[]>([]);

/* =====================================================
   DATA (actions)
   ===================================================== */
const actions: ActionItem[] = [
  { key: 'toile', label: 'Toile', icon: 'product', route: '/app/home', modes: ['badge'] },
  { key: 'coulisses', label: 'Coulisses', icon: 'columnchooser', route: '/app/home', modes: ['badge'] },
  { key: 'boitier', label: 'Boitier', icon: 'box', route: '/app/home', modes: ['badge'] },
  { key: 'barre-final', label: 'Barre final', icon: 'handlehorizontal', route: '/app/home', modes: ['badge'] },
  { key: 'montage-lf', label: 'Montage LF', icon: 'toolbox', route: '/app/home', modes: ['badge'] },
  { key: 'montage-meca', label: 'Montage Méca', icon: 'toolbox', route: '/app/home', modes: ['badge'] },
  { key: 'emballage', label: 'Emballage', icon: 'packagebox', route: '/app/home', modes: ['badge'] },
  { key: 'transport', label: 'Transport', icon: 'car', route: '/app/home', modes: ['credentials'], disabled: true },
  { key: 'lancement', label: 'Lancement', icon: 'sortup', route: '/app/home', modes: ['credentials'], disabled: true },
  { key: 'suivi-projets', label: 'Suivi Projets', icon: 'event', route: '/app/home', modes: ['credentials'], disabled: true },
  { key: 'mbatch', label: 'Mbatch', icon: 'smalliconslayout', route: '/app/home', modes: ['credentials'], disabled: true },
  {
    key: 'support',
    label: 'Atelier',
    icon: 'preferences',
    modes: ['credentials'],
    children: [
      { key: 'support-ticket', label: 'Production', icon: 'check', route: '/app/home', modes: ['credentials'] },
      {
        key: 'atelier-details',
        label: 'Paramètres',
        icon: 'preferences',
        modes: ['credentials'],
        children: [
          { key: 'atelier-details-atelier-poste', label: 'Atelier & Poste', icon: 'user', route: '/app/home', modes: ['credentials'] },
          { key: 'atelier-details-formations', label: 'Formations', icon: 'bookmark', route: '/app/home', modes: ['credentials'] },
          { key: 'atelier-details-utilisateurs', label: 'Utilisateurs', icon: 'group', route: '/app/home', modes: ['credentials'] },
          { key: 'atelier-details-memos', label: 'Mémos', icon: 'bookmark', route: '/app/home', modes: ['credentials'] },
        ],
      },
    ],
  },
];

/* Initialiser le niveau courant à la racine */
currentItems.value = actions;

/* =====================================================
   COMPUTED
   ===================================================== */
const visibleActions = computed(() => {
  const mode = (authStore.loginMethod as 'credentials' | 'badge') || 'credentials';
  return currentItems.value.filter((a) => a.modes.includes(mode));
});

const breadcrumbItems = computed(() => currentPath.value);

/* =====================================================
   HANDLERS
   ===================================================== */

/* Callback lorsqu'un breadcrumb est sélectionné */
const onBreadcrumbSelect = (key: string | null) => {
  if (key === null) {
    currentPath.value = [];
    currentItems.value = actions;
    return;
  }

  const idx = currentPath.value.findIndex((item: BreadcrumbItem) => item.key === key);

  if (idx >= 0) {
    currentPath.value = currentPath.value.slice(0, idx + 1);

    let level: ActionItem[] = actions;

    for (const crumb of currentPath.value) {
      const found = level.find((a) => a.key === crumb.key);
      level = found?.children ?? [];
    }

    currentItems.value = level;
  }
};

/* On centralise le click ici pour :
   - garder le template clean
   - éviter un click si disabled (sécurité) */
const onActionClick = (action: ActionItem) => {
  if (action.disabled) return;
  enter(action);
};

/* Navigation dans un sous-niveau ou vers une route finale */
const enter = (action: ActionItem) => {
  if (action.children?.length) {
    currentPath.value = [...currentPath.value, { key: action.key, label: action.label }];
    currentItems.value = action.children;
  } else if (action.route) {
    router.push(action.route);
  }
};
</script>

<style lang="scss" scoped>
@use '../styles/views/homeView';
</style>
