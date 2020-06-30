<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar v-if="$store.getters['auth/signinLoaded']">
        <q-toolbar-title>StudiCar Authentifizierung</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view v-if="$store.getters['auth/signinLoaded']" />
    </q-page-container>
  </q-layout>
</template>

<script>

import EssentialLink from 'components/EssentialLink'
import LoadingScreen from 'components/LoadingScreen'

export default {
  name: 'without_nav',
  components: {
    
  }
}
</script>

<style scoped>
</style>
