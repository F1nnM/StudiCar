<template>
  <div>
    <div v-for="n in value" :key="n">
      <br />
    </div>
  </div>
</template>

<script>
export default {
  name: "BreakN",
  props: {
    value: {
      type: Number,
      required: true,
    },
  },
};
</script>
