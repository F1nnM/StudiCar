<template>
  <div>
    <q-dialog v-model="show" @input="emit()" transition-show="slide-up" transition-hide="jump-down">
      <q-card>
        <q-toolbar>
          <!-- <q-avatar>
            <img src="~assets/app-icon.svg" />
          </q-avatar>-->

          <q-toolbar-title>
            <span class="text-primary">Studi</span>Car Code
          </q-toolbar-title>

          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section class="text-center overflow-hidden-y q-pa-none q-ma-md">
          <div :class="'relative studicar-code' + (show ? ' show' : '')">
            <VueQrcode :width="200" :color="color" errorCorrectionLevel="H" :value="input" />
            <q-img src="~assets/app-icon.svg" class="absolute-center qrcode-image" />
          </div>
          <extHR color="primary" size="xs" class="z-top" />
        </q-card-section>
        <q-card-section class="q-pa-sm text-caption text-center">
          <p v-if="text">{{ text }}</p>
          <p v-else>
            Über diesen Code kannst du Daten an andere Nutzer der App übertragen. Dafür muss ein anderer StudiCar-Nutzer den Code
            mit seinem Scanner scannen und er wird direkt auf den passenden Inhalt weitergeleitet.
          </p>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import VueQrcode from "vue-qrcode"; // docs: https://github.com/rx-ts/vue/tree/master/packages/vue-qrcode
import extHR from "components/ExtendedHr";
import { colors } from "quasar";

export default {
  name: "QRGenerator",
  components: {
    VueQrcode,
    extHR,
  },
  props: {
    input: {
      type: String,
      required: true,
    },
    show: Boolean,
    primColor: Boolean,
    text: String,
  },
  model: {
    prop: "show",
    event: "input",
  },

  data() {
    return {
      color: {
        dark: this.primColor ? colors.getBrand("primary") : "#000000FF",
        light: "#FFFFFFFF",
      },
    };
  },

  methods: {
    emit() {
      this.$emit("input", this.show);
    },
  },
};
</script>

<style lang="scss">
.studicar-code {
  transform: translateY(150%);
  transition-delay: 0.8s;
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
  width: 50px;
  height: 50px;
  background: white;
}
</style>