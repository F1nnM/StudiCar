<template>
  <div class="q-pa-md">
    <p class="text-h6">
      StudiCar Scan
      <q-btn @click="newScan()">NEUER SCAN</q-btn>
    </p>
    <q-slide-transition>
      <p v-if="result">{{result}}</p>
    </q-slide-transition>

    <q-slide-transition>
      <div class="q-pa-xl" v-if="!result">
        <q-card>
          <div class="scanning">
            <qrcode-stream @init="onInit" @decode="decoded"></qrcode-stream>
          </div>
        </q-card>
      </div>
    </q-slide-transition>
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
          this.message(error)
        }
        
      },
      decoded(res){
        this.result = res
      },
      message (error) {
      this.$q.dialog({
        dark: true,
        title: 'Fehler',
        message: '' + error
      }).onOk(() => {
        // console.log('OK')
      }).onCancel(() => {
        // console.log('Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    },

    newScan(){
      this.result = ''
    }
      
    },
    ready(){
        
        
    }
}



</script>

<style lang="scss">
.scanning {
  position: relative;
  &:after {
    content: "";
    position: absolute;
    top: 0%;
    left: 0;
    width: 100%;
    height: 0px;
    border-bottom: 1px solid red;
    animation: scanner 2s alternate infinite;
  }

  @keyframes scanner {
    to {
      top: 100%;
    }
  }
}
</style>