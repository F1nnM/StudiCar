<template>
  <div>
    <audio ref="audio">
      <source :src="src" type="audio/ogg" />
    </audio>
    <div v-if="isError" class="text-red">Ein Fehler ist aufgetreten</div>
    <div v-else>
      <q-item dense class="q-px-none">
        <q-item-section avatar>
          <q-btn
            flat
            dense
            @click="togglePlayPause()"
            :icon="paused ? 'play_arrow' : 'pause'"
            size="lg"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <q-slider v-model="progress" :step="1/3600" :min="0" :max="1" />
          </q-item-label>
          <q-item-label>
            <span>{{ progressLabel }}</span>
          </q-item-label>
        </q-item-section>
      </q-item>
    </div>
  </div>
</template>


<script>
import ExtHr from "components/ExtendedHr";

import { date } from "quasar";

export default {
  name: "AudioPlayer",
  components: {},
  data() {
    return {
      paused: true,
      loadingError: false,
      audio: null,
      metaLoaded: false,
      current: 0,
      duration: 0.1, // not to divide by zero
    };
  },
  // model: {
  //   prop: "src",
  //   event: "input",
  // },
  props: {
    src: {
      type: String,
      required: true,
    },
  },
  computed: {
    progress: {
      get() {
        return this.current / this.duration;
      },
      set(val) {
        if (this.audioReady) {
          var newPos = Math.floor(val * this.duration);
          this.audio.currentTime = newPos != Infinity ? newPos : 1;
        }
      },
    },

    progressLabel() {
      var current;
      if (this.current > 0) {
        current = this.current;
      } else {
        current = this.duration;
      }
      var d = new Date();
      d.setHours(0, 0, current);
      return date.formatDate(d, "m:ss");

      // (this.src.length / 1000).toFixed(1) + " KB";
    },

    audioReady() {
      return this.audio && this.metaLoaded;
    },

    isError() {
      return this.loadingError;
    },
  },
  methods: {
    togglePlayPause() {
      var a = this.$refs.audio;
      if (a.paused) a.play();
      else a.pause();
      this.paused = !this.paused;
    },

    ended() {
      this.paused = true;
    },

    update() {
      var a = this.$refs.audio;
      if (a) {
        this.current = a.currentTime;
        this.duration = a.duration;
      }
    },
  },

  mounted() {
    var a = this.$refs.audio;
    this.audio = a;
    a.onended = (_) => this.ended();
    a.onerror = (_) => (this.error = true);
    a.ontimeupdate = (_) => this.update();
    a.currentTime = 10000;
    a.load();
    this.duration = a.duration;
    a.currentTime = 0;
    a.onloadedmetadata = (_) =>
      setTimeout((_) => {
        this.metaLoaded = true;
      }, 200);
  },
};
</script>