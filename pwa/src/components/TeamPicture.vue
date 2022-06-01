<template>
  <!-- was made to control styling and sizing of the team images properly -->
  <q-img :contain="!headFocused" :class="comClass" :src="imageData" />
</template>

<script setup>
defineProps({
  headFocused: Boolean,
  imageData: String,
  cutBackground: Boolean,
});
const comClass = computed(() => {
  var c = '';
  if (headFocused) c += ' head-focused';
  else c += ' body-focused';
  if (cutBackground) c += ' cut';
  return c;
});
</script>

<style lang="scss" scoped>
.head-focused {
  transform: scale(2);
  transform-origin: center 8%;
  animation: all 0.2s ease-out;
}

.body-focused {
  transform: scale(0.8);
  border-radius: 10px;
  transform-origin: center top;
}

.cut {
  clip-path: inset(0 29% 52% 27%);
}
</style>
