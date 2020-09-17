<template>
  <div class="q-pa-md">
    <q-btn label="Feuer" @click="go()" />
    <p v-for="n in 20" :key="n">Lorem</p>
  </div>
</template>

<script>
import { scroll } from "quasar";
import { sendApiRequest } from "../ApiAccess";

export default {
  components: {},
  data() {
    return {};
  },
  computed: {},
  methods: {
    go() {
      sendApiRequest(
        GET_NEWSTICKER,
        {},
        (data) => {
          this.newsticker = data;
        },
        (err) => {
          this.newsticker = "Fehler aufgetreten";
        }
      );
    },
  },

  mounted() {
    this.$store.commit("setPage", "Spielwiese");
  },
};
</script>

<style lang="scss" scoped>
</style>