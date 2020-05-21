<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar v-if="$store.getters['auth/signinLoaded']">
        <q-toolbar-title>StudiCar Authentifizierung</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <div class="fixed-top text-center q-mt-xl q-pt-xl">
        <p class="text-h4">
          <span class="text-primary">Studi</span>Car
        </p>
        <p>Green. Cheap. Social.</p>
      </div>
      <div
        class="fixed-center full-width q-px-xl z-top"
        :class="$store.getters['auth/signinLoaded']?'transparent':''"
      >
        <div class="q-mt-xl">
          <p class="col-9 q-ma-none">Bitte hab noch einen Moment Geduld</p>
        </div>
        <q-linear-progress indeterminate rounded color="primary" class="q-mt-sm" />
      </div>
      <div class="fixed-bottom overflow-hidden-y q-mb-lg q-mx-xl text-center">
        <div class="branding-rise">Mit freundlicher Unterstützung von</div>
      </div>
      <router-view v-if="$store.getters['auth/signinLoaded']" />
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

.branding-rise {
  animation: rise 0.4s forwards;
  animation-delay: 0.3s;
  transform: translateY(-100%);

  @keyframes rise {
    to {
      transform: translateY(0);
    }
  }
}
</style>
