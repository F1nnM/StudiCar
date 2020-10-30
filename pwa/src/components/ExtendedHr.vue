<template>
  <div>
    <div :class="classAttr" :style="style"></div>
  </div>
</template>

<script>
export default {
  name: "ExtendedHr",
  computed: {
    classAttr() {
      var text = "to-hr to-hr-" + this.size;
      if (!this.hex) text += " bg-" + this.color;
      return text;
    },
    style() {
      var style = "";
      if (this.borderRadius) style += "; border-radius: " + this.borderRadius;
      if (this.hex) style += "; background-color: " + this.color;
      return style;
    },
  },
  props: {
    color: {
      required: true,
      type: String,
    },
    size: {
      required: true,
      type: String,
    },
    borderRadius: String,
    hex: Boolean,
  },
};
</script>

<style lang="scss" scoped>
.to-hr {
  position: relative;
  overflow: hidden;
  height: 1px;

  &.to-hr-xs {
    height: 1px;
    &:after {
      top: 1px;
    }
  }
  &.to-hr-sm {
    height: 2px;
    &:after {
      top: 2px;
    }
  }
  &.to-hr-md {
    height: 4px;
    &:after {
      top: 4px;
    }
  }
  &.to-hr-lg {
    height: 8px;
    &:after {
      top: 8px;
    }
  }
  &.to-hr-xl {
    height: 16px;
    &:after {
      top: 16px;
    }
  }

  &:after {
    top: 1px;
    content: "";
    position: absolute;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: white;
  }
}
</style>