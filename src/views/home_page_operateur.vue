<template>
  <div class="home-page">

    <!-- Header -->
    <div class="header">
      <span class="welcome">Bienvenue Opérateur</span>

      <DxButton
        icon="user"
        styling-mode="text"
      />
    </div>

    <!-- Titre -->
    <h2 class="title">Atelier Moustiquaire</h2>

    <!-- Boutons -->
    <div class="actions-grid">
      <DxButton
        v-for="action in actions"
        :key="action.label"
        :text="action.label"
        :type="action.active ? 'default' : 'normal'"
        styling-mode="contained"
        class="action-button"
        @click="goTo(action.route)"
      />
    </div>

  </div>
</template>

<script setup>

import DxButton from 'devextreme-vue/button';

const actions = [
  { label: 'Toile', route: '/toile', active: true },
  { label: 'Coulisses', route: '/coulisses' },
  { label: 'Boitier', route: '/boitier' },
  { label: 'Barre Final', route: '/barre-final' },
  { label: 'Montage LF', route: '/montage-lf' },
  { label: 'Montage Méca', route: '/montage-meca' },
  { label: 'Emballage', route: '/emballage' }
];

function goTo(route) {
  console.log('Navigation vers', route);
  // router.push(route)
}
</script>
<style>
  .home-page {
  padding: 24px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  text-align: center;
  margin: 40px 0;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  max-width: 700px;
  margin: 0 auto;
}

.action-button {
  height: 56px;
  border-radius: 10px;
}
</style>
