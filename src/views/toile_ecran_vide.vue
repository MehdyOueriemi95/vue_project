<!-- !
  ! Écran vide pour la toile
! -->

<template>
  <!-- HEADER -->
  <div class="header">
    <!-- Bip Commande -->
    <div class="bip_cmd">
      <DxTextBox
        v-model="scan"
        placeholder="Bipper votre commande"
        :show-clear-button="true"
        class="scan"
      />

      <!-- Pill étape -->
      <div class="pill_step">
        <div class="pill-left">Toile</div>
        <div class="pill-right">Etape 1/7</div>
      </div>

      <!-- Opérateur -->
      <div class="operator">Opérateur 1 : 000251</div>
    </div>

    <!-- Information commande -->
    <section class="main_box">
      <div class="box-title">Information de la commande</div>

      <div class="grid-info-cmd">
        <div class="cell-info-cmd">
          <div class="line">
            <span class="static_field">CD :</span><span>{{ commande.cd }}</span>
          </div>
          <div class="line">
            <span class="static_field">Lg :</span><span>{{ commande.lg }}</span>
          </div>
          <div class="line">
            <span class="static_field">Qte :</span><span>{{ commande.qte }}</span>
          </div>

          <div class="line">
            <span class="static_field">Saisie par :</span><span>{{ commande.saisiePar }}</span>
          </div>
          <div class="line">
            <span class="static_field strong">Référence commande :</span>
            <span>{{ commande.reference }}</span>
          </div>
          <div class="line">
            <span class="static_field strong">Produit :</span><span>{{ commande.produit }}</span>
          </div>
        </div>

        <div class="cell-info-cmd">
          <div class="title-cell">Description produit</div>
          <div class="big-empty">{{ commande.description }}</div>
        </div>

        <div class="cell-info-cmd col-cell-right">
          <div class="title-cell">Client</div>
          <div class="big-empty">{{ commande.client }}</div>
        </div>
      </div>
    </section>

    <!-- Information article -->
    <section class="main_box">
      <div class="box-title">Information de l’article</div>

      <div class="grid-info-article">
        <div class="cell-info-article">
          <div class="title-cell">Code barre toile</div>
          <DxTextBox
            v-model="article.codeBarreToile"
            :show-clear-button="true"
            class="inside-input"
          />
        </div>

        <div class="cell-info-article"></div>
        <div class="cell-info-article"></div>
        <div class="cell-info-article"></div>
        <div class="cell-info-article"></div>
      </div>

      <!-- SLIDER "Commande à contrôler" (bas-gauche) -->
      <Transition name="slide-alert">
        <div v-if="control.visible" class="control-slider" role="status" aria-live="polite">
          <div class="control-title">Attention Commande à contrôler</div>

          <div class="control-row">
            <span class="control-label">Type de contrôle :</span>
            <span class="control-value">{{ control.type }}</span>
          </div>
        </div>
      </Transition>
    </section>

    <!-- ✅ POPUP NOTE (DevExtreme) -->
    <DxPopup
      v-model:visible="notePopupVisible"
      :show-title="true"
      title="Titre note"
      :show-close-button="true"
      :hide-on-outside-click="true"
      :drag-enabled="false"
      :width="popupWidth"
      :height="popupHeight"
      :shading="true"
      shading-color="rgba(0,0,0,0.35)"
      class="note-popup"
    >
      <template #content>
        <div class="note-popup-body">
          <div class="note-popup-text">
            {{ noteText }}
          </div>

          <div class="note-popup-actions">
            <DxButton
              icon="check"
              styling-mode="contained"
              class="note-validate-btn"
              @click="closeNotePopup"
            />
          </div>
        </div>
      </template>
    </DxPopup>

    <!-- ✅ Actions -->
    <div class="bottom-actions">
      <DxButton text="Formation" styling-mode="contained" />
      <DxButton text="Suggestion" styling-mode="contained" />
      <DxButton text="MOI" styling-mode="contained" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";

import DxTextBox from "devextreme-vue/text-box";
import DxButton from "devextreme-vue/button";
import DxPopup from "devextreme-vue/popup";

/* -------------------------
   Données
------------------------- */
const scan = ref("");

const commande = ref({
  cd: "",
  lg: "",
  qte: "",
  saisiePar: "",
  reference: "",
  produit: "",
  description: "",
  client: "",
});

const article = ref({
  codeBarreToile: "",
});

/* -------------------------
   Slider contrôle
------------------------- */
const control = ref({
  visible: false,
  type: "P+",
});

/* -------------------------
   Popup Note
------------------------- */
const notePopupVisible = ref(false);

const noteText = ref(
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry..."
);

const popupWidth = ref(420);
const popupHeight = ref(520);

const computePopupSize = () => {
  const w = window.innerWidth;
  const h = window.innerHeight;

  popupWidth.value = Math.min(420, Math.floor(w * 0.9));
  popupHeight.value = Math.min(520, Math.floor(h * 0.7));
};

const closeNotePopup = () => {
  notePopupVisible.value = false;
};

const onResize = () => computePopupSize();

/**
 * ✅ Fix navigation SPA :
 * Au moment où la vue arrive, certains layouts DevExtreme / flex
 * n'ont pas encore recalculé. On force un reflow sur .header.
 */
