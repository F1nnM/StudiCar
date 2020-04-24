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

        <q-toolbar-title class="row">
          <!-- <div class="col-6 overflow-hidden-y relative-position">
            <p class="q-ma-none">Eigenes Layout</p>
            <div
              :class="'absolute-left full-width bg-primary title-slide' + (scrolled ? ' show' : '')"
            >NEUes Layout</div>
          </div>-->

          <div class="col-6 overflow-hidden-y" style="height: 40px;">
            <transition name="title-up-trans">
              <div v-show="!scrolled" class="q-ma-none q-my-auto">{{message}}</div>
            </transition>
            <transition name="title-down-trans">
              <div v-show="scrolled" class="q-ma-none q-my-auto">Neues Layout</div>
            </transition>
          </div>

          <div class="col-6">
            <q-toggle v-model="scrolled" color="white" label="show footer" />
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered content-class="bg-grey-1">
      <q-slide-transition>
        <div v-show="leftDrawerOpen">
          <img class="responsive" src="~assets/sad.svg" />
        </div>
      </q-slide-transition>
      <p>Irgendwie irgendwas</p>
    </q-drawer>

    <q-page-container>
      <q-scroll-observer @scroll="scrollHandler" />
      <router-view />
    </q-page-container>

    <q-footer elevated v-show="show_footer">
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
        <q-route-tab icon="forward" to="/spielwiese" label="Spielwiese" />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script>

import { scroll } from 'quasar'

export default {
  name: 'custom_layout',

  components: {
    
  },

  computed: {
    message(){
      return this.$store.state.message
    }
  },


  data () {

    return {
      leftDrawerOpen: false,
      show_footer: true,
      scrolled: false,
      tab: 'home'
    }
  },

  methods: {
    scrollHandler(info){
      this.$store.commit('message', info.position)
    }
  }
}
</script>
