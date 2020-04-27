<template>
  <q-layout view="lHh Lpr lFf">
    <q-slide-transition>
      <q-header elevated>
        <div v-show="!fullscreen">
          <q-toolbar>
            <q-btn
              flat
              dense
              round
              icon="menu"
              aria-label="Menu"
              @click="leftDrawerOpen = !leftDrawerOpen"
            />

            <q-toolbar-title class="row">
              <div class="col-6 q-pt-xs">
                <q-slide-transition>
                  <div v-show="!scrolled" class="text-weight-thin">StudiCar {{scannerLoaded}}</div>
                </q-slide-transition>
                <q-slide-transition>
                  <div v-show="scrolled" class="text-weight-thin">{{pageName}}</div>
                </q-slide-transition>
              </div>

              <div class="col-6">
                <q-btn
                  :icon="!scannerOpen ? 'filter_center_focus' : 'cancel_presentation'"
                  @click="toggleScannerOpen"
                />
              </div>
            </q-toolbar-title>
          </q-toolbar>
        </div>
        <qrScanner :open="scannerOpen" @result="gotResult" />
      </q-header>
    </q-slide-transition>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered content-class="bg-grey-1">
      <q-btn to="/marktplatz">Zurück</q-btn>
      <q-toggle v-model="fullscreen" label="Vollbild" />
    </q-drawer>

    <q-page-container>
      <q-scroll-observer @scroll="scrollHandler" />
      <transition name="slide-full">
        <router-view />
      </transition>
    </q-page-container>

    <q-slide-transition>
      <q-footer elevated v-show="!(fullscreen || scannerOpen)">
        <q-tabs
          stretch
          full-width
          no-caps
          no-ripple
          dense
          active-color="primary"
          indicator-color="primary"
          v-model="tab"
          class="text-black bg-white"
          align="justify"
        >
          <q-route-tab icon="eco" to="/spielwiese" label="Spielwiese" />
          <q-route-tab icon="child_care" to="/spielplatz" label="Spielplatz" />
          <q-route-tab icon="casino" to="/spielhölle" label="Spielhölle" />
        </q-tabs>
      </q-footer>
    </q-slide-transition>
  </q-layout>
</template>

<script>

import qrScanner from 'components/qrScanner'

//import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from 'vue-qrcode-reader'

import { scroll } from 'quasar'


export default {
  components: { 
    
    qrScanner
  },

    mounted(){
      this.$store.commit('setPage', '')
    },

    computed: {
      pageName() {
        return this.$store.state.pageName
      }
    },

    data(){
        return {
            code: '',
            video: [],
            result: '',
            fullscreen: false,
            leftDrawerOpen: false,
            error: '',
            scannerOpen: false,
            scannerLoaded: false,
            scannerHelp: false
        }
    },
    methods: {

      startScanning(promise){
        onInit(promise).then
      },


        gotResult(e){
          alert(e)
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

    scrollHandler(info){
      this.scrolled = info.position > 30
    }
  }
}
</script>
