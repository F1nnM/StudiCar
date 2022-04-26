<template>
  <q-dialog :model-value="modelValue" @update:model-value="emit">
    <q-card class="bg-white">
      <q-card-section></q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "a_DialogTemplate",
  components: {},
  props: {
    modelValue: Boolean,
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
      this.$emit("update:model-value", val);
    },
  },
});
</script>

<style lang="scss" scoped></style>
