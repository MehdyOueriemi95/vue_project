<template>
  <div>
    <!-- Bouton Retour -->
    <DxButton text="Retour" type="normal" icon="arrowleft" @click="goBack" />

    <DxPopup
      :drag-enabled="true"
      position="center"
      :height="250"
      :width="500"
      :show-title="true"
      title="Suppression d'un post"
      v-model:visible="isPopupVisible"
      :hide-on-outside-click="true"
      content-template="popup-content"
    >
      <template #popup-content>
        <div style="display: flex; justify-content: center; align-items: center; flex-direction: column;">
          <p>Êtes-vous sûr de vouloir supprimer ce post ?</p>

          <div style="display: flex; gap: 1em">
            <DxButton text="Oui" type="success" icon="check" @click="deletePost" />
            <DxButton text="Non" type="danger" icon="close" @click="togglePopupDelete" />
          </div>
        </div>
      </template>
    </DxPopup>

    <div v-if="post" class="dx-card" style="margin-top: 2em; padding: 2em">
      <!-- Bouton Supprimer -->
      <DxButton
        style="float: right; margin-left: 0.5em"
        text="Supprimer"
        type="danger"
        icon="trash"
        @click="togglePopupDelete"
      />

      <!-- Bouton Modifier / Sauvegarder -->
      <DxButton
        style="float: right"
        :text="editMode ? 'Sauvegarder' : 'Modifier'"
        :type="editMode ? 'success' : 'default'"
        icon="edit"
        @click="toggleEdit"
      />

      <!-- Titre -->
      <h2 style="margin-bottom: 0.5em">
        <template v-if="editMode">
          <input v-model="editableTitle" style="width: 100%; font-size: 1.5em" />
        </template>
        <template v-else>
          {{ post.title }}
        </template>
      </h2>

      <!-- Image -->
      <div v-if="post.picture">
        <img :src="post.picture" alt="Image du post" style="max-width: 100%; margin-bottom: 1em" />
      </div>

      <!-- Contenu -->
      <div>
        <template v-if="editMode">
          <textarea v-model="editableContent" style="width: 100%; min-height: 150px"></textarea>
        </template>
        <template v-else>
          <p>{{ post.content }}</p>
        </template>
      </div>

      <!-- Auteur -->
      <p>
        Auteur : <strong>{{ post.username || "Auteur inconnu" }}</strong>
      </p>
    </div>

    <!-- Loading -->
    <div v-else>
      <DxLoadPanel :visible="true" shadingColor="rgba(0,0,0,0.1)" message="Chargement..." />
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { DxButton, DxLoadPanel, DxPopup } from "devextreme-vue";
import { getPostById, getUserById, updatePost, deletePostById } from "@sdk";

export default {
  components: { DxButton, DxLoadPanel, DxPopup },
  setup() {
    // On récupère les routes
    const route = useRoute();
    const router = useRouter();

    // On récupère les informations du post
    const postId = route.params.id as string;
    const post = ref<any>(null);

    // Variables pour gérer la modification
    const editMode = ref(false);
    const editableTitle = ref("");
    const editableContent = ref("");

    // Variables pour gérer la popup de suppression
    const isPopupVisible = ref(false);

    // Retour à la liste des posts
    const goBack = () => {
      router.push("/posts");
    };

    // La fonction qui permet de modifier et sauvegarder
    const toggleEdit = async () => {
      if (editMode.value) {
        try {
          // Mettre à jour les valeurs locales
          post.value.title = editableTitle.value;
          post.value.content = editableContent.value;
          const result = await updatePost(postId, editableTitle.value, editableContent.value);

          if (result.ok) {
            console.log("Post sauvegardé avec succès");
          } else {
            console.error("Erreur serveur");
          }
        } catch (err) {
          console.error("Erreur réseau ou exception :", err);
        }
      }

      editMode.value = !editMode.value;
    };

    const togglePopupDelete = () => {
      isPopupVisible.value = !isPopupVisible.value;
    };

    const deletePost = async () => {
      try {
        const result = await deletePostById(postId);
        if (result.ok) {
          goBack();
        } else {
          console.error("Erreur serveur");
        }
      } catch (err) {
        console.error("Erreur réseau ou exception :", err);
      }
    };

    onMounted(async () => {
      try {
        const result = await getPostById(postId);
        if (result.ok) {
          post.value = result.data;

          // On stock les variables modifiables
          editableTitle.value = post.value.title;
          editableContent.value = post.value.content;

          if (post.value.users) {
            const userIdMatch = post.value.users.match(/\/users\/(\d+)/);
            if (userIdMatch && userIdMatch[1]) {
              const userResult = await getUserById(userIdMatch[1]);
              post.value.username =
                userResult.ok && userResult.data?.username
                  ? userResult.data.username
                  : "Utilisateur inconnu";
            }
          }
        }
      } catch (e) {
        console.error("Erreur chargement du post", e);
      }
    });

    return {
      post,
      editMode,
      editableTitle,
      editableContent,
      isPopupVisible,
      goBack,
      toggleEdit,
      togglePopupDelete,
      deletePost,
    };
  },
};
</script>
