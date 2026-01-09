<template>
  <div>
    <DxButton text="Retour" type="normal" icon="arrowleft" @click="goBack" />
    <h2>QR Code pour ton site</h2>
    <QrcodeVue :value="url" :size="250" />
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { DxButton } from "devextreme-vue";
import QrcodeVue from "qrcode.vue";

const router = useRouter();
const goBack = () => router.push("/home");

// URLs à encoder
const url = "http://oldappweb/519_ControlesCommandes/Manager/?filter_cde=013439";
</script>
