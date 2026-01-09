<template>
  <div class="page">

    <!-- Barre haute -->
    <div class="top">
      <DxTextBox
        v-model="scan"
        placeholder="Bipper votre commande"
        :show-clear-button="true"
        class="scan"
      />

      <!-- “Pill” (Toile / Etape) -->
      <div class="pill">
        <div class="pill-left">Toile</div>
        <div class="pill-right">Etape 1/7</div>
      </div>

      <div class="operator">Opérateur 1 : 000251</div>
    </div>

    <!-- Cadre 1 : Information commande -->
    <section class="box">
      <div class="box-title">Information de la commande</div>

      <div class="grid-commande">
        <!-- Colonne gauche (labels) -->
        <div class="cell col-left">
          <div class="line"><span class="k">CD :</span> <span class="v">{{ commande.cd }}</span></div>
          <div class="line"><span class="k">Lg :</span> <span class="v">{{ commande.lg }}</span></div>
          <div class="line"><span class="k">Qte :</span> <span class="v">{{ commande.qte }}</span></div>

          <div class="spacer"></div>

          <div class="line"><span class="k">Saisie par :</span> <span class="v">{{ commande.saisiePar }}</span></div>
          <div class="line"><span class="k strong">Référence commande :</span> <span class="v">{{ commande.reference }}</span></div>
          <div class="line"><span class="k strong">Produit :</span> <span class="v">{{ commande.produit }}</span></div>
        </div>

        <!-- Colonne centre -->
        <div class="cell col-mid">
          <div class="col-header">Description produit</div>
          <div class="big-empty">{{ commande.description || '' }}</div>
        </div>

        <!-- Colonne droite -->
        <div class="cell col-right">
          <div class="col-header">Client</div>
          <div class="big-empty">{{ commande.client || '' }}</div>
        </div>
      </div>
    </section>

    <!-- Cadre 2 : Information article -->
    <section class="box">
      <div class="box-title">Information de l’article</div>

      <div class="grid-article">
        <div class="cell2">
          <div class="col-header">Code barre toile</div>

          <!-- Si tu veux vraiment un champ scannable ici -->
          <DxTextBox
            v-model="article.codeBarreToile"
            :show-clear-button="true"
            class="inside-input"
          />
        </div>

        <div class="cell2"></div>
        <div class="cell2"></div>
        <div class="cell2"></div>
        <div class="cell2"></div>
      </div>
    </section>

    <!-- Actions bas -->
    <div class="bottom-actions">
      <DxButton text="Formation" styling-mode="contained" />
      <DxButton text="Suggestion" styling-mode="contained" />
      <DxButton text="MOI" styling-mode="contained" />
    </div>

  </div>
</template>

<script setup>
import { ref } from "vue";
import DxTextBox from "devextreme-vue/text-box";
import DxButton from "devextreme-vue/button";

const scan = ref("");

const commande = ref({
  cd: "",
  lg: "",
  qte: "",
  saisiePar: "",
  reference: "",
  produit: "",
  description: "",
  client: ""
});

const article = ref({
  codeBarreToile: ""
});
</script>

<style scoped>
.page{
  padding: 18px 22px;
  background:#f6f2ff; /* fond violet clair comme maquette */
  min-height: 100vh;
}

.top{
  display:flex;
  align-items:center;
  gap: 18px;
}

.scan{
  width: 240px;
}

.pill{
  display:flex;
  border: 1px solid #0e0e0e;
  border-radius: 18px;
  overflow:hidden;
}

.pill-left, .pill-right{
  padding: 6px 14px;
  font-size: 13px;
  background:#ffffff;
}

.operator{
  margin-left:auto;
  font-size: 13px;
}

/* Cadres */
.box{
  margin-top: 18px;
  background:#fff;
  border: 2px solid #000000;
  border-radius: 10px;
  overflow:hidden; /* pour garder les bords nets */
}

.box-title{
  text-align:center;
  font-size: 12px;
  padding: 6px 10px;
  border-bottom: 2px solid #000000;
}

/* Bloc “commande” en 3 colonnes */
.grid-commande{
  display:grid;
  grid-template-columns: 260px 1fr 220px;
}

.cell{
  min-height: 150px;
  padding: 10px;
  border-right: 2px solid #000000;
}

.col-right{ border-right: none; }

.col-header{
  text-align:center;
  font-size: 12px;
  padding-bottom: 6px;
  border-bottom: 1px solid #000000;
  margin-bottom: 8px;
}

.line{
  display:flex;
  gap: 6px;
  margin: 4px 0;
  font-size: 12px;
}

.k{ min-width: 120px; }
.k.strong{ font-weight:700; }
.v{ opacity: .9; }

.spacer{ height: 10px; }

.big-empty{
  min-height: 90px; /* pour faire la grande zone vide */
}

/* Bloc “article” : 5 colonnes comme la maquette */
.grid-article{
  display:grid;
  grid-template-columns: 1.2fr 1fr 1fr 1fr 1fr;
  min-height: 110px;
}

.cell2{
  border-right: 2px solid #000000;
  padding: 10px;
}

.cell2:last-child{ border-right:none; }

.inside-input{
  margin-top: 10px;
}

/* Boutons bas */
.bottom-actions{
  margin-top: 18px;
  display:flex;
  justify-content:center;
  gap: 14px;
}
</style>
