<template>
  <div>
    <div :class="'bg-primary scanner-container' + (open ? ' open' : '')">
      <q-slide-transition>
        <div class="scanning-overlay">
          <qrcode-stream
            :style="'height: 100vh; transition: .5s; opacity:' + (scannerLoaded ? 1 : 0)"
            v-if="open"
            @init="onInit"
            @decode="decoded"
            v-touch-swipe.mouse="swiped"
          >
            <div class="overlay-inner">
              <p>
                <b>StudiCar</b> Code
                <q-btn round flat dense size="sm" icon="help_outline" @click="openScannerHelp" />
              </p>
              <p>
                <small>Bitte halte dein Gerät ruhig</small>
              </p>
              <div></div>
            </div>
          </qrcode-stream>
        </div>
      </q-slide-transition>
      <div v-if="!open" style="height: 100vh;"></div>
      <q-dialog v-model="scannerHelp">
        <q-card>
          <q-card-section class="row items-center q-pa-md">
            <div class="text-h6">Hilfe zum Code</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>

          <q-card-section class="q-pa-md">
            Der StudiCar Code kann benutzt werden, um Fahrtangebote zu teilen oder
            andere Benutzerprofile anzusehen. Um einen Code zu erzeugen, geh einfach in deinem Profil auf eine deiner Fahrten und tipp auf
            das kleine Code-Symbol. Diesen Code kann dann ein anderer StudiCar Benutzer fahren und sieht direkt den geteilten Inhalt.
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

        
<script>
import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from 'vue-qrcode-reader'

export default {
components: { QrcodeStream },
name: 'qrScanner',

	props: {
		open: {
			type: Boolean,
			required: true
		}
  },

	data(){
		return {
			result: '',
			error: '',
			scannerLoaded: false,
			scannerHelp: false
		}
	},
	methods: {

		openScannerHelp(){
				this.scannerHelp = true
				this.$emit('help')
		},
    
    async onInit (promise) {
        try {
        await promise
        this.scannerLoaded = true
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
        alert(error)
			}
		},
		
		decoded(res){
			this.$emit('result', res)
    },
    
    swiped(info){
      this.$emit('swipe', info)
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

.scanner-container {
  visibility: hidden;
  transition: 0.35s;
  max-height: 0vh;
  &.open {
    visibility: visible;
    transition-duration: 0.5s;
    max-height: 100vh;
  }
}

.four-equal-children > * {
  width: 25%;
}

.scanning-overlay {
  position: relative;
  display: inline-block;
  width: 100%;
  height: 100%;

  & .overlay-inner {
    position: absolute;
    white-space: nowrap;
    font-weight: 200;
    font-size: 1.4em;
    text-align: center;
    padding-bottom: 0;
    border-bottom: 1px solid white;
    left: 50%;
    bottom: 20%;
    transform: translateX(-50%);
    max-height: 50%;
    width: 70%;
    background-color: transparent;
    color: white;
    & > div {
      position: relative;
      &:after {
        position: absolute;
        content: "";
        bottom: 0;
        left: 0;
        display: block;
        width: 100%;
        min-height: 40px;
        border-right: 1px solid white;
        border-left: 1px solid white;
      }
    }
  }
}
</style>