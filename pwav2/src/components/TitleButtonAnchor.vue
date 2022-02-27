<template>
  <!-- this component is an anchor to make displaying content next to a page title possible -->
  <div class="relative-position q-ma-none q-pa-none">
    <div
      class="absolute"
      style="top: 0; right: 0; transform: translateY(-200%)"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "TitleButtonAnchor"
});
</script>