const fixLayoutAfterNavigation = async () => {
  await nextTick();

  computePopupSize();

  requestAnimationFrame(() => {
    const headerEl = document.querySelector(".header");
    if (headerEl) {
      void headerEl.offsetHeight; // ✅ force reflow local
    } else {
      void document.body.offsetHeight; // fallback
    }
  });
};

onMounted(async () => {
  await nextTick();

  // Slider visible
  control.value.visible = true;

  // Popup : taille + ouverture auto
  computePopupSize();
  notePopupVisible.value = true;

  // Resize listener
  window.addEventListener("resize", onResize);

  // Fix layout
  await fixLayoutAfterNavigation();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", onResize);
});
</script>

<style scoped>
/* ✅ Stabilité dans un parent global en flex (.app) */
.header {
  width: 100%;
  min-width: 0;   /* ✅ évite les bugs de shrink en flex */
  min-height: 100%;
  box-sizing: border-box;

  padding: 18px 22px;
  background: #e7e0ec;

  border-radius: 16px;
  overflow: hidden;
}

/* Bip Commande */
.bip_cmd {
  display: flex;
  align-items: center;
  gap: 18px;
  min-width: 0; /* ✅ stabilité */
}

.scan {
  width: 240px;
}

/* Opérateur */
.operator {
  margin-left: auto;
  font-size: 13px;
}

/* Pill Etape */
.pill_step {
  display: flex;
  border: 1px solid #000;
  border-radius: 18px;
  overflow: hidden;
}

.pill-left,
.pill-right {
  padding: 6px 14px;
  font-size: 13px;
  background: #fff;
}

/* -------------------------
   CADRE INFORMATION
------------------------- */
.main_box {
  width: 100%;
  min-width: 0;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  margin-top: 18px;
  background: #fff;
  border: 2px solid #000;
  border-radius: 10px;
  overflow: hidden;
  height: 30vh;
}

.box-title {
  text-align: center;
  font-size: 12px;
  padding: 6px 10px;
  border-bottom: 2px solid #000;
  flex: 0 0 auto;
}

.title-cell {
  text-align: center;
  font-size: 12px;
  padding-bottom: 6px;
  border-bottom: 1px solid #000;
  margin-bottom: 8px;
}

/* -------------------------
   Commande
------------------------- */
.grid-info-cmd {
  width: 100%;
  min-width: 0;

  display: grid;
  grid-template-columns: 1fr 1.4fr 1fr;
  flex: 1 1 auto;
  min-height: 0;
}

.cell-info-cmd {
  min-width: 0;
  padding: 10px;
  border-right: 2px solid #000;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.col-cell-right {
  border-right: none;
}

.line {
  display: grid;
  grid-template-columns: 130px 1fr;
  column-gap: 8px;
  font-size: 12px;
  min-width: 0;
}

.static_field {
  font-weight: 700;
  white-space: nowrap;
}

.big-empty {
  flex: 1 1 auto;
  min-width: 0;
}

/* -------------------------
   Article
------------------------- */
.grid-info-article {
  width: 100%;
  min-width: 0;

  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr 1fr 1fr;
  flex: 1 1 auto;
  min-height: 0;
}

.cell-info-article {
  min-width: 0;
  border-right: 2px solid #000;
  padding: 10px;
}

.cell-info-article:last-child {
  border-right: none;
}

.inside-input {
  margin-top: 10px;
}

/* Actions bas */
.bottom-actions {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  gap: 14px;
  width: 100%;
}

/* Slider contrôle */
.control-slider {
  position: fixed;
  left: 16px;
  bottom: 16px;
  width: 280px;

  background: #8d1f1f;
  color: #fff;

  border-radius: 8px;
  padding: 12px 12px 10px 12px;

  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
  z-index: 9999;
}

.control-title {
  font-weight: 700;
  font-size: 12px;
  margin-bottom: 6px;
}

.control-row {
  display: flex;
  gap: 6px;
  font-size: 12px;
  margin-bottom: 10px;
}

.control-label {
  opacity: 0.95;
}
.control-value {
  font-weight: 700;
}

/* Animation slider */
.slide-alert-enter-active,
.slide-alert-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.slide-alert-enter-from {
  transform: translateX(-110%);
  opacity: 0;
}

.slide-alert-enter-to {
  transform: translateX(0);
  opacity: 1;
}

.slide-alert-leave-from {
  transform: translateX(0);
  opacity: 1;
}

.slide-alert-leave-to {
  transform: translateX(-110%);
  opacity: 0;
}

/* -------------------------
   POPUP NOTE - Style
------------------------- */
.note-popup-body {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 18px 18px 16px 18px;
  gap: 14px;
}

.note-popup-text {
  font-size: 12px;
  line-height: 1.4;
  font-weight: 600;
  flex: 1 1 auto;
  padding-bottom: 10px;
}

.note-popup-actions {
  display: flex;
  justify-content: flex-start;
}

.note-validate-btn {
  border-radius: 10px;
}

/* DevExtreme inner styles (scoped => deep) */
.note-popup :deep(.dx-popup-content) {
  padding: 0;
}

.note-popup :deep(.dx-overlay-content) {
  border-radius: 18px;
  overflow: hidden;
}

.note-popup :deep(.dx-popup-title) {
  border-bottom: none;
}

.note-popup :deep(.dx-popup-title .dx-closebutton) {
  opacity: 0.8;
}
</style>
