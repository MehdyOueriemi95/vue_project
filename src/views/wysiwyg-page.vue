<template>
  <div>
    <DxButton text="Retour" type="normal" icon="arrowleft" @click="goBack" />

    <!-- On utilise v-if pour détruire l'éditeur avant de changer de page -->
    <DxHtmlEditor
      ref="editorRef"
      class="editor-container"
      v-model="htmlContent"
      :placeholder="placeholderText"
      :height="500"
      :toolbar="toolbarOptions"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { DxButton, DxHtmlEditor } from "devextreme-vue";

// router
const router = useRouter();

const goBack = () => {
  router.push("/home");
};

// v-model pour l'éditeur
const htmlContent = ref("");
const placeholderText = "Écris quelque chose ici…";

// options de la toolbar
const toolbarOptions = ref({
  items: [
    "bold",
    "italic",
    "underline",
    "strike",
    "alignLeft",
    "alignCenter",
    "alignRight",
    "link",
    "image",
    "undo",
    "redo",
  ],
});
</script>

<style>
.editor-container {
  margin: 20px auto; /* centrer horizontalement */
}
</style>