<template>
  <div class="q-pa-md">
    <q-btn label="Feuer" @click="go()" />
    <ExpansionTimeline v-model="open" :start="{time: new Date()}" :end="{time: new Date()}">haha</ExpansionTimeline>
    <p v-for="n in 20" :key="n">Lorem</p>
  </div>
</template>

<script>
import { scroll } from "quasar";
import ExpansionTimeline from "components/ExpansionTimeline";
import { sendApiRequest } from "../ApiAccess";

export default {
  components: {
    ExpansionTimeline,
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
      sendApiRequest(
        {
          path: "https://www.ecosia.org/images?q=test",
          method: "POST",
        },
        {},
        (data) => {},
        (err) => {}
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