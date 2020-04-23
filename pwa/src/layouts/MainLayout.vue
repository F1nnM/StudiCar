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

        <q-toolbar-title>StudiCar {{pageTrans}}</q-toolbar-title>
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
      <transition :name="getTrans()" mode="out-in">
        <router-view
          @pagetrans_zoom="pageTrans='expand'"
          @pagetrans_slide="pageTrans='collapse'"
          @pagetrans_y="pageTransY = $event"
          :style="'transform-origin: 20% ' + pageTransY + 'vh;'"
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

import EssentialLink from 'components/EssentialLink'


export default {
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  methods:{

    getTrans(){
      var loc = document.location.href
      
        if(loc.includes('add')){ // chats/lift/add is being visited
          this.pageTrans = 'slide-up'
        }
        else if(loc.includes('lift')) { // when not above is visited and this condition  is true, chats/lift is being visited
          this.pageTrans = 'expand'
        }
        else if(loc.includes('chats')){
          if(this.pageTrans == 'liftToChats'){ // only show a collapse transition if that value is set (would be if the 'back' btn of a lift has been clicked)
            this.pageTrans = 'collapse'
          }
        }
        else{
          this.pageTrans = 'slide'
        }
        return this.pageTrans
      
    }
  },


  data () {

    return {
      leftDrawerOpen: false,
      pageTransY: 15,
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
