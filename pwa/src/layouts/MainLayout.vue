<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <div>
        <q-toolbar>
          <q-btn
            flat
            dense
            :disabled="scannerOpen"
            round
            icon="menu"
            aria-label="Menu"
            @click="leftDrawerOpen = !leftDrawerOpen"
          />

          <q-toolbar-title class="row">
            <div class="text-weight-light q-pt-xs col-xs-10 col-md-11">
              <q-slide-transition :duration="300">
                <div
                  v-show="!scrolled"
                >{{!scannerOpen ? 'StudiCar ' + pageTrans : 'Scanvorgang läuft'}}</div>
              </q-slide-transition>
              <q-slide-transition :duration="150">
                <div v-show="scrolled" class>{{pageName}}</div>
              </q-slide-transition>
            </div>
            <div class="col-xs-2 col-md-1">
              <q-btn
                flat
                dense
                :icon="!scannerOpen ? 'filter_center_focus' : 'cancel_presentation'"
                @click="toggleScannerOpen"
              />
            </div>
          </q-toolbar-title>
        </q-toolbar>
      </div>
      <qrScanner :open="scannerOpen" @result="gotScanResult" @help="toggleScannerOpen" />
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered content-class="bg-grey-1">
      <q-slide-transition>
        <div v-show="true">
          <!-- if set to leftDrawerOpen, each time you open the sidebar the image has an expand transition -->
          <q-img
            contain
            src="~assets/app-logo.svg"
            style="height: 140px; background-color: white;"
          />
        </div>
      </q-slide-transition>

      <hr style="margin: 0; background-color: black;" />
      <q-list>
        <q-item-label header class="text-grey-8">Navigation</q-item-label>
        <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
      </q-list>
      <div style="padding: 10px;">StudiCar v{{ $q.version }}</div>
    </q-drawer>
    <q-page-container>
      <div v-if="pageName">
        <q-scroll-observer @scroll="scrollHandler" />

        <div class="text-h5 q-pl-md q-pt-md">
          <span class="custom-underline c-u-l c-u-2 c-u-md" transition="slide-left">{{pageName}}</span>
        </div>

        <br />
      </div>

      <transition :name="pageTrans" mode="out-in">
        <router-view
          @pagetrans_y="pageTransY = $event"
          :style="'transform-origin: 20% ' + pageTransY + 'vh;'"
        />
      </transition>
    </q-page-container>

    <q-footer elevated v-show="!(scannerOpen)">
      <q-tabs
        shrink
        full-width
        no-caps
        no-ripple
        dense
        active-color="primary"
        indicator-color="primary"
        v-model="tab"
        class="text-black bg-white"
        align="center"
      >
        <q-route-tab icon="home" to="/" label="Marktplatz" />
        <q-route-tab icon="add_circle_outline" to="/chats/lift/add" label="Neue Fahrt" />
        <q-route-tab icon="directions_car" to="/chats" label="Chats" />
        <q-route-tab icon="account_box" to="/profil" label="Profil" />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script>

import qrScanner from 'components/qrScanner'

import { scroll } from 'quasar'

import EssentialLink from 'components/EssentialLink'


export default {
  name: 'MainLayout',

  components: {
    EssentialLink,
    qrScanner
  },

  computed: {
    pageName(){
      return this.$store.state.pageName
    },

    loc(){
      return document.location.href
    },

    pageTrans(){
      return this.$store.state.pageTrans
    }
  },

  methods:{

    scrollHandler(info){
      this.scrolled = !this.scannerOpen ? info.position > 30 : false
    },

    gotScanResult(e){
      this.scannerOpen = false
    },

    
    toggleScannerOpen(){
      this.scannerOpen = !this.scannerOpen
    }

    
  },


  data () {

    return {
      leftDrawerOpen: false,
      pageTransY: 15,
      scannerOpen: false,
      scrolled: false,
      tab: 'home',
      chats: 'Main',
      show: true,
      essentialLinks: [
        {
        title: 'Marktplatz',
        caption: 'Zur Übersicht',
        icon: 'home',
        link: '/#/'
        },
        {
        title: 'Chats',
        caption: 'Meine Mitfahrgelenheiten',
        icon: 'directions_car',
        link: '/#/chats'
        },
        {
        title: 'Benutzer besuchen',
        caption: 'Profil eines anderen Benutzers ansehen',
        icon: 'accessibility_new',
        link: '/#/view-user'
        },
        {
        title: 'Zum Lift',
        caption: 'In den Chat an sich rein',
        icon: 'accessible',
        link: '/#/chats/lift'
        },
        {
        title: 'Mein Profil',
        caption: 'Meine Nutzerdaten und Statistiken',
        icon: 'account_box',
        link: '/#/profil'
        },
        {
        title: 'Scanner',
        caption: 'Einen StudiCar Code scannen',
        icon: 'filter_center_focus',
        link: '/#/scanner'
        },
        {
        title: 'Spielwiese',
        caption: 'Endlich wieder Kind sein',
        icon: 'toys',
        link: '/#/spielwiese'
        }
        ]
      }
    }
  }
</script>
