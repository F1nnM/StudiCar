<template>
  <div class="q-pa-md">
    <q-btn label="Feuer" @click="go()" />
    <TextPagination
      v-model="value"
      :options="[{
      val: 'one'
    },{
      val: 'two'
    },
    {
      val: 'Sa'
    },{
      val: 'So'
    },
    {
      val: 'Mo'
    },{
      val: 'Di'
    }]"
    />
    <p v-for="n in 20" :key="n">Lorem</p>
  </div>
</template>

<script>
import { scroll } from "quasar";
import TextPagination from "components/TextPagination";

export default {
  components: {
    TextPagination,
  },
  data() {
    return {
      value: "one",
    };
  },
  computed: {},
  methods: {},

  mounted() {
    this.$store.commit("setPage", "Spielwiese");
  },
};
</script>

<style lang="scss" scoped>
</style>