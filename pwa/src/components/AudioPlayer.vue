<template>
  <div>
    <audio ref="audioRef">
      <source :src="src" type="audio/ogg" />
    </audio>
    <div v-if="loadingError" class="text-red">Ein Fehler ist aufgetreten</div>
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
            <q-slider v-model="progress" :step="1 / 3600" :min="0" :max="1" />
          </q-item-label>
          <q-item-label>
            <span>{{ progressLabel }}</span>
          </q-item-label>
        </q-item-section>
      </q-item>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  src: {
    type: String,
    required: true,
  },
});
const { src } = toRefs(props);

let paused = true;
let loadingError = false;
let audio = null;
let metaLoaded = false;
let current = 0;
let duration = 0.1;

const audioRef = ref(null);

const progressLabel = computed(() => {
  var current;
  if (current > 0) {
    current = current;
  } else {
    current = duration;
  }
  var d = new Date();
  d.setHours(0, 0, current);
  return date.formatDate(d, 'm:ss');

  // (src.length / 1000).toFixed(1) + " KB";
});

const audioReady = computed(() => {
  return audio && metaLoaded;
});

function togglePlayPause() {
  var a = audioRef.value.audio;
  if (a.paused) a.play();
  else a.pause();
  paused = !paused;
}

function ended() {
  paused = true;
}

function update() {
  var a = audioRef.value.audio;
  if (a) {
    current = a.currentTime;
    duration = a.duration;
  }
}

onMounted(() => {
  var a = audioRef.value.audio;
  audio = a;
  a.onended = () => ended();
  a.onerror = () => (error = true);
  a.ontimeupdate = () => update();
  a.currentTime = 10000;
  a.load();
  duration = a.duration;
  a.currentTime = 0;
  a.onloadedmetadata = () =>
    setTimeout(() => {
      metaLoaded = true;
    }, 200);
});

const progress = computed({
  get() {
    return current / duration;
  },
  set(val) {
    if (audioReady) {
      var newPos = Math.floor(val * duration);
      // audio.currentTime = newPos != Infinity ? newPos : 1;
    }
  },
});
</script>
