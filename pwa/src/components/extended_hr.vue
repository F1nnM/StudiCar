<template>
  <div>
    <div
      :class="'to-hr bg-' + color + ' to-hr-' + size"
      :style="borderRadius ? 'border-radius: ' + borderRadius : ''"
    ></div>
  </div>
</template>

<script>
export default {
    name: 'extended_hr',
    props: {
        color:{	
            required: true,
            type: String
        },
        size: {
            required: true,
            type: String
        },
        borderRadius: {
            type: String
        }
    }
}
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