<template>
  <q-dialog :value="value" @input="emit">
    <q-card class="bg-white">
      <q-card-section></q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
const props = defineProps({
  value: Boolean,
});
const { value } = toRefs(props);

function emit(val) {
  $emit('input', val);
}
</script>

<style lang="scss" scoped></style>
