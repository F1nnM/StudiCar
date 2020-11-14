<template>
  <div class="q-pa-md">
    <q-btn label="Feuer" @click="go" />
    <q-btn label="Variablenfeuer" @click="open = !open" />
    <ExpansionLiftTimeline
      color="dark"
      :entries="[{
      title: 'Test',
      subtitle: 'Subtitle',
      text: 'dw',
      icon: 'school'
    },
    {
      title: 'Test',
      subtitle: 'Subtitle',
      text: 'dw',
      icon: 'school'
    },
    {
      title: 'Test',
      subtitle: 'Subtitle',
      text: 'dw',
      icon: 'home'
    }]"
    >
      <!-- <template v-slot:header>Test</template>
      <template v-slot:content>Test</template>
      <template v-slot:footer>Test</template>-->
    </ExpansionLiftTimeline>

    <p v-for="n in 20" :key="n">Lorem</p>
  </div>
</template>

<script>
import { scroll } from "quasar";
import ExpansionLiftTimeline from "components/ExpansionLiftTimeline";

import { sendApiRequest } from "../ApiAccess";

export default {
  components: {
    ExpansionLiftTimeline,
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