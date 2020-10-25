<template>
  <div class="q-pa-md">
    <q-btn label="Feuer" @click="go()" />
    <AudioPlayer :src="src" />
    <p v-for="n in 20" :key="n">Lorem</p>
  </div>
</template>

<script>
import { scroll } from "quasar";
import AudioPlayer from "components/AudioPlayer";
import { sendApiRequest } from "../ApiAccess";

export default {
  components: {
    AudioPlayer,
  },
  data() {
    return {
      src: this.$store.getters["auth/user"].chatLifts[1].messages[2].content,
    };
  },
  computed: {},
  methods: {},

  mounted() {
    this.$store.commit("setPage", "Spielwiese");
  },
};
</script>

<style lang="scss" scoped>
</style>