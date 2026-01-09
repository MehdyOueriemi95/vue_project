<!-- npm install jsbarcode -->
<template>
  <div>
    <DxButton text="Retour" type="normal" icon="arrowleft" @click="goBack" />

    <br />
    <br />

    <h2>CODE128</h2>
    <svg ref="barcodeCode128"></svg>

    <br />
    <br />

    <h2>EAN13</h2>
    <svg ref="barcodeEAN13"></svg>

    <br />
    <br />

    <h2>CODE39</h2>
    <svg ref="barcodeCODE39"></svg>

    <br />
    <br />

    <h2>Interleaved 2 of 5 (ITF)</h2>
    <svg ref="barcodeITF"></svg>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { DxButton } from "devextreme-vue";
import JsBarcode from "jsbarcode";

// Références des SVG
const barcodeCode128 = ref<SVGSVGElement | null>(null);
const barcodeEAN13 = ref<SVGSVGElement | null>(null);
const barcodeCODE39 = ref<SVGSVGElement | null>(null);
const barcodeITF = ref<SVGSVGElement | null>(null);

const router = useRouter();
const goBack = () => router.push("/home");

// Génération des codes-barres après le montage
onMounted(() => {
  if (barcodeCode128.value) {
    JsBarcode(barcodeCode128.value, "123456789012", { format: "CODE128" });
  }
  if (barcodeEAN13.value) {
    JsBarcode(barcodeEAN13.value, "123456789012", { format: "EAN13" });
  }
  if (barcodeCODE39.value) {
    JsBarcode(barcodeCODE39.value, "CODE39EX", { format: "CODE39" });
  }
  if (barcodeITF.value) {
    JsBarcode(barcodeITF.value, "12345678", { format: "ITF" });
  }
});
</script>
