<template>
  <div>
    <q-item dense>
      <q-item-section avatar>
        <q-icon name="home" size="sm" />
      </q-item-section>
      <q-item-section :style="borderLeft">
        <q-item-label>{{ formatAsTime(start.time) }}</q-item-label>
      </q-item-section>
    </q-item>
    <q-expansion-item dense v-model="value" @input="emit()">
      <slot></slot>
    </q-expansion-item>
  </div>
</template>

<script>
import { date } from "quasar";

export default {
  name: "ExpansionTimeline",
  props: {
    value: Boolean,
    start: Object,
    end: Object,
    color: String,
  },
  methods: {
    emit() {
      this.$emit("input", this.value);
    },

    formatAsTime(time) {
      return date.formatDate(new Date(time), "H:mm");
    },
  },
  computed: {
    borderLeft() {
      return (
        "padding-left: 7px; border-left: 1px solid " + (this.color || "black")
      );
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
</style>