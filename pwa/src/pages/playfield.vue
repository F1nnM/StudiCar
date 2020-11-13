<template>
  <div class="q-pa-md">
    <q-btn label="Feuer" @click="go" />
    <q-btn label="Variablenfeuer" @click="open = !open" />
    <q-item>
      <q-item-section avatar>
        <q-avatar size="100px">
          <TeamPicture />
        </q-avatar>
      </q-item-section>
    </q-item>

    <p v-for="n in 20" :key="n">Lorem</p>
  </div>
</template>

<script>
import { scroll } from "quasar";
import TeamPicture from "components/TeamPicture";

import { sendApiRequest } from "../ApiAccess";

export default {
  components: {
    TeamPicture,
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