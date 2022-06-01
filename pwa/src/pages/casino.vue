<template>
  <div class="q-pa-md">
    <q-btn @click="call" label="Request" />
    <div>
      <span class="text-negative q-mr-xs" v-if="err">Fehler:</span>
      <q-table
        title="Rückgabe"
        :dense="result.length > 10"
        :data="result"
        :columns="columns"
        row-key="name"
      ></q-table>
    </div>
  </div>
</template>

<script setup>
import * as api from '../ApiAccess';

let result = [];
let err = null;
let columns = [
  {
    name: 'key',
    align: 'center',
    label: 'Variable',
    field: 'key',
    sortable: true,
  },
  { name: 'value', label: 'Wert', field: 'value', sortable: true },
];

function call() {
  result = [];
  err = false; // simple reset
  api.sendApiRequest(
    api.TEST_API,
    {},
    (data) => {
      result = Object.entries(data).map(([key, value]) => ({
        key,
        value,
      }));
      // taken from https://stackoverflow.com/questions/36411566/how-to-transpose-a-javascript-object-into-a-key-value-array
    },
    (err) => {
      result = Object.entries(data).map(([key, value]) => ({
        key,
        value,
      }));
      err = true;
    }
  );
}

const appStore = useAppStore();
onMounted(() => {
  appStore.setPage('Spielhölle');
});
</script>
