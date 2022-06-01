<template>
  <!-- this component slides up from the bottom and lets you scan the public link of the given lift -->
  <q-dialog
    transition-show="scale"
    transition-hide="slide-down"
    :value="value"
    @input="emit"
    position="bottom"
  >
    <q-card class="bg-white q-px-md q-mx-md text-center" style="width: 80vw">
      <q-card-section>
        <div class="overflow-hidden row justify-end">
          <div class="relative-position text-center studicar-code show">
            <VueQrcode
              :width="200"
              :color="{
                dark: '#000000',
                light: '#FFFFFF',
              }"
              errorCorrectionLevel="H"
              :value="input"
            />
            <q-img
              src="~assets/app-icon_from_web_filled.png"
              class="absolute-center qrcode-image"
            />
          </div>
          <div class="q-pl-sm column justify-start">
            <div class="q-my-md">
              <q-btn icon="share" size="md" color="dark" dense flat disable />
            </div>
            <!-- <div>
                        <q-btn icon="fullscreen" size="md" color="dark" dense flat />
            </div>-->
          </div>
        </div>
        <ExtHr color="primary" size="xs" />
        <p class="text-grey-7 q-pt-sm q-mb-none text-center">
          Teile deine Mitfahrgelegenheit über den StudiCar Code
        </p>
        <p></p>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
defineProps({
  value: Boolean,
  input: String,
});
function emit(val) {
  $emit('input', val);
}
</script>

<style lang="scss" scoped>
.studicar-code {
  transform: translateY(150%);
  transition-delay: 0.6s;
  transition-timing-function: cubic-bezier(0, 1, 0.42, 0.99);
  overflow-y: hidden;
  &.show {
    animation: rise 0.4s forwards ease-out;

    @keyframes rise {
      to {
        transform: translateY(0);
      }
    }
  }
}

.qrcode-image {
  width: 45px;
  height: 45px;
  background: transparent;
}
</style>
