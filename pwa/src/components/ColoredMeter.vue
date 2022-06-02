<template>
  <!-- this is a kinda instable component at it's a quick-and-dirty solution for a metered display -->
  <div
    class="tester overflow-hidden"
    :style="`width: ${width}; height: calc(${width} / 2)`"
  >
    <div class="colored-scale overflow-hidden full-width">
      <div v-if="showLine" class="display-line" :style="lineTransform"></div>
      <div class="circle-shaper full-width full-height text-center q-pb-md">
        <div class="text-anchor flex flex-center q-ma-md vertical-bottom">
          <p class="q-pa-none q-pt-sm text-red-3" v-if="!value">
            Noch keine Daten
          </p>
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  value: {
    type: Number,
    required: true,
  },
  width: {
    type: String,
    required: true,
  },
  minInput: {
    type: Number,
    default: -50,
  },
  maxInput: {
    type: Number,
    default: 50,
  },
});
const { value, width, minInput, maxInput } = toRefs(props);

let angleMin = 1; // smalled rotation value, should be bit outer the left red area
let angleMax = 178; // should be bit outer the righ red area

const lineTransform = computed(() => {
  let partOfInputRange = (value - minInput) / (maxInput - minInput), // value smaller or equal 1
    angleDiff = angleMax - angleMin;
  let angleForCss = partOfInputRange * angleDiff + angleMin;
  return `transform: translate(-50%, -50%) rotate(${angleForCss}deg);`;
});

const showLine = computed(() => {
  return value >= minInput && value <= maxInput && value;
});

function emit() {
  $emit('input', value);
}
</script>

<style lang="scss" scoped>
.tester {
  position: relative;
  overflow-y: hidden;
}

.colored-scale {
  position: absolute;
  top: 0;
  left: 0;
  height: 200%;
  border-top-left-radius: 50%;
  border-top-right-radius: 50%;
  background: linear-gradient(
    90deg,
    rgba(255, 0, 0, 1) 0%,
    rgba(236, 255, 0, 1) 8%,
    rgba(0, 255, 0, 1) 21%,
    rgba(81, 255, 0, 1) 41%,
    rgba(236, 255, 0, 1) 66%,
    rgba(255, 0, 0, 1) 100%
  ) !important;
}

.display-line {
  position: absolute;
  // display: block;
  background: transparent;
  background: linear-gradient(270deg, transparent 93%, rgba(0, 0, 0, 1) 93%);
  bottom: 50%;
  z-index: 9000;
  left: 50%;
  transform-origin: center bottom;
  width: 100%;
  height: 3px;
}

.circle-shaper {
  background: white;
  clip-path: circle(48% at 50% 51%);
  position: relative;

  .text-anchor {
    margin: 0;
    z-index: 9999;
    position: absolute;
    bottom: 50%;
    left: 50%;
    transform: translateX(-50%);
    background: white;
    height: 40%;
    width: 70%;
    overflow: hidden;
  }
}
</style>
