<template>
  <div>
    <DxButton text="Retour" type="normal" icon="arrowleft" @click="goBack" />

    <div v-if="post" class="post-card">
      <h2>{{ post.title }}</h2>

      <div v-if="post.picture" class="post-image">
        <img :src="post.picture" alt="Image du post" />
      </div>

      <p class="post-content">{{ post.content }}</p>

      <p class="post-author">
        Auteur : <strong>{{ post.username || "Utilisateur inconnu" }}</strong>
      </p>
    </div>

    <div v-else class="loading">
      <DxLoadPanel :visible="true" shadingColor="rgba(0,0,0,0.1)" message="Chargement..." />
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { DxButton, DxLoadPanel } from "devextreme-vue";
import { getPostById, getUserById } from "@sdk";

export default {
  components: { DxButton, DxLoadPanel },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const postId = route.params.id as string;
    const post = ref<any>(null);

    const goBack = () => {
      router.push("/posts");
    };

    onMounted(async () => {
      try {
        const result = await getPostById(postId);
        if (result.ok) {
          post.value = result.data;

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
.post-card {
  max-width: 800px;
  margin: 24px auto;
  padding: 24px;
  border-radius: 8px;
  border: 1px solid #ddd;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.post-image img {
  width: 100%;
  border-radius: 6px;
  margin: 12px 0;
}

.post-content {
  margin: 12px 0;
  font-size: 1.05rem;
  line-height: 1.5;
}

.post-author {
  color: #555;
  font-style: italic;
}

.loading {
  text-align: center;
  margin-top: 40px;
}
</style>