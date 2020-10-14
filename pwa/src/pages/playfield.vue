<template>
  <div class="q-pa-md">
    <q-btn label="Feuer" @click="go()" />
    <ColoredMeter v-model="test" width="50vw" :minInput="0" :maxInput="50">
      <q-item>
        <q-item-section class="text-h5">{{ test }}</q-item-section>
        <q-item-section avatar>
          <q-icon name="directions_car" size="md" />
        </q-item-section>
      </q-item>
    </ColoredMeter>
    <p v-for="n in 20" :key="n">Lorem</p>
  </div>
</template>

<script>
import { scroll } from "quasar";
import ColoredMeter from "components/ColoredMeter";
import { sendApiRequest } from "../ApiAccess";

export default {
  components: {
    ColoredMeter,
  },
  data() {
    return {
      test: 30,
    };
  },
  computed: {},
  methods: {
    go() {
      sendApiRequest(
        GET_NEWSTICKER,
        {},
        (data) => {
          this.newsticker = data;
        },
        (err) => {
          this.newsticker = "Fehler aufgetreten";
        }
      );
    },
  },

  mounted() {
    this.$store.commit("setPage", "Spielwiese");
  },
};
</script>

<style lang="scss" scoped>
</style>