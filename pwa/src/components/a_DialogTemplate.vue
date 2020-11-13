<template>
  <q-dialog :value="value" @input="emit">
    <q-card class="bg-white">
      <q-card-section></q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { date } from "quasar";
import ExtHR from "components/ExtendedHr";

export default {
  name: "a_DialogTemplate",
  components: {},
  props: {
    value: Boolean,
  },
  data() {
    return {};
  },
  watch: {
    open: function (val) {},
  },
  computed: {},
  methods: {
    emit(val) {
      this.$emit("input", val);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>