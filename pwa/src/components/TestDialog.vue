<template>
  <div>
    <div class="q-ma-none q-pa-none">
      <!-- <span v-if="isLayoutOpen"></span> -->
      <q-dialog
        :model-value="open"
        persistent
        maximized
        @update:model-value="emit"
        transition-show="slide-up"
        transition-hide="slide-down"
      >
        <q-layout view="hHh lpR fFr" class="bg-white q-pa-none">
          <q-header reveal elevated class="bg-primary text-white"> </q-header>
          <q-btn v-close-popup></q-btn>
          <q-btn @click="emitCustom"></q-btn>
        </q-layout>
      </q-dialog>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "TestDialog",
  components: {},
  props: {
    open: Boolean,
  },
  emits: ["customEvent"],
  data() {
    return {};
  },
  watch: {},
  computed: {},
  methods: {
    hello() {
      alert("Heyho");
    },
    emitCustom() {
      this.$emit("customEvent", true);
    },
    emit(value) {
      this.$emit("update:model-value", value);
    },
  },
});
</script>

<style lang="scss" scoped></style>
