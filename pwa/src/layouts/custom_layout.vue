<template>
  <q-layout view="lHh Lpr lFf">
    <q-slide-transition>
      <q-header elevated>
        <div v-show="!fullscreen">
          <q-toolbar>
            <q-btn
              flat
              dense
              round
              icon="menu"
              aria-label="Menu"
              @click="toggleDrawer"
            />

            <q-toolbar-title class="row">
              <div class="col-6 q-pt-xs">
                <q-slide-transition>
                  <div v-show="!scrolled" class="text-weight-thin">
                    StudiCar
                  </div>
                </q-slide-transition>
                <q-slide-transition>
                  <div v-show="scrolled" class="text-weight-thin">
                    {{ store.pageName }}
                  </div>
                </q-slide-transition>
              </div>

              <div class="col-6"></div>
            </q-toolbar-title>
          </q-toolbar>
        </div>
      </q-header>
    </q-slide-transition>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-btn to="/">Marktplatz</q-btn>
      <q-toggle v-model="fullscreen" label="Vollbild" />
    </q-drawer>

    <q-page-container>
      <q-scroll-observer @scroll="scrollHandler" />
      <router-view v-slot="{ Component }">
        <transition :name="store.pageTrans" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>

    <q-slide-transition>
      <q-footer elevated v-show="!fullscreen">
        <q-tabs
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
          <q-route-tab icon="eco" to="/spielwiese" label="Spielwiese" />
          <q-route-tab icon="child_care" to="/spielplatz" label="Spielplatz" />
          <q-route-tab icon="casino" to="/spielhölle" label="Spielhölle" />
        </q-tabs>
      </q-footer>
    </q-slide-transition>
  </q-layout>
</template>

<script setup>
import { useAppStore } from 'src/stores/app';

const store = useAppStore();

const fullscreen = ref(false);
const scrolled = ref(false);
const leftDrawerOpen = ref(false);

const scrollHandler = (event) => {
  scrolled.value = event.position > 30;
};

const toggleDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};
</script>
