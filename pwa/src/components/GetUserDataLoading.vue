<template v-show="open">
  <div>
    <div class="q-pa-md">
      <q-dialog
        :value="open"
        persistent
        maximized
        transition-show="jump-up"
        transition-hide="slide-up"
      >
        <div class="flex flex-center bg-white">
          <div class="text-center full-width">
            <p class="text-h4">
              <span class="text-primary">Studi</span>Car
            </p>
            <p class="text-subtitle1 primary-underline">Green. Cheap. Social.</p>
          </div>
          <div>
            <q-linear-progress
              style="width: 28vw"
              :reverse="reverse"
              track-color="white"
              :indeterminate="open"
              :value="100"
              rounded
              color="primary"
              class="q-mt-sm"
            />
          </div>

          <div class="fixed-bottom overflow-hidden-y text-center">
            <q-tab-panels :value="open || showBranding" animated transition-show="jump-up">
              <q-tab-panel :name="true" class="text-grey-7">
                Mit freundlicher Unterstützung des
                ADAC e.V.
              </q-tab-panel>
            </q-tab-panels>
          </div>
        </div>
      </q-dialog>
    </div>
  </div>
</template>

<script>
import ExtendedHr from "components/ExtendedHr";
import { sendApiRequest } from "../ApiAccess";

export default {
  name: "GetUserDataLoading.vue",
  components: {},
  data() {
    return {
      loadingTexts: [
        "Bitte hab noch einen Moment Geduld",
        "Daten werden geladen"
      ],
      showBranding: false,
      reverse: false
    };
  },
  model: {
    prop: "open",
    event: "input"
  },
  watch: {
    open: function(isOpen) {
      if (isOpen) {
        setTimeout(_ => {
          this.showBranding = true;
        }, 500);
      }
    }
  },
  props: {
    open: Boolean
  },
  computed: {
    loadingText() {
      const pos = 1;

      return this.loadingTexts[pos];
    }
  },
  methods: {
    async adac() {
      return new Promise(res => setTimeout(res, 1000));
    }
  },

  mounted() {
    /* setInterval(_ => {
      this.reverse = !this.reverse;
    }, 1800); */
  }
};
</script>

<style scoped lang="scss">
.q-linear-progress__model--indeterminate {
  // just experimental, doesn't work so far
  &::before,
  &::after {
    -webkit-animation: q-linear-progress--indeterminate 1.1s
      cubic-bezier(1, -0.07, 1, 1) infinite !important;
    animation: q-linear-progress--indeterminate 1.1s
      cubic-bezier(1, -0.07, 1, 1) infinite !important;
  }
}
</style>