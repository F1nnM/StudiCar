<template>
  <div>
    <q-dialog
      :value="value"
      :position="position || 'standard'"
      @input="emit"
      full-width
      transition-show="slide-up"
      :transition-hide="position == 'bottom' ? 'slide-down' : 'jump-down'"
    >
      <!-- <q-toolbar class="text-right">
            <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>-->
      <q-card class="q-pa-none">
        <q-card-section class="text-center overflow-hidden-y q-pa-none q-ma-md">
          <div class="text-center bg-white">
            <q-chip outline size="md" color="primary" class="q-pa-sm q-mt-lg">
              <span class="text-subtitle1 text-dark">{{ label || 'Scan den Code' }}</span>
              <!-- (above is a fallback when no label is given, not be best but easiest way) -->
            </q-chip>
            <q-circular-progress
              v-if="!linearProgress && fakeRefresh"
              size="md"
              :thickness="0.05"
              :color="progressColorWhite ? 'white' : 'primary'"
              :track-color="progressColorWhite ? 'primary' : 'white'"
              :value="qrProgress * 100"
              readonly
              :reverse="progressColorWhite"
            />
          </div>
          <div :class="'relative-position studicar-code' + (value ? ' show' : '')">
            <div class="disable-css">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <VueQrcode
                style="border: 1px solid black"
                class="rounded-borders"
                :width="200"
                :color="color"
                errorCorrectionLevel="H"
                :value="qrInput"
              />
              <q-img
                src="~assets/app-icon_from_web_filled.png"
                class="absolute-center qrcode-image"
              />
            </div>
          </div>

          <q-toolbar>
            <!-- <q-avatar>
            <img src="~assets/app-icon.svg" />
            </q-avatar>-->

            <q-toolbar-title class="column">
              <div>
                <span class="text-dark">StudiCar</span> Code
                <q-btn
                  icon="help_outline"
                  class="q-ml-md"
                  outline
                  flat
                  dense
                  @click="showInfo = !showInfo"
                />
              </div>
            </q-toolbar-title>
          </q-toolbar>
          <q-slide-transition>
            <div v-if="showInfo" class="text-caption text-center">
              <div class="q-pa-sm">
                <ExtHr color="primary" size="xs" class="q-mb-sm" />

                <p v-if="text">{{ text }}</p>
                <p v-else>
                  Über diesen Code kannst du Daten an andere Nutzer der App übertragen. Dafür muss ein anderer StudiCar-Nutzer den Code
                  mit seinem Scanner scannen und er wird direkt auf den passenden Inhalt weitergeleitet.
                </p>
              </div>
            </div>
          </q-slide-transition>
        </q-card-section>

        <q-linear-progress
          class="q-mt-xs full-width"
          :color="progressColorWhite ? 'white' : 'primary'"
          :track-color="progressColorWhite ? 'primary' : 'white'"
          :value="linearProgress ? qrProgress : 1"
          :reverse="progressColorWhite"
        />
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import VueQrcode from "vue-qrcode"; // docs: https://github.com/rx-ts/vue/tree/master/packages/vue-qrcode
import ExtHr from "components/ExtendedHr";
import { colors } from "quasar";

export default {
  name: "QrGenerator",
  components: {
    VueQrcode,
    ExtHr
  },
  props: {
    input: {
      type: String,
      required: true,
    },
    value: Boolean,
    primColor: Boolean,
    text: String,
    label: String,
    fakeRefresh: Boolean,
    linearProgress: Boolean,
    position: String
  },

  data() {
    return {
      color: {
        dark: this.primColor ? colors.getBrand("primary") : "#000000FF",
        light: "#FFFFFFFF",
      },
      showInfo: false,
      qrProgress: 1,
      interval: null,
      progressColorWhite: false,
      random: '01'
    };
  },
  watch: {
    value: function(isOpen){
      if(this.fakeRefresh){
      const step = 5, // in hundreths, e.g. 100 means just one step to complete
      duration = 5000

      var computedStep = step / 100,
      numberOfSteps = 1 / computedStep
      if(isOpen) this.interval = setInterval(_=> {
        if(this.qrProgress <= computedStep) this.progressReset()
        else this.qrProgress -= computedStep
      }, duration / numberOfSteps)
      else clearInterval(this.interval)
      }
    }
  },

  computed: {
    qrInput(){
      return JSON.stringify({ // just a joke, isn't more secure, just that qr code will change every interval, but important content stays the same xD
        q: this.input,
        f: this.random
      })
    }
  },

  methods: {
    emit(val) {
      this.$emit("input", val);
    },

    async progressReset(){
      this.qrProgress = 1.15
      this.random = Math.round(Math.random() * 100) + ''
      /* this.progressColorWhite = !this.progressColorWhite */
    }
  },
};
</script>

<style lang="scss">
.studicar-code {
  transform: translateY(150%);
  transition-delay: 0.8s;
  transition-timing-function: cubic-bezier(0, 1, 0.42, 0.99);
  overflow-y: hidden;

  > div:not(.disable-css) {
    img {
      filter: sepia(50%);
    }
    position: relative;
    &::after {
      content: "";
      position: absolute;
      bottom: 30px;
      border-radius: 50%;
      left: 70px;
      width: 30px;
      height: 30px;
      background-color: red;
    }
  }

  &.show {
    animation: rise 0.4s forwards ease-out;

    @keyframes rise {
      to {
        transform: translateY(0);
      }
    }
  }
}

.qr-label {
  position: relative;

  &::after {
    width: 200%;
    left: 50%;
    transform: translateX(-50%);
    bottom: -50%;
    content: "";
    position: absolute;
    border: 1px solid $primary;
    border-top: none;
    padding-bottom: 50px;
    border-radius: 40%;
  }
}

.qrcode-image {
  width: 45px;
  height: 45px;
  background: transparent;
}
</style>