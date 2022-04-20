<template>
  <!-- this was my first custom component, it's still there because I don't wanna delete it -->
  <div>
    <div v-for="n in value" :key="n">
      <br />
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "BreakN",
  props: {
    value: {
      type: Number,
      required: true
    }
  }
});
</script>
