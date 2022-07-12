<template>
  <!-- this was my first custom component, it's still there because I don't wanna delete it -->
  <div>
    <div v-for="n in value" :key="n">
      <br />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  value: {
    type: Number,
    required: true,
  },
});
const { value } = toRefs(props);
</script>
