<template>
  <div class="ping-block">
    <h3>Ping backend <span v-if="pingLoading" class="ping-status">- Appel en cours...</span></h3>
    <div class="ping-buttons">
      <button type="button" @click="callPing" class="ping-button">
        Tester /ping
      </button>
      <button type="button" @click="toggleInterval" class="ping-button">
        {{ interval ? 'Arrêter' : 'Démarrer' }}
      </button>
      <div class="result-block">Résultat: {{ computedResult }}</div>
    </div>

    <div v-if="pingError" class="ping-error">
      Erreur: {{ pingError }}
    </div>
    <!--
      <pre v-if="pingData" class="ping-data">
{{ JSON.stringify(pingData, null, 2) }}
    </pre> -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ping } from '@sdk';

const pingData = ref(null);
const pingLoading = ref(false);
const pingError = ref(null);

const interval = ref(null);

const computedResult = computed(() => {
  let result = '';
  if (pingData.value?.Timestamp) {
    const data = new Date(pingData.value?.Timestamp);
    const date = data.toLocaleDateString();
    const time = data.toLocaleTimeString();
    result = `${date} ${time} (${data.toLocaleString()})`;
    if (pingData.value?.Message) {
      result += ` - ${pingData.value?.Message}`;
    }
  } else if (pingError.value) {
    result = `Erreur: ${pingError.value}`;
  } else {
    result = 'Aucun résultat';
  }

  return result;
});

const toggleInterval = () => {
  if (interval.value || pingError.value) {
    clearInterval(interval.value);
    interval.value = null;
  } else {
    interval.value = setInterval(callPing, 1000);
  }
};


const callPing = async (): Promise<any> => {
  pingLoading.value = true;
  try {
    const response = await ping();
    pingData.value = response.data;
  } catch (error) {
    pingError.value = error.message;
  } finally {
    pingLoading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.ping-buttons {
  display: flex;
  flex-direction: row;
  gap: 10px;
}
.ping-block {
  margin: 24px 0;
  padding: 16px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.02);
}

.ping-button {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  background-color: var(--dx-color-primary, #2196f3);
  color: #fff;
  font-weight: 500;
}

.ping-status {
  margin-top: 8px;
}

.ping-error {
  margin-top: 8px;
  color: #c62828;
}

.ping-data {
  margin-top: 8px;
  padding: 8px;
  border-radius: 4px;
  background: #111827;
  color: #e5e7eb;
  font-size: 12px;
  overflow-x: auto;
}
</style>
