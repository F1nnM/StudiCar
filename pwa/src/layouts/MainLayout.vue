<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>StudiCar {{page_trans}}</q-toolbar-title>
      </q-toolbar>
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
      <transition :name="page_trans" mode="out-in">
        <router-view
          @pagetrans_zoom="page_trans='expand'"
          @pagetrans_slide="page_trans='collapse'"
          @pagetrans_y="page_trans_y = $event"
          :style="'transform-origin: 20% ' + page_trans_y + 'vh;'"
        />
      </transition>
    </q-page-container>

    <q-footer elevated>
      <q-tabs
        shrink
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
        @click="updateURL"
      >
        <q-route-tab icon="home" to="/" label="Marktplatz" />
        <q-route-tab icon="add_circle_outline" to="/chats/lift/add" label="Neue Fahrt" />
        <q-route-tab
          @click="page_trans = 'slide-up'"
          icon="directions_car"
          to="/chats"
          label="Chats"
        />
        <q-route-tab icon="account_box" to="/profil" label="Profil" />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script>

import EssentialLink from 'components/EssentialLink'


export default {
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  methods:{
    updateURL () {
      var loc = document.location.href
      
      if(loc.includes("add")){
        this.page_trans = 'slide-up'
      }
      
      else{
        this.page_trans = 'slide'
      }
      
    }
  },


  data () {

    return {
      leftDrawerOpen: false,
      page_trans: 'slide',
      page_trans_y: 15,
      tab: 'home',
      chats: 'Main',
      show: true,
      essentialLinks: [
        {
        title: 'Marktplatz',
        caption: 'Zur Übersicht',
        icon: 'home',
        link: '/'
        },
        {
        title: 'Chats',
        caption: 'Meine Mitfahrgelenheiten',
        icon: 'directions_car',
        link: '/#/chats'
        },
        {
        title: 'Anmeldung',
        caption: 'Melde dich an',
        icon: 'save',
        link: '/#/auth/anmeldung'
        },
        {
        title: 'Registrierung',
        caption: 'Erstelle einen Account',
        icon: 'edit',
        link: '/#/auth/registrierung'
        },
        {
        title: 'Willkommen',
        caption: 'Wozu diese App da ist',
        icon: 'accessible',
        link: '/#/willkommen'
        },
        {
        title: 'Mein Profil',
        caption: 'Meine Nutzerdaten und Statistiken',
        icon: 'account_box',
        link: '/#/profil'
        },
        {
        title: 'Einstellungen',
        caption: 'Interne App-Einstellungen',
        icon: 'perm_data_settings',
        link: '/#/einstellungen'
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

<style scoped>
</style>