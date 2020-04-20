<template>
  <div class="q-pa-md">
    <p class="text-h6">StudiCar Scan {{result}}</p>
    <!-- <p ref="cam_has_camera">Kamera vorhanden</p>
    <video muted playsinline ref="qr_video" style="height: 500px; width: 500px;"></video>
    <div ref="cam_qr_result"></div>-->

    <q-slide-transition>
      <div class="q-pa-xl" v-if="!result">
        <q-card>
          <qrcode-stream @init="onInit" @decode="decoded"></qrcode-stream>
        </q-card>
      </div>
    </q-slide-transition>

    <qrcode-capture></qrcode-capture>
  </div>
</template>

<script>

import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from 'vue-qrcode-reader'


export default {
components: { QrcodeStream },

    data(){
        return {
            code: '',
            video: [],
            result: '',
            error: ''
        }
    },
    methods: {
        help(){
            alert("BIG ")
        },

        async onInit (promise) {
        try {
          await promise
        } catch (error) {
          if (error.name === 'NotAllowedError') {
            this.error = "ERROR: you need to grant camera access permisson"
          } else if (error.name === 'NotFoundError') {
            this.error = "ERROR: no camera on this device"
          } else if (error.name === 'NotSupportedError') {
            this.error = "ERROR: secure context required (HTTPS, localhost)"
          } else if (error.name === 'NotReadableError') {
            this.error = "ERROR: is the camera already in use?"
          } else if (error.name === 'OverconstrainedError') {
            this.error = "ERROR: installed cameras are not suitable"
          } else if (error.name === 'StreamApiNotSupportedError') {
            this.error = "ERROR: Stream API is not supported in this browser"
          }
          this.alert(error)
        }
        
      },
      decoded(res){
        this.result = res
      },
      alert (error) {
      this.$q.dialog({
        dark: true,
        title: 'Fehler',
        message: error
      }).onOk(() => {
        // console.log('OK')
      }).onCancel(() => {
        // console.log('Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    }
      
    },
    ready(){
        
        
    }
}



</script>