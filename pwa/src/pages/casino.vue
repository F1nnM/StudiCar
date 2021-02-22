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

<script>
import { scroll } from "quasar";
import * as api from "../ApiAccess";

export default {
  components: {},
  data() {
    return {
      result: [],
      err: null,
      columns: [
        {
          name: "key",
          align: "center",
          label: "Variable",
          field: "key",
          sortable: true
        },
        { name: "value", label: "Wert", field: "value", sortable: true }
      ]
    };
  },
  computed: {},
  methods: {
    call() {
      this.result = [];
      this.err = false; // simple reset
      api.sendApiRequest(
        api.TEST_API,
        {},
        data => {
          this.result = Object.entries(data).map(([key, value]) => ({
            key,
            value
          }));
          // taken from https://stackoverflow.com/questions/36411566/how-to-transpose-a-javascript-object-into-a-key-value-array
        },
        err => {
          this.result = Object.entries(data).map(([key, value]) => ({
            key,
            value
          }));
          this.err = true;
        }
      );
    }
  },

  mounted() {
    this.$store.commit("setPage", "Spielhölle");
  }
};
</script>