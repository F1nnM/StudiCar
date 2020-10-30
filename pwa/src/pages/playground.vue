<template>
  <div class="q-pa-md">
    <q-resize-observer :debounce="0"></q-resize-observer>
    <q-scroll-observer @scroll="scrollHandler" />

    <p v-for="n in 30" :key="n">Lorem</p>

    <q-slider v-model="splitterModel" :min="0" :max="100" />

    <div class="row">
      <q-img
        class="col-3"
        :src="imageUrl"
        responsive
        id="example"
        :style="'transition: .2s; filter: grayscale(' + scrollGrayscale + '%)'"
      />
      <div class="col-9">Lorem</div>
    </div>

    <p v-for="m in 30" :key="m">Lorem</p>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      height: 200,
      splitterModel: 50,
      splitter: 50,
      grayscale: 100,
      imageUrl: "https://cdn.quasar.dev/img/parallax1.jpg",
      topIn: 0,
      bottom: 0,
      heightEl: 0,
      scrollGrayscale: 0,
    };
  },

  computed: {
    splitterStyle() {
      return {
        width: "600px", //Math.min(1000, 0.66 * this.height) + 'px',
        height: this.height + "px",
      };
    },
  },

  methods: {
    scrollHandlerSplitter(e) {
      let distance = document.getElementById("photos").getBoundingClientRect();
      let heightEl = distance.bottom - distance.top;
      let topIn = distance.top > 0;
      let bottomIn = distance.bottom < window.innerHeight;
      let top = distance.top;
      let bottom = distance.bottom;

      if (topIn && bottomIn) {
        // stay
      } else if (topIn && !bottomIn) {
        this.splitterModel = bottom + heightEl;
      } else if (bottomIn && !topIn) {
        this.splitterModel = top + heightEl;
      }
    },

    scrollHandler(e) {
      var trigger = 200;

      let distance = document.getElementById("example").getBoundingClientRect();
      let topIn = distance.top > trigger;
      let bottomIn = distance.bottom < window.innerHeight - trigger;
      if (topIn && bottomIn) {
        this.scrollGrayscale = 0;
      } else {
        this.scrollGrayscale = 100;
      }
    },

    onResize({ height }) {
      this.height = height;
      this.splitter = "" + splitterModel;
    },
  },

  mounted() {
    this.$store.commit("setPage", "Spielplatz");
  },
};
</script>