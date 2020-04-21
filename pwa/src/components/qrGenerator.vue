<template>
  <div>
    <q-dialog v-model="show">
      <q-card>
        <q-toolbar>
          <q-avatar>
            <img src="~assets/app-icon.svg" />
          </q-avatar>

          <q-toolbar-title>
            <span class="text-weight-bold">StudiCar</span> Code
          </q-toolbar-title>

          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section class="q-mb-xl text-center overflow-hidden-y">
          <div
            class="studicar-code"
            :style="'transform: translateY(' + (this.show ? '0' : '-100') + '%);'"
          >
            <VueQrcode
              :width="200"
              :color="color"
              errorCorrectionLevel="H"
              :value="value"
              primColor
            />
          </div>
        </q-card-section>
        <q-card-section class="q-pa-sm text-caption text-center">
          <p>Über diesen Code kannst du Daten an andere Nutzer der App übertragen.</p>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>

import VueQrcode from 'vue-qrcode' // docs: https://github.com/rx-ts/vue/tree/master/packages/vue-qrcode
import { colors } from 'quasar'

export default {
    name: 'qrGenerator',
    components: {
        VueQrcode
    },
    props: {
        value: {
            type: String,
            required: true
        },
        show: {
            type: Boolean,
            required: true
        },
        primColor: {
            type: Boolean,
            default: false
        }
    },
    data(){
        return{
            color: {
                dark: this.primColor ? colors.getBrand('primary') : '#000000FF',
                light: '#FFFFFFFF'
            }
        }
    }
}
</script>

<style>
.studicar-code {
  transition: 0.2s ease-out;
  transition-delay: 0.5s;
}
</style>