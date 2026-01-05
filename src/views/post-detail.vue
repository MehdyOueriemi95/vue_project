<template>
  <div v-if="post">
    <DxButton text="Retour" icon="arrowleft" type="normal" @click="goBack" />
    <h2>{{ post.title }}</h2>
    <img v-if="post.picture" :src="post.picture" alt="Image du post" />
    <p>{{ post.content }}</p>
    <p>Auteur : {{ post.username || "Utilisateur inconnu" }}</p>
  </div>
  <div v-else>Chargement...</div>
</template>

<script lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { DxButton } from "devextreme-vue/button";
import { getPostById, getUserById } from "@sdk";

export default {
  components: { DxButton },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const postId = route.params.id as string;
    const post = ref<any>(null);

    const goBack = () => {
      router.push("/posts"); // redirection vers la liste des posts
    };

    onMounted(async () => {
      try {
        const result = await getPostById(postId);
        if (result.ok) {
          post.value = result.data;

          // récupérer l'auteur si nécessaire
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

    return { post, goBack };
  },
};
</script>

<style scoped>
/* Optionnel : un peu d'espace autour du bouton */
.dx-button {
  margin-bottom: 16px;
}
</style>
