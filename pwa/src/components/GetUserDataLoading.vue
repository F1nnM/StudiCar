<template v-show="open">
  <!-- this component is the splashscreen in StudiCar -->
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
            <p class="text-h4"><span class="text-primary">Studi</span>Car</p>
            <p class="text-subtitle1 primary-underline">
              Green. Cheap. Social.
            </p>
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
            <q-tab-panels
              :value="open || showBranding"
              animated
              transition-show="jump-up"
            >
              <q-tab-panel :name="true" class="text-grey-7">
                Mit freundlicher Unterstützung des ADAC e.V.
              </q-tab-panel>
            </q-tab-panels>
          </div>
        </div>
      </q-dialog>
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  open: Boolean,
});

let loadingTexts = [
  'Bitte hab noch einen Moment Geduld',
  'Daten werden geladen',
];
let showBranding = false;
let reverse = false;

const loadingText = computed(() => {
  const pos = 1;

  return loadingTexts[pos];
});

const open = ref(props.open);
watch(open, (isOpen) => {
  if (isOpen) {
    setTimeout((_) => {
      showBranding = true;
    }, 500);
  }
});
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
