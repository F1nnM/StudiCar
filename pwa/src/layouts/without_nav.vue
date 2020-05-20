<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>StudiCar Authentifizierung</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container >
      <div class="overlay" :class="$store.getters['auth/signinLoaded']?'transparent':''">
        <q-circular-progress indeterminate size="50px" class="q-ma-md center" />
      </div>
      <router-view v-if="$store.getters['auth/signinLoaded']"/>
    </q-page-container>
  </q-layout>
</template>

<script>

import EssentialLink from 'components/EssentialLink'

export default {
  name: 'without_nav'
}
</script>

<style scoped>
.center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: white;
  transition-duration: 1s;
  z-index: 999;
}
.transparent {
  opacity: 0;
  visibility: hidden;
}
</style>
