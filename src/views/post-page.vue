<template>
  <div>
    <!-- En-tête de la page avec le titre et le bouton de création -->
    <div class="title-block">
      <h2>Posts</h2>
      <button class="create-button" @click="goToCreatePost">+ Créer un nouveau ticket</button>
    </div>

    <!-- Grille de données DevExtreme pour afficher les posts -->
    <dx-data-grid
      class="dx-card content-block"
      :data-source="dataSourceConfig"
      :focused-row-index="0"
      :show-borders="false"
      :focused-row-enabled="true"
      :column-auto-width="true"
      :column-hiding-enabled="true"
      :remote-operations="true"
      :height="700"
      @row-click="viewPostDetail"
      :hover-state-enabled="true"
      :show-row-lines="true"
    >
      <!-- Configuration de la pagination : 10 éléments par page -->
      <dx-paging :page-size="10" />
      <!-- Barre de pagination avec sélecteur de taille de page et informations -->
      <dx-pager :show-page-size-selector="true" :show-info="true" />
      <!-- Ligne de filtres pour rechercher dans les colonnes (désactivée) -->
      <dx-filter-row :visible="false" />
      <!-- Panneau de groupement pour organiser les données (désactivé) -->
      <dx-group-panel :visible="false" />
      <!-- Défilement virtuel pour optimiser les performances avec de grandes quantités de données -->
      <dx-scrolling mode="virtual" row-rendering-mode="virtual" />

      <!-- Colonnes de la grille -->
      <!-- Colonne ID : identifiant unique du post (non éditable) -->
      <dx-column data-field="id" caption="ID" :allow-editing="false" :width="100" />
      <!-- Colonne Titre : titre du post (éditable) -->
      <dx-column data-field="title" caption="Titre" :allow-editing="true" :width="200" />
      <!-- Colonne Image : image du post (non éditable) -->
      <dx-column
        data-field="picture"
        caption="Image"
        :allow-editing="false"
        cell-template="imageTemplate"
        :width="150"
      />
      <template #imageTemplate="{ data }">
        <img
          v-if="data.value"
          :src="data.value"
          alt="Post image"
          style="height: 50px; max-width: 100px; object-fit: contain"
        />
      </template>
      <!-- Colonne Contenu : corps du post (éditable) limité à 100 caractères-->
      <dx-column
        data-field="content"
        caption="Contenu"
        :allow-editing="true"
        cell-template="contentTemplate"
      />
      <template #contentTemplate="{ data }">
        <span v-if="data.value">
          {{ data.value.length > 100 ? data.value.substring(0, 100) + "..." : data.value }}
        </span>
      </template>
      <!-- Colonne Utilisateur : nom de l'utilisateur auteur du post -->
      <dx-column data-field="username" caption="Auteur" :allow-editing="false" :width="200" />
    </dx-data-grid>
  </div>
</template>

<script lang="ts">
// Import des fonctions depuis le SDK pour récupérer les posts et les utilisateurs
import { getPosts } from "@sdk";
import { getUserById } from "@sdk";
// Import des types et utilitaires DevExtreme pour la gestion des données
import "devextreme-vue/common/data";
import { CustomStore } from "devextreme/common/data";
// Import de ref et useRouter depuis Vue pour créer des références réactives et la navigation
import { ref } from "vue";
import { useRouter } from "vue-router";
// Import des composants DevExtreme pour la grille de données
import DxDataGrid, {
  DxColumn,
  DxFilterRow,
  DxGroupPanel,
  DxScrolling,
  // DxLookup,
  DxPager,
  DxPaging,
  // type DxDataGridTypes,
} from "devextreme-vue/data-grid";

export default {
  // Fonction setup() : point d'entrée de la composition API de Vue 3
  setup() {
    // Router pour la navigation entre les pages
    const router = useRouter();

    // Variable réactive pour stocker les paramètres de requête (pagination, filtres, etc.)
    const queryParams = ref({});

    // Fonction pour rediriger vers la page de création de post
    const goToCreatePost = () => {
      router.push({ name: "create-post" });
    };

    const viewPostDetail = (e: any) => {
      console.log(e.data.id);
      if (!e.data) return;

      // Vérification : e.data.id existe
      const postId = e.data.id;
      if (!postId) return;

      router.push({
        name: "post-detail",
        params: { id: postId },
      });
    };

    // Configuration de la source de données pour la grille DevExtreme
    const dataSourceConfig = {
      store: new CustomStore({
        // Clé primaire utilisée pour identifier chaque ligne (ici "id")
        key: "id",
        // Fonction asynchrone appelée par DevExtreme pour charger les données
        load: async (loadOptions) => {
          // Sauvegarde des options de chargement (pagination, tri, filtres, etc.)
          queryParams.value = loadOptions;
          console.log("Load options:", loadOptions);
          console.log("Query params:", queryParams.value);

          try {
            // Appel à l'API pour récupérer les posts avec les options de chargement
            const result = await getPosts(loadOptions);

            console.log("=== RÉSULTAT GET POSTS ===");
            console.log("Result OK:", result.ok);
            console.log("Result data:", result.data);
            console.log("==========================");

            // Vérification si la requête a échoué
            if (!result.ok) {
              // Extraction du message d'erreur ou utilisation d'un message par défaut
              const errorMessage =
                "message" in result ? result.message : "Erreur lors du chargement des posts";
              console.error("Error loading posts:", errorMessage);
              throw new Error(errorMessage);
            }

            // DevExtreme attend un objet avec 'data' (tableau) et 'totalCount' (nombre total)
            let dataArray = [];
            let totalCount = 0;

            // Vérifier si l'API retourne déjà un objet avec data et totalCount
            if (result.data && typeof result.data === "object" && !Array.isArray(result.data)) {
              const apiData = result.data;
              // Vérifier si l'objet contient un champ 'data' qui est un tableau
              if ("data" in apiData && Array.isArray(apiData.data)) {
                dataArray = apiData.data;
                // Utiliser totalCount de l'API ou la longueur du tableau
                const apiDataObj = apiData;
                const totalCountValue = "totalCount" in apiDataObj ? apiDataObj.totalCount : null;
                totalCount =
                  typeof totalCountValue === "number" ? totalCountValue : dataArray.length;
              }
            }
            // Si l'API retourne directement un tableau
            else if (Array.isArray(result.data)) {
              dataArray = result.data;
              totalCount = result.data.length;
            }

            // Enrichir les posts avec les informations utilisateur
            // Promise.all permet d'exécuter tous les appels API en parallèle pour optimiser les performances
            const enrichedData = await Promise.all(
              // Pour chaque post dans le tableau, on va enrichir les données avec les infos utilisateur
              dataArray.map(async (post) => {
                // Vérifier si le post contient une référence utilisateur (format: "/api/v1/users/15")
                if (post.users && typeof post.users === "string") {
                  // Utiliser une expression régulière pour extraire l'ID utilisateur depuis l'URL
                  // Exemple: "/api/v1/users/15" -> extrait "15"
                  const userIdMatch = post.users.match(/\/users\/(\d+)/);

                  // Si un ID utilisateur a été trouvé dans l'URL
                  if (userIdMatch && userIdMatch[1]) {
                    try {
                      // Appel API pour récupérer les informations de l'utilisateur par son ID
                      const userResult = await getUserById(userIdMatch[1]);

                      // Vérifier que l'appel API a réussi
                      if (userResult.ok && userResult.data) {
                        // Récupérer les données utilisateur depuis la réponse
                        const userData = userResult.data;

                        // Vérifier que les données utilisateur sont bien un objet
                        if (userData && typeof userData === "object") {
                          const user = userData;

                          // Si le champ 'username' existe dans les données utilisateur, l'utiliser
                          if ("username" in user) {
                            post.username = user.username;
                          } else {
                            // Sinon, utiliser un texte par défaut
                            post.username = "Utilisateur inconnu";
                          }
                        } else {
                          // Si les données ne sont pas un objet valide, utiliser le texte par défaut
                          post.username = "Utilisateur inconnu";
                        }

                        // Sauvegarder l'ID utilisateur dans le post pour référence future
                        post.userId = userIdMatch[1];
                      }
                    } catch (error) {
                      // En cas d'erreur lors de la récupération de l'utilisateur, logger un avertissement
                      // et définir un username par défaut pour ne pas bloquer l'affichage
                      console.warn(
                        `Erreur lors de la récupération de l'utilisateur ${userIdMatch[1]}:`,
                        error
                      );
                      post.username = "Utilisateur inconnu";
                    }
                  }
                }
                // Retourner le post enrichi (ou non modifié si pas de référence utilisateur)
                return post;
              })
            );

            // Retourner le format attendu par DevExtreme
            return {
              data: enrichedData,
              totalCount: totalCount,
            };
          } catch (error) {
            // Gestion des erreurs : log dans la console et propagation de l'erreur
            console.error("Error loading data:", error);
            throw error;
          }
        },
      }),
    };

    // Retour des propriétés et méthodes exposées au template
    return {
      dataSourceConfig,
      goToCreatePost,
      viewPostDetail,
    };
  },
  // Déclaration des composants utilisés dans le template
  components: {
    DxDataGrid,
    DxColumn,
    DxFilterRow,
    DxScrolling,
    // DxLookup,
    DxGroupPanel,
    DxPager,
    DxPaging,
  },
};
</script>
<style lang="scss">
/* Style pour la ligne de filtres : fond transparent pour un rendu plus épuré */
.dx-datagrid-filter-row {
  background-color: transparent;
}

/* Style pour le bloc de titre : disposition en flexbox pour aligner le contenu */
.title-block {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

/* Style pour le bouton de création de post */
.create-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.create-button:hover {
  background-color: #0056b3;
}

.create-button:active {
  background-color: #004085;
}

.dx-datagrid .dx-row {
  cursor: pointer;
}
</style>
