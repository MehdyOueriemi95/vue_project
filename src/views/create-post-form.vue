<template>
  <!-- Conteneur principal du formulaire avec la classe dx-card pour le style DevExtreme -->
  <div class="dx-card create-post-form-container">
    <!-- En-tête du formulaire avec le titre -->
    <div class="form-header">
      <h2>Créer un nouveau ticket</h2>
    </div>

    <!-- Formulaire DevExtreme pour la création de post -->
    <!-- :form-data : lie les données du formulaire aux champs -->
    <!-- :disabled : désactive le formulaire pendant le chargement pour éviter les doubles soumissions -->
    <!-- @submit : écoute l'événement de soumission du formulaire -->
    <dx-form :form-data="formData" :disabled="loading" @submit="onSubmit">
      <!-- Champ Titre : champ de texte pour le titre du post -->
      <dx-item
        data-field="title"
        editor-type="dxTextBox"
        :editor-options="{ stylingMode: 'filled', placeholder: 'Titre du post' }"
      >
        <!-- Règle de validation : le titre est obligatoire -->
        <dx-required-rule message="Le titre est requis" />
        <!-- Label du champ -->
        <dx-label text="Titre" />
      </dx-item>

      <!-- Champ Contenu : zone de texte multiligne pour le contenu du post -->
      <dx-item
        data-field="content"
        editor-type="dxTextArea"
        :editor-options="{
          stylingMode: 'filled',
          placeholder: 'Contenu du post',
          height: 200
        }"
      >
        <!-- Règle de validation : le contenu est obligatoire -->
        <dx-required-rule message="Le contenu est requis" />
        <!-- Label du champ -->
        <dx-label text="Contenu" />
      </dx-item>

      <!-- Champ Image : champ de texte pour l'URL de l'image (optionnel) -->
      <dx-item
        data-field="picture"
        editor-type="dxTextBox"
        :editor-options="{ stylingMode: 'filled', placeholder: 'URL de l\'image' }"
      >
        <!-- Label du champ (pas de validation requise car optionnel) -->
        <dx-label text="Image (URL)" />
      </dx-item>

      <!-- Bouton de soumission du formulaire PAS REUSSIS A FAIRE MARCHER UN BTN DEV EXTREME-->
      <!-- <dx-button-item>
        <dx-button-options
          width="100%"
          type="default"
          :use-submit-behavior="true"
          :disabled="loading"
          styling-mode="contained"
          text="Créer le post"
        />
      </dx-button-item>-->
    </dx-form>

    <!-- Bouton alternatif en dehors du formulaire si le bouton du formulaire ne fonctionne pas -->
    <div class="button-container">
      <button
        class="submit-button"
        @click="onSubmit"
        :disabled="loading"
      >
        {{ loading ? 'Création en cours...' : 'Créer le post' }}
      </button>
    </div>

    <!-- Message d'erreur affiché en cas d'échec de la création -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script lang="ts">
// Import de ref depuis Vue pour créer des références réactives
import { ref } from 'vue';
// Import de useRouter depuis Vue Router pour la navigation entre les pages
import { useRouter } from 'vue-router';
// Import des composants DevExtreme pour le formulaire
import DxForm, {
  DxItem,
  DxRequiredRule,
  DxButtonItem,
  DxLabel,
  DxButtonOptions
} from 'devextreme-vue/form';
// Import du composant d'indicateur de chargement DevExtreme
import DxLoadIndicator from 'devextreme-vue/load-indicator';
// Import du client HTTP pour les appels API (utilise le proxy en développement)
import httpClientCrud from '@sdk/httpClientCrud';

