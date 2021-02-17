<template>
  <div class="q-pa-md">
    <q-resize-observer :debounce="0"></q-resize-observer>
    <q-scroll-observer @scroll="scrollHandler" />
    <q-toolbar class="text-primary">
      <q-btn flat round dense icon="menu" />
      <q-toolbar-title>Toolbar</q-toolbar-title>
      <q-btn flat round dense icon="more_vert" />
    </q-toolbar>
    <q-input rounded outlined v-model="text" label="Rounded outlined" />
    <q-input clearable filled color="blue-grey-9" v-model="text" label="Label" />

    <q-circular-progress indeterminate size="50px" color="lime" class="q-ma-md" />

    <q-rating v-model="ratingModel" size="2em" :max="10" color="primary" />

    <p v-for="n in 30" :key="n">Lorem</p>

    <p v-for="m in 30" :key="m">Lorem</p>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {};
  },

  data() {
    return {
      ratingModel: 3
    };
  },

  computed: {},

  methods: {},

  mounted() {
    this.$store.commit("setPage", "Spielplatz");
  }
};
</script>