<template>
  <!-- very important component for UX, as user should be able to see what important buttons do before clicking on them -->
  <q-tooltip
    anchor="top middle"
    content-class="rounded-borders transparent no-margin no-padding"
    self="bottom middle"
    :offset="[10, 10]"
  >
    <div
      :class="`q-pa-sm tooltip-styling ${
        transparent || rgba ? 'tooltip-transparent' : ''
      } 
      rounded-borders text-dark ${dark ? 'dark-mode' : ''}`"
    >
      <slot></slot>
    </div>
  </q-tooltip>
</template>

<script setup>
const props = defineProps({
  transparent: Boolean,
  rgba: Boolean,
  dark: Boolean,
});
const { transparent, rgba, dark } = toRefs(props);
</script>

<style lang="scss" scoped>
q.tooltip {
  padding: 10px;
}

.tooltip-styling {
  margin: 1px;
  border-top: 1px solid $primary;
  background: rgb(255, 255, 255);

  &.tooltip-transparent {
    // applies only when transparent property is set
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 1) 75%,
      rgba(255, 255, 255, 0) 100%
    );
  }

  &:not(.tooltip-transparent) {
    // applies only when transparent property is not set

    border-bottom: 1px solid $primary;
    background: linear-gradient(
      86deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 1) 2%,
      rgba(255, 255, 255, 1) 98%,
      rgba(255, 255, 255, 0) 100%
    );
  }

  &.dark-mode {
    color: white;
    background: black;
  }
}
</style>
