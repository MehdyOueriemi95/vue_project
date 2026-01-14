<template>
  <div class="home">
    <h1>Homepage</h1>

    <!-- PRIMARY -->
    <DxButton
      text="Continuer"
      type="default"
      styling-mode="contained"
      class="btn btn--primary"
    />

    <!-- SUCCESS -->
    <DxButton
      text="Valider"
      type="success"
      styling-mode="contained"
      class="btn btn--success"
    />

    <!-- DANGER -->
    <DxButton
      text="Supprimer"
      type="danger"
      styling-mode="contained"
      class="btn btn--danger"
    />
  </div>
</template>

<script setup>
import DxButton from "devextreme-vue/button";
</script>

<style lang="scss" scoped>
@use "@/assets/styles/home_page_operateur";
</style>
