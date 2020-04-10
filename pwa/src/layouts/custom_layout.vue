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

        <q-toolbar-title>
          Eigenes Layout
          <q-toggle v-model="show_footer" color="white" label="show footer" />
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
      <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
        <!-- Wrapping only one DOM element, defined by QBtn -->
        <q-btn color="secondary" icon="mail" label="Email" />
        <router-view />
      </transition>
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

export default {
  name: 'custom_layout',

  components: {
    
  },

  data () {

    return {
      leftDrawerOpen: false,
      show_footer: true
    }
    }
  }
</script>
