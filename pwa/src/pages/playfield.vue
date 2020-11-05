<template>
  <div class="q-pa-md">
    <q-btn label="Feuer" @click="go" />
    <q-btn label="Variablenfeuer" @click="open = !open" />
    <DialogTemplate v-model="open" :lift="{}" />
    <p v-for="n in 20" :key="n">Lorem</p>
  </div>
</template>

<script>
import { scroll } from "quasar";
import DialogTemplate from "components/DialogTemplate";

import { sendApiRequest } from "../ApiAccess";

export default {
  components: {
    DialogTemplate,
  },
  data() {
    return {
      open: true,
      value: "one",
    };
  },
  computed: {},
  methods: {
    go() {
      alert("fired");
    },
  },

  mounted() {
    this.$store.commit("setPage", "Spielwiese");
  },
};
</script>

<style lang="scss" scoped>
</style>