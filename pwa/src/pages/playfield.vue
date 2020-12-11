<template>
  <div class="q-pa-md">
    <q-btn label="Feuer" @click="go" />
    <q-btn label="Variablenfeuer" @click="open = !open" />

    <p v-for="n in 20" :key="n">Lorem</p>
  </div>
</template>

<script>
import { scroll } from "quasar";
/* import ExpansionLiftTimeline from "components/ExpansionLiftTimeline"; */

import { sendApiRequest, PING } from "../ApiAccess";

export default {
  components: {},
  data() {
    return {
      open: true,
      value: "one"
    };
  },
  computed: {},
  methods: {
    go() {}
  },

  mounted() {
    this.$store.commit("setPage", "Spielwiese");
  }
};
</script>

<style lang="scss" scoped>
</style>