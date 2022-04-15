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

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "BottomSpaceForiOS",
  data() {
    return {
      forceHideBottomSpace: false
    };
  },

  methods: {
    hideBottomSpace() {
      this.forceHideBottomSpace = true;
    }
  }
});
</script>
