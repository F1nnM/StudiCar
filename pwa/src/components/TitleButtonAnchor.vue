<template>
  <div class="relative-position q-ma-none q-pa-none">
    <div class="absolute" style="position: top: 0; right: 0; transform: translateY(-200%)">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "TitleButtonAnchor"
};
</script>