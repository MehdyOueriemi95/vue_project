<template>
  <div class="login-page">
    <!-- <img src="../assets/logo-mariton.png" class="logo" /> -->

    <div class="login-container">

      <!-- Login / Mot de passe -->
      <div class="login-block">
        <h3>Connexion Login / Mot de passe</h3>

        <DxTextBox
          v-model="login"
          placeholder="Login"
          show-clear-button
        />

        <DxTextBox
          v-model="password"
          placeholder="Mot de passe"
          mode="password"
          show-clear-button
        />

        <DxButton
          text="Se connecter"
          type="default"
          styling-mode="contained"
        />
      </div>

      <div class="divider"></div>

      <!-- Badge -->
      <div class="login-block">
        <h3>Connexion par badge</h3>

        <DxTextBox
          v-model="badge"
          placeholder="Badge"
          show-clear-button
        />

        <DxButton
          text="Se connecter"
          type="default"
          styling-mode="contained"
        />
      </div>

    </div>
  </div>
</template>

<script setup>
import DxTextBox from 'devextreme-vue/text-box';
import DxButton from 'devextreme-vue/button';

import { ref } from 'vue';

const login = ref('');
const password = ref('');
const badge = ref('');
</script>

<style>
  .login-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.login-container {
  display: flex;
  gap: 60px;
}

.login-block {
  width: 280px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.divider {
  width: 1px;
  background: #ddd;
}
</style>
