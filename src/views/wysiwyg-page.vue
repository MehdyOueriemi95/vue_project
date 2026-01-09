<template>
  <div>
    <DxButton text="Retour" type="normal" icon="arrowleft" @click="goBack" />
    <DxHtmlEditor
      class="editor-container"
      v-model="htmlContent"
      :placeholder="placeholderText"
      :height="500"
      :toolbar="toolbarOptions"
    />
    <DxButton text="Ajouter une vidéo YouTube" icon="video" @click="insertYoutube" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { DxButton, DxHtmlEditor } from "devextreme-vue";

// router
const router = useRouter();
const goBack = () => router.push("/home");

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

const insertYoutube = () => {
  const url = prompt("Lien YouTube :");
  if (!url) return;

  const embedUrl = url.replace("watch?v=", "embed/");

  htmlContent.value += `
    <iframe
      width="560"
      height="315"
      src="${embedUrl}"
      frameborder="0"
      allowfullscreen>
    </iframe>
  `;
};
</script>

<style>
.editor-container {
  margin: 20px auto; /* centrer horizontalement */
}
</style>
