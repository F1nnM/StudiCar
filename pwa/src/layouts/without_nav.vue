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

        <q-toolbar-title>StudiCar Authentifizerung</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered content-class="bg-grey-1">
      <q-img contain src="~assets/app-logo.svg" style="height: 140px; background-color: white;" />
      <hr style="margin: 0; background-color: black;" />
      <q-list>
        <q-item-label header class="text-grey-8">
          Navigation
          <br />
          <br />
          <small>[während Authentifizierung eingeschränkt]</small>
        </q-item-label>
        <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
      </q-list>
      <div style="padding: 10px;">StudiCar v{{ $q.version }}</div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>

import EssentialLink from 'components/EssentialLink'


export default {
  name: 'without_nav',

  components: {
    EssentialLink
  },

  data () {

    return {
      leftDrawerOpen: false,
      
      essentialLinks: [
        {
        title: 'Home',
        caption: 'Die Startseite',
        icon: 'home',
        link: '/'
        },{
        title: 'Impressum',
        caption: 'Wir stellen uns vor',
        icon: 'how_to_reg',
        link: '/impressum'
        }
        ]
      }
    }
  }
</script>

<style scoped>
</style>