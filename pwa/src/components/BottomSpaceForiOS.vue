<template>
  <!-- this component is just a placeholder for iOS devices with their bar at the bottom,
otherwise that would overlay important nav elements -->
  <div>
    <div
      v-touch-hold:1500.mouse="hideBottomSpace"
      v-if="!forceHideBottomSpace"
      class="platform-ios-only platform-android-hide desktop-hide bg-white q-pb-lg"
    />
  </div>
</template>

<script setup>
let forceHideBottomSpace = false;
function hideBottomSpace() {
  forceHideBottomSpace = true;
}
</script>