export default {
  // Déclaration des composants utilisés dans le template
  components: {
    DxForm,
    DxItem,
    DxRequiredRule,
    DxLabel
  },
  // Fonction setup() : point d'entrée de la composition API de Vue 3
  setup() {
    // Router pour la navigation entre les pages
    const router = useRouter();

    // Variable réactive pour indiquer si le formulaire est en cours de soumission
    const loading = ref(false);
    // Variable réactive pour stocker les messages d'erreur
    const error = ref('');

    // Données réactives du formulaire initialisées avec des valeurs vides
    const formData = ref({
      title: '',           // Titre du post (obligatoire)
      content: '',         // Contenu du post (obligatoire)
      picture: '',         // URL de l'image (optionnel)
    });

    // Fonction asynchrone appelée lors de la soumission du formulaire
    const onSubmit = async (e) => {
      // Empêcher le comportement par défaut du formulaire (rechargement de page)
      if (e && e.preventDefault) {
        e.preventDefault();
      }
      // Activer l'état de chargement pour désactiver le formulaire et afficher l'indicateur
      loading.value = true;
      // Réinitialiser le message d'erreur
      error.value = '';

      try {
        // Appel API POST pour créer le post sur le serveur
        // L'URL '/posts' sera proxyfiée vers 'https://api-pour-apprendre.fr/api/v1/posts' en développement
        // Préparer les données à envoyer exactement comme dans Postman
        // Format exact de Postman: { "title": "string", "content": "string", "picture": "string", "user": "string" }
        // IMPORTANT: user doit être une chaîne "1", pas un nombre
        // IMPORTANT: picture doit toujours être présent, même si c'est une chaîne vide
        // Ordre exact comme dans Postman: title, content, user, picture
        const postData = {
          title: formData.value.title,
          content: formData.value.content,
          user: '1',  // Chaîne comme dans Postman
          picture: formData.value.picture || ''  // Toujours présent
        };

        // Log pour comparer avec Postman
        console.log('=== PAYLOAD ENVOYÉ ===');
        console.log('Format JSON:', JSON.stringify(postData));
        console.log('Objet:', postData);
        console.log('=====================');

        // Envoyer avec Axios
        const response = await httpClientCrud.post('/posts', postData);

        console.log('Réponse de l\'API:', response);
        console.log('Status:', response.status);
        console.log('Data:', response.data);

        // Vérifier si la création a réussi (code 200 OK ou 201 Created)
        if (response.status === 201 || response.status === 200) {
          // Redirection vers la page de liste des posts après création réussie
          router.push({ name: 'posts' });
        } else {
          // Si le statut n'est pas 200/201, afficher le message d'erreur de l'API
          if (response.data && response.data.message) {
            error.value = response.data.message;
          } else {
            error.value = 'Erreur lors de la création du post';
          }
        }
      } catch (err) {
        // Gestion des erreurs lors de l'appel API
        console.error('Erreur lors de la création du post:', err);

        // Vérifier si l'erreur a été normalisée par notre intercepteur
        if (err.normalized && err.normalized.message) {
          error.value = err.normalized.message;
        } else if (err.response && err.response.data && err.response.data.message) {
          error.value = err.response.data.message;
        } else {
          error.value = 'Une erreur est survenue lors de la création du post';
        }
      } finally {
        // Désactiver l'état de chargement dans tous les cas (succès ou échec)
        loading.value = false;
      }
    };

    // Retour des propriétés et méthodes exposées au template
    return {
      formData,      // Données du formulaire (réactives)
      loading,       // État de chargement (réactif)
      error,         // Message d'erreur (réactif)
      onSubmit       // Fonction de soumission du formulaire
    };
  }
};
</script>

<style lang="scss">
/* Conteneur principal du formulaire */
.create-post-form-container {
  max-width: 600px;        /* Largeur maximale pour centrer le formulaire */
  margin: 0 auto;          /* Centrage horizontal */
  padding: 20px;           /* Espacement interne */
}

/* En-tête du formulaire */
.form-header {
  margin-bottom: 30px;      /* Espacement en bas pour séparer du formulaire */

  h2 {
    margin: 0;              /* Suppression des marges par défaut */
    font-size: 24px;        /* Taille de police du titre */
    font-weight: 600;       /* Poids de la police (semi-bold) */
  }
}

/* Style pour le message d'erreur */
.error-message {
  margin-top: 20px;         /* Espacement en haut pour séparer du formulaire */
  padding: 10px;             /* Espacement interne */
  background-color: #f8d7da; /* Fond rouge clair pour attirer l'attention */
  color: #721c24;           /* Texte rouge foncé pour le contraste */
  border-radius: 4px;       /* Coins arrondis */
  border: 1px solid #f5c6cb; /* Bordure rouge clair */
}

/* Conteneur pour le bouton de soumission */
.button-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

/* Style pour le bouton de soumission */
.submit-button {
  width: 100%;
  padding: 12px 24px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover:not(:disabled) {
  background-color: #0056b3;
}

.submit-button:active:not(:disabled) {
  background-color: #004085;
}

.submit-button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
  opacity: 0.6;
}
</style>

