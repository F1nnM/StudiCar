<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <div>
        <q-toolbar>
          <q-btn
            flat
            dense
            :disabled="scannerOpen"
            round
            icon="menu"
            aria-label="Menu"
            @click="leftDrawerOpen = !leftDrawerOpen"
          />

          <q-toolbar-title class="row">
            <div class="text-weight-light q-pt-xs col-xs-10 col-md-11">
              <q-tab-panels
                v-model="scrolled"
                class="bg-primary"
                animated
                transition-prev="jump-down"
                transition-next="jump-up"
              >
                <q-tab-panel class="q-pa-none bg-primary text-white" :name="false">
                  <q-tab-panels
                    v-model="scannerOpen"
                    class="bg-primary"
                    animated
                    transition-prev="slide-right"
                    transition-next="slide-left"
                  >
                    <q-tab-panel class="bg-primary q-pa-none text-white" :name="false">
                      StudiCar
                      <!-- {{ pageTrans }} -->
                    </q-tab-panel>
                    <q-tab-panel
                      class="bg-primary q-pa-none text-white"
                      :name="true"
                    >Scanvorgang läuft</q-tab-panel>
                  </q-tab-panels>
                </q-tab-panel>
                <q-tab-panel class="q-pa-none bg-primary text-white" :name="true">{{ pageName }}</q-tab-panel>
              </q-tab-panels>
            </div>
            <div class="col-xs-2 col-md-1">
              <q-btn
                flat
                dense
                :icon="!scannerOpen ? 'filter_center_focus' : 'cancel_presentation'"
                @click="toggleScannerOpen"
              />
            </div>
          </q-toolbar-title>
        </q-toolbar>
      </div>
      <QrScanner
        overlay="primary"
        :open="scannerOpen"
        @result="gotScanResult"
        @help="scannerHelpNeeded"
        @swipe="closeScanner"
      />
    </q-header>
    <GetUserDataLoading persistent v-model="loadingScreenVisible" />

    <q-drawer
      :no-swipe-open="scannerOpen"
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
      class="drawer-no-border"
    >
      <DrawerWelcomeImage :timeText="greeting" :caption="newsticker || 'Ticker wird geladen...'" />
      <hr style="margin: 0; background-color: black;" />
      <q-list>
        <q-item-label header class="text-grey-8">Navigation</q-item-label>
        <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
      </q-list>
      <div style="padding: 10px;">StudiCar v{{ $q.version }}</div>
    </q-drawer>

    <q-page-container>
      <div v-if="pageName">
        <q-scroll-observer @scroll="scrollHandler" />

        <div class="text-h5 q-pl-md q-pt-md">
          <span class="custom-underline c-u-l c-u-2 c-u-md" transition="slide-left">{{ pageName }}</span>
        </div>

        <br />
      </div>

      <transition :name="pageTrans" mode="out-in">
        <router-view />
      </transition>
    </q-page-container>
    <QRLiftDisplay v-model="liftQrId" />

    <q-footer elevated v-show="!(scannerOpen)">
      <q-tabs
        full-width
        no-caps
        no-ripple
        dense
        shrink
        active-color="primary"
        indicator-color="primary"
        v-model="tab"
        class="text-black bg-white"
        align="center"
      >
        <q-route-tab exact icon="home" to="/" label="Marktplatz" />
        <q-route-tab icon="add_circle_outline" to="/chats/lift/add" label="Neue Fahrt" />
        <q-route-tab icon="directions_car" to="/chats" label="Chats" />
        <q-route-tab icon="account_box" to="/profil" label="Profil" />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script>
import QrScanner from "components/QrScanner";

import { scroll } from "quasar";

import EssentialLink from "components/EssentialLink";
import GetUserDataLoading from "components/GetUserDataLoading";
import DrawerWelcomeImage from "components/DrawerWelcomeImage";
import QRLiftDisplay from "components/QRLiftDisplay";

import { sendApiRequest, GET_NEWSTICKER } from "../ApiAccess";

export default {
  name: "MainLayout",

  components: {
    EssentialLink,
    QrScanner,
    DrawerWelcomeImage,
    GetUserDataLoading,
    QRLiftDisplay,
  },

  data() {
    return {
      greeting: this.$store.state.greeting,
      newsticker: null,
      userDataLoading: true,
      leftDrawerOpen: false,
      pageTransY: 15,
      scannerOpen: false,
      scrolled: false,
      tab: "home",
      chats: "Main",
      show: true,
      liftQrId: null,
    };
  },

  computed: {
    username() {
      return this.$store.getters["auth/user"].name.split(" ")[0];
    },

    loadingScreenVisible() {
      return this.$store.getters["auth/signinLoaded"];
    },

    pageName() {
      return this.$store.state.pageName;
    },

    loc() {
      return document.location.href;
    },

    pageTrans() {
      return this.$store.state.pageTrans;
    },

    essentialLinks() {
      return [
        {
          title: "Marktplatz",
          caption: "Zur Übersicht",
          icon: "home",
          link: "/#/",
        },
        {
          title: "Einstellungen",
          caption: "Personalisiere die App",
          icon: "settings",
          link: "/#/einstellungen",
        },
        {
          title: "Spielwiese",
          caption: "Endlich wieder Kind sein",
          icon: "toys",
          link: "/#/spielwiese",
        },
        {
          title: "Rechtliches",
          caption: "Muss auch sein",
          icon: "policy",
          link: "/#/rechtliches",
        },
        {
          title: "Support",
          caption: "Wir helfen dir",
          icon: "accessibility_new",
          link: "/#/hilfe",
        },
      ];
    },
  },

  methods: {
    scannerSwiped(e) {
      alert(e);
    },

    scrollHandler(info) {
      this.scrolled = !this.scannerOpen ? info.position > 30 : false;
    },

    gotScanResult(e) {
      this.scannerOpen = false;
      switch (e.type) {
        case "u":
          window.location.href = "#/benutzerinfo?slId=" + e.res;
          break;
        case "l":
          this.liftQrId = e.res;
          window.location.href = "#/";
          break;
      }
    },

    closeScanner(e) {
      if (e.direction == "up") {
        this.scannerOpen = false;
        setTimeout(() => window.scrollTo(0, 0), 300);
      }
    },

    toggleScannerOpen() {
      this.scannerOpen = !this.scannerOpen;
      if (this.scannerOpen) {
        this.leftDrawerOpen = false;
      }
    },

    scannerHelpNeeded() {
      this.scannerOpen = false;
    },

    randomArrayItem(array) {
      return array[Math.floor(Math.random() * array.length)];
    },

    reloadNews() {
      sendApiRequest(
        GET_NEWSTICKER,
        {},
        (data) => {
          this.newsticker = data;
        },
        (err) => {
          this.newsticker = "Fehler aufgetreten";
        }
      );
    },
  },

  mounted() {
    setTimeout(this.reloadNews, 1000); // simple call was buggy, no idea why
  },
};
</script>
