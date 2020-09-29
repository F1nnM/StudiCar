<template v-show="open">
  <div>
    <div class="q-ma-md">
      <q-dialog
        v-model="open"
        persistent
        maximized
        transition-show="jump-up"
        transition-hide="slide-up"
        @input="emitAndClose()"
      >
        <div class="flex flex-center bg-white">
          <div class="loading-header text-center full-width">
            <p class="text-h4">
              <span class="text-primary">Studi</span>Car
            </p>
            <p class="text-subtitle1">Green. Cheap. Social.</p>
            <ExtendedHR color="primary" size="xs" />
          </div>

          <q-slide-transition>
            <div v-if="open" class="full-width q-px-xl text-center">
              <p class>{{ loadingText }}</p>

              <q-linear-progress indeterminate rounded color="primary" class="q-mt-sm" />
            </div>
          </q-slide-transition>

          <div class="fixed-bottom overflow-hidden-y q-mb-lg q-mx-lg text-center">
            <div class="branding-rise">
              Mit freundlicher Unterstützung des
              ADAC e.V.
            </div>
          </div>
        </div>
      </q-dialog>
    </div>
  </div>
</template>

<script>
import ExtendedHR from "components/ExtendedHr";
import { sendApiRequest } from "../ApiAccess";

export default {
  name: "GetUserDataLoading.vue",
  components: {
    ExtendedHR,
  },
  data() {
    return {
      loadingTexts: [
        "Bitte hab noch einen Moment Geduld",
        "Daten werden geladen",
      ],
    };
  },
  model: {
    prop: "open",
    event: "input",
  },
  props: {
    open: Boolean,
  },
  computed: {
    loadingText() {
      const pos = 1;

      return this.loadingTexts[pos];
    },
  },

  mounted() {},

  methods: {},
};
</script>

<style scoped lang="scss">
</style>