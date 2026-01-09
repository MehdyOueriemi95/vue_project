<template>
  <div>
    <DxButton text="Retour" type="normal" icon="arrowleft" @click="goBack" />
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { DxButton } from "devextreme-vue";

const router = useRouter();
const goBack = () => router.push("/home");
</script>
