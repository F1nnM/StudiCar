<template>
  <div class="q-pa-md">
    <q-btn label="Feuer" @click="go" />
    <q-btn label="Variablenfeuer" @click="open = !open" />
    <QrIcon size="xl" :type="icon" />
    <q-slider v-model="icon" :min="0" :max="6" />

    <p v-for="n in 20" :key="n">Lorem</p>
  </div>
</template>

<script>
import { scroll } from "quasar";
import QrIcon from "components/QrIcon";

import { sendApiRequest, PING } from "../ApiAccess";

export default {
  components: {
    QrIcon
  },
  data() {
    return {
      open: true,
      icon: 4,
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