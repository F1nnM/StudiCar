<template>
  <div>
    <q-slide-transition>
      <p v-if="result">{{result}}</p>
    </q-slide-transition>

    <q-slide-transition>
      <div class="q-pa-none" v-if="!result">
        <div class="scanning-border full-height full-width relative">
          <qrcode-stream @init="onInit" @decode="decoded"></qrcode-stream>
          <p
            class="text-h6 text-uppercase text-weight-light text-white absolute-center"
          >StudiCar Scan</p>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </q-slide-transition>
  </div>
</template>

<script>

import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from 'vue-qrcode-reader'


export default {
components: { QrcodeStream },

    mounted(){
      this.$store.commit('setPageTrans', 'swipe-away')
      this.$store.commit('setPage', '')
      
    },

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

.scanning-border {
  position: relative;
  height: 100%;
  width: 100%;
  &:after {
    content: "";
    position: absolute;
    width: 5px;
    height: 5px;
    background: linear-gradient(to right, white, red);
    animation: circle_border 2s infinite;
  }

  @keyframes circle_border {
    0%,
    100% {
      top: 0%;
      left: 0%;
    }
    25% {
      left: 99%;
      top: 0%;
    }
    50% {
      top: 99%;
      left: 99%;
    }
    75% {
      top: 99%;
      left: 0%;
    }
  }
}
</style>