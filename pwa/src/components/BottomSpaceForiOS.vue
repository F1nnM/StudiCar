<template>
  <div>
    <div
      v-touch-hold:1500.mouse="hideBottomSpace"
      v-if="!forceHideBottomSpace"
      class="platform-ios-only platform-android-hide desktop-hide bg-white q-pb-lg"
    />
  </div>
</template>

<script>
export default {
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
};
</script>
