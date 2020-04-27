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
			video: [],
			result: '',
			error: '',
			scannerOpen: false,
			scannerLoaded: false,
			scannerHelp: false
		}
	},
	methods: {

		openScannerHelp(){
				this.scannerHelp = true
				this.$emit('help')
		},

			toggleScannerOpen(){
				this.scannerOpen = !this.scannerOpen
				if(!this.scannerOpen){
					this.scannerLoaded = false
				}
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
		}
	}
}
</script>
