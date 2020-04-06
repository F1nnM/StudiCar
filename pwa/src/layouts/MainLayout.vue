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

        <q-toolbar-title>Quasar App</q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered content-class="bg-grey-1">
      <q-img
        src="~assets/quasar-logo-full.svg"
        center
        style="height: 140px; max-width: 150px; margin: 0 20px; object-fit: cover;"
      />
      <q-list>
        <q-item-label header class="text-grey-8">Navigation</q-item-label>
        <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink'

export default {
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  data () {
    return {
      leftDrawerOpen: false,
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
        link: '/#/anmeldung'
        },
        {
        title: 'Registrierung',
        caption: 'Erstelle einen Account',
        icon: 'edit',
        link: '/#/registrierung'
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
        }
        ]
      }
    }
  }
</script>
