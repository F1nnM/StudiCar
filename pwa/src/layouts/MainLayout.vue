<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
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
                      <!-- <q-btn label="reg" to="/auth/registrierung" /> -->
                      <q-chip
                        clickable
                        @click="hideUpdateField = false"
                        dense
                        v-if="oldVersionRunning && hideUpdateField"
                        color="deep-orange"
                        text-color="white"
                        icon="new_releases"
                      >ältere Version</q-chip>
                      <!-- {{ pageTrans }} -->
                    </q-tab-panel>
                    <q-tab-panel
                      class="bg-primary q-pa-none text-white"
                      :name="true"
                    >Scanvorgang läuft</q-tab-panel>
                  </q-tab-panels>
                </q-tab-panel>
                <q-tab-panel
                  class="q-pa-none bg-primary text-white"
                  :name="true"
                >{{ navTitle || pageName }}</q-tab-panel>
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
      <q-list class="q-pb-sm">
        <q-item-label header class="text-grey-8">Navigation</q-item-label>
        <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
      </q-list>
      <ExtHr color="grey-7" size="xs" />
      <div class="q-pa-md text-grey-7 row justify-between">
        <span>StudiCar</span>
        <span>Quasar v{{ $q.version }}</span>
      </div>
    </q-drawer>
    <q-pull-to-refresh ref="refresher" @refresh="refresh">
      <div>
        <q-page-container>
          <div v-if="pageName">
            <q-scroll-observer @scroll="scrollHandler" />

            <div class="text-h5 q-pl-md q-py-md" v-if="!titleOnlyInNav">
              <span
                class="custom-underline c-u-l c-u-2 c-u-md"
                transition="slide-left"
              >{{ pageName }}</span>
            </div>
          </div>
          <transition :name="pageTrans" mode="out-in">
            <router-view ref="pageContent" />
          </transition>
        </q-page-container>
      </div>
    </q-pull-to-refresh>
    <QrLiftDisplay v-model="liftQrId" />

    <q-dialog
      :value="!hideUpdateField && oldVersionRunning"
      transition-show="fade"
      transition-hide="fade"
      class="z-top"
    >
      <q-card class="bg-dark text-white">
        <q-toolbar>
          <q-toolbar-title>
            <q-icon name="info_outline" class="q-mr-sm" size="sm" />
            <span>Neue Version verfügbar</span>
          </q-toolbar-title>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-toolbar>

        <q-card-section>
          Stelle sicher, dass du immer die neueste Version verwendest.
          <q-btn
            label="Warum ist das wichtig?"
            outline
            no-caps
            class="q-mt-xs"
            to="/hilfe?faq-id=30"
          />
        </q-card-section>
        <q-card-actions align="around" class="q-mt-sm">
          <q-btn flat color="white" label="Später" @click="hideUpdateField = true" />
          <q-btn color="primary" label="Aktualisieren" @click="reloadPage" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-footer elevated v-show="!(scannerOpen)">
      <q-slide-transition>
        <div v-if="!!refreshErr">
          <q-banner inline-actions class="text-white bg-negative">
            Fehler: {{ refreshErr }}
            <template v-slot:action>
              <q-btn flat color="white" label="Nochmal" @click="refreshAgain" />
              <q-btn flat color="white" label="Ok" @click="refreshErr = null" />
            </template>
          </q-banner>
        </div>
      </q-slide-transition>
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
        <q-route-tab exact icon="home" to="/" label="Marktplatz" replace />
        <q-route-tab icon="add_circle_outline" to="/add-lift" replace label="Anbieten" />
        <q-route-tab icon="directions_car" to="/chats" replace label="Fahrten" />
        <q-route-tab icon="account_box" to="/profil" replace label="Profil" />
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
import QrLiftDisplay from "components/QrLiftDisplay";
import ExtHr from "components/ExtendedHr";

import { sendApiRequest, GET_NEWSTICKER } from "../ApiAccess";

export default {
  name: "MainLayout",

  components: {
    EssentialLink,
    QrScanner,
    DrawerWelcomeImage,
    GetUserDataLoading,
    QrLiftDisplay,
    ExtHr
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
      liftQrId: "",
      refreshErr: null,
      hideUpdateField: false
    };
  },

  computed: {
    username() {
      return this.$store.getters["auth/user"].name.split(" ")[0];
    },

    loadingScreenVisible() {
      return this.$store.getters["auth/signinLoaded"];
    },

    navTitle() {
      return this.$store.state.navTitle;
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

    titleOnlyInNav() {
      return this.$store.state.onlyInNav;
    },

    oldVersionRunning() {
      return this.$store.state.oldVersionRunning;
    },

    essentialLinks() {
      return [
        {
          title: "Marktplatz",
          caption: "Zur Übersicht",
          icon: "home",
          link: "/#/"
        },
        {
          title: "Einstellungen",
          caption: "Personalisiere die App",
          icon: "settings",
          link: "/#/einstellungen"
        },
        {
          title: "Spielwiese",
          caption: "Endlich wieder Kind sein",
          icon: "toys",
          link: "/#/spielwiese"
        },
        {
          title: "Rechtliches",
          caption: "Muss auch sein",
          icon: "policy",
          link: "/#/rechtliches"
        },
        {
          title: "Team",
          caption: "Wer hinter dem Projekt steckt",
          icon: "emoji_people",
          link: "/#/das-team"
        },
        {
          title: "Support",
          caption: "Wie können wir dir helfen?",
          icon: "accessibility_new",
          link: "/#/hilfe?faq-id=30"
        }
      ];
    }
  },

  methods: {
    reloadPage() {
      location.reload(true);
    },

    async refresh(done) {
      var pageRefresh = new Promise((res, rej) => {
        try {
          this.$refs.pageContent.refreshContent(res, rej);
        } catch (e) {
          res();
        }
      })
        .then()
        .catch(res => {
          this.refreshErr = res;
        })
        .finally(done);
    },

    refreshAgain() {
      this.refreshErr = null;
      this.$refs.refresher.trigger();
      // this.refresh();
    },

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
          window.location.href = "#/benutzerinfo?userFbId=" + e.res;
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
        data => {
          this.newsticker = data.ticker;
        },
        err => {
          this.newsticker = "Fehler aufgetreten";
        }
      );
    }
  },

  mounted() {
    setTimeout(this.reloadNews, 50); // simple call was buggy, no idea why
  }
};
</script>
