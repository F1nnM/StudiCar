<template>
  <!-- this is a kinda instable component at it's a quick-and-dirty solution for a metered display -->
  <div
    class="tester overflow-hidden"
    :style="`width: ${width}; height: calc(${width} / 2)`"
  >
    <div
      class="colored-scale overflow-hidden full-width"
      :style="coloredScaleGradient"
    >
      <div v-if="showLine" class="display-line" :style="lineTransform"></div>
      <div class="circle-shaper full-width full-height text-center q-pb-md">
        <div class="text-anchor flex flex-center q-ma-md vertical-bottom">
          <p class="q-pa-none q-pt-sm text-red-3" v-if="!angle">
            Noch keine Daten
          </p>
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "ColoredMeter",
  components: {},
  model: {
    prop: "angle",
    event: "input"
  },
  props: {
    angle: {
      type: Number,
      required: true
    },
    width: {
      type: String,
      required: true
    },
    minInput: {
      type: Number,
      default: -50
    },
    maxInput: {
      type: Number,
      default: 50
    }
  },
  data() {
    return {
      gradient: this.$store.state.liftDriverRatioGradient,
      angleMin: 1, // smalled rotation value, should be bit outer the left red area
      angleMax: 178 // should be bit outer the righ red area
    };
  },
  computed: {
    coloredScaleGradient() {
      return `background: ${this.gradient.replace("\n", "")} !important;`;
    },

    lineTransform() {
      return `transform: translate(-50%, -50%) rotate(${this.angleToRotate}deg);`;
    },

    angleToRotate() {
      var partOfInputRange =
          (this.angle - this.minInput) / (this.maxInput - this.minInput), // value smaller or equal 1
        angleDiff = this.angleMax - this.angleMin;
      return partOfInputRange * angleDiff + this.angleMin;
    },

    showLine() {
      return (
        this.angle >= this.minInput && this.angle <= this.maxInput && this.angle
      );
    }
  },
  watch: {},
  methods: {
    emit() {
      this.$emit("input", this.angle);
    }
  }
});
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
