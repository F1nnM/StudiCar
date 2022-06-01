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
              @click="leftDrawerOpen = !leftDrawerOpen"
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
                    {{ pageName }}
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
        <transition :name="pageTrans" mode="out-in">
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

let pageName = store.pageName;
let pageTrans = store.pageTrans;

let fullscreen = false;
let scrolled = false;
let leftDrawerOpen = false;

const scrollHandler = (event) => {
  scrolled = event.position > 30;
};

</script>
