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
                <q-tab-panel
                  class="q-pa-none bg-primary text-white"
                  :name="false"
                >
                  <q-tab-panels
                    v-model="scannerOpen"
                    class="bg-primary"
                    animated
                    transition-prev="slide-right"
                    transition-next="slide-left"
                  >
                    <q-tab-panel
                      class="bg-primary q-pa-none text-white"
                      :name="false"
                      clickable
                      @click="reloadPage"
                    >
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
                        >ältere Version</q-chip
                      >
                      <!-- {{ pageTrans }} -->
                    </q-tab-panel>
                    <q-tab-panel
                      class="bg-primary q-pa-none text-white"
                      :name="true"
                      >Scanvorgang läuft</q-tab-panel
                    >
                  </q-tab-panels>
                </q-tab-panel>
                <q-tab-panel
                  class="q-pa-none bg-primary text-white"
                  :name="true"
                  >{{ navTitle || pageName }}</q-tab-panel
                >
              </q-tab-panels>
            </div>
            <div class="col-xs-2 col-md-1">
              <q-btn flat dense @click="toggleScannerOpen">
                <!-- <q-icon v-if="scannerOpen" name="cancel_presentation" /> -->
                <div>
                  <q-avatar square size="1.4em">
                    <svg
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      x="0px"
                      y="0px"
                      width="100%"
                      height="100%"
                      viewBox="0 0 1000 1000"
                      enable-background="new 0 0 1000 1000"
                      xml:space="preserve"
                    >
                      <metadata>
                        Svg Vector Icons : http://www.onlinewebfonts.com/icon
                      </metadata>
                      <g fill="white">
                        <path
                          v-if="!scannerOpen"
                          d="M292.7,104.2H104.2v188.5c0,20.8-16.9,37.7-37.7,37.7c-20.8,0-37.7-16.9-37.7-37.7V66.5c0-20.8,16.9-37.7,37.7-37.7h226.2c20.8,0,37.7,16.9,37.7,37.7C330.4,87.4,313.5,104.2,292.7,104.2z M292.7,971.2H66.5c-20.8,0-37.7-16.9-37.7-37.7V707.3c0-20.8,16.9-37.7,37.7-37.7c20.8,0,37.7,16.9,37.7,37.7v188.5h188.5c20.8,0,37.7,16.9,37.7,37.7C330.4,954.3,313.5,971.2,292.7,971.2z M933.5,330.4c-20.8,0-37.7-16.9-37.7-37.7V104.2H707.3c-20.8,0-37.7-16.9-37.7-37.7c0-20.8,16.9-37.7,37.7-37.7h226.2c20.8,0,37.7,16.9,37.7,37.7v226.2C971.2,313.5,954.3,330.4,933.5,330.4z M933.5,971.2H707.3c-20.8,0-37.7-16.9-37.7-37.7c0-20.8,16.9-37.7,37.7-37.7h188.5V707.3c0-20.8,16.9-37.7,37.7-37.7c20.8,0,37.7,16.9,37.7,37.7v226.2C971.2,954.3,954.3,971.2,933.5,971.2z"
                        />

                        <path
                          d="M10,509.4c0-26,20.9-47.1,47.3-47.1h885.5c26.1,0,47.3,20.9,47.3,47.1c0,26-20.9,47.1-47.3,47.1H57.3C31.2,556.5,10,535.6,10,509.4z"
                        />
                      </g>
                    </svg>
                  </q-avatar>
                </div>
              </q-btn>
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

    <q-drawer
      :no-swipe-open="scannerOpen"
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
      class="drawer-no-border"
    >
      <DrawerWelcomeImage
        :timeText="greeting"
        :caption="newsticker || 'Ticker wird geladen...'"
      />
      <q-list class="q-pb-sm">
        <div v-for="group in navigationLinks" :key="group.title">
          <q-item-label header class="text-grey-8">{{
            group.title
          }}</q-item-label>
          <EssentialLink
            v-for="link in group.links"
            :key="link.title"
            v-bind="link"
          />
        </div>
      </q-list>
      <ExtHr color="grey-7" size="xs" />
      <div class="q-pa-md text-grey-7 row justify-between">
        <span>
          StudiCar
          <q-chip v-if="isDev" label="LOCAL" size="sm" color="primary"></q-chip>
        </span>
        <span>Quasar v{{ $q.version }}</span>
      </div>
    </q-drawer>
    <q-pull-to-refresh ref="refresher" @refresh="refresh">
      <div>
        <q-page-container>
          <div v-if="pageName">
            <q-scroll-observer @scroll="scrollHandler" />

            <div class="q-py-md" v-if="!titleOnlyInNav">
              <!-- <q-btn
                flat
                color="dark"
                dense
                size="md"
                class="q-ml-sm q-mb-sm"
                @click="goBack"
              >
                <span class="text-h4 font-weight-light">‹</span>
              </q-btn> -->
              <span
                class="text-h5 custom-underline q-ml-md c-u-l c-u-2 c-u-md"
                >{{ pageName }}</span
              >
            </div>
          </div>
          <transition :name="pageTrans" mode="out-in">
            <router-view ref="pageContent" />
          </transition>
        </q-page-container>
      </div>
    </q-pull-to-refresh>

    <q-dialog
      :value="oldVersionRunning"
      transition-show="fade"
      transition-hide="fade"
      persistent
      class="z-top"
    >
      <q-card class="bg-dark text-white">
        <q-toolbar>
          <q-toolbar-title>
            <q-icon name="info_outline" class="q-mr-sm" size="sm" />
            <span>Neue Version verfügbar</span>
          </q-toolbar-title>
          <!-- <q-btn icon="close" flat round dense v-close-popup /> -->
        </q-toolbar>

        <q-card-section
          >Bitte starte die App neu, damit die neue Version fertig geladen
          werden kann.</q-card-section
        >
        <q-card-actions align="around" class="q-mt-sm">
          <!-- <q-btn flat color="white" label="Später" @click="hideUpdateField = true" /> -->
          <q-btn color="primary" label="Ok, neu laden" @click="reloadPage" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-footer elevated v-show="!scannerOpen">
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
        class="text-grey-10 bg-white text-weight-light"
        align="center"
      >
        <q-route-tab exact to="/" replace>
          <q-icon name="home" size="sm" />Marktplatz
        </q-route-tab>
        <q-route-tab to="/add-lift" replace>
          <q-icon name="add_circle_outline" size="sm" />Anbieten
        </q-route-tab>
        <q-route-tab to="/chats" replace>
          <q-icon name="directions_car" size="sm" />Fahrten
        </q-route-tab>
        <q-route-tab to="/profil">
          <q-icon name="account_box" size="sm" />
          <!-- <q-avatar v-else size="sm">
            <q-img class="rounded-borders" :src="profilePictureUrl" />
          </q-avatar>-->
          Profil
        </q-route-tab>
      </q-tabs>
      <BottomSpaceForiOS />
    </q-footer>
  </q-layout>
</template>

<script>
import QrScanner from "components/QrScanner";

import EssentialLink from "components/EssentialLink";
import DrawerWelcomeImage from "components/DrawerWelcomeImage";
import ExtHr from "components/ExtendedHr";
import ConfirmDialog from "components/dialogs/Confirm";
import BottomSpaceForiOS from "components/BottomSpaceForiOS";

import {
  sendApiRequest,
  GET_NEWSTICKER,
  buildGetRequestUrl,
  GET_USER_PROFILE_PIC
} from "../ApiAccess";
import { defineComponent } from "vue";

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
    QrScanner,
    DrawerWelcomeImage,
    ExtHr,
    BottomSpaceForiOS
  },

  data() {
    return {
      greeting: this.$store.state.greeting,
      newsticker: null,
      leftDrawerOpen: false,
      pageTransY: 15,
      scannerOpen: false,
      scrolled: false,
      tab: "home",
      chats: "Main",
      show: true,
      liftQrId: null,
      refreshErr: null,
      hideUpdateField: false,
      profilePictureUrl: null
    };
  },

  computed: {
    username() {
      return this.$store.getters["auth/user"].name.split(" ")[0];
    },

    loadingScreenVisible() {
      return !this.$store.getters["auth/signinLoaded"];
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
      const reloadWithoutPrompt = true;

      var old = this.$store.state.oldVersionRunning,
        isDev = process.env.DEV;
      if (old && (reloadWithoutPrompt ? true : isDev)) {
        this.reloadPage();
        return false;
      } else return old;
    },

    isDev() {
      return process.env.DEV;
    },

    navigationLinks() {
      return [
        {
          title: "Hauptseiten",
          links: [
            {
              title: "Marktplatz",
              caption: "Zur Übersicht",
              icon: "home",
              link: "/#/"
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
              link: "/#/hilfe"
            }
          ]
        },
        {
          title: "Rechtliches",
          links: [
            {
              title: "AGB",
              caption: "Unsere Nutzungsbedingungen",
              icon: "format_list_numbered",
              link: "/#/rechtliches?view=agb"
            },
            {
              title: "Datenschutz",
              caption: "Was mit deinen Daten passiert",
              icon: "verified_user",
              link: "/#/rechtliches?view=datenschutz"
            } /* ,
          {
            title: "Impressum",
            caption: "Muss auch sein",
            icon: "policy",
            link: "/#/rechtliches"
          } */
          ]
        },
        {
          title: "BETA-Bereich",
          links: [
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
              link: "/#/spielwiese",
              onlyDev: true
            }
          ]
        }
      ];
    }
  },

  methods: {
    reloadPage() {
      location.reload();
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
        .catch(response => {
          this.refreshErr = response;
        })
        .finally(done); // stop showing the refresh icon
    },

    refreshAgain() {
      this.refreshErr = null;
      this.$refs.refresher.trigger();
    },

    scannerSwiped(e) {
      alert(e);
    },

    scrollHandler(info) {
      this.scrolled = !this.scannerOpen ? info.position > 30 : false;
    },

    goBack() {
      this.$router.go(-1);
    },

    askAndReadClipboard(e) {
      var duration = e ? e.duration : null, // makes duration handling possible
        clipboard = navigator.clipboard;
      return new Promise((res, rej) => {
        if (!clipboard) rej("No clipboard");
        else
          clipboard
            .readText()
            .then(content => {
              content = content.trim();
              if (!this.isClipboardValid(content)) {
                res("");
              } else {
                content = content.replaceAll("$", "#"); // resetting the workaround needed on mobile phones

                this.$q
                  .dialog({
                    component: ConfirmDialog,
                    parent: this,
                    cancelLabel: "Egal, scannen",
                    okLabel: "Ok, übernehmen",
                    title: "Daten gefunden",
                    message: `StudiCar hat passende Daten in deiner Zwischenablage gefunden. Daten übernehmen oder
                    trotzdem einen StudiCar Code scannen?`,
                    persistent: true,
                    animation: "fade",
                    details:
                      content.length > 1000
                        ? content.substr(0, 1000) + "..."
                        : content
                  })
                  .onOk(() => {
                    res(content);
                  })
                  .onCancel(() => {
                    res(""); // when no confirm, return empty string
                  })
                  .onDismiss(() => {
                    // console.log('I am triggered on both OK and Cancel')
                  });
              }
            })
            .catch(err => {
              rej(err);
            });
      });
    },

    isClipboardValid(text) {
      var conditions = [
        text.length > 10,
        text.startsWith("https://" + window.location.hostname)
      ];
      return conditions.every(item => item == true);
    },

    gotScanResult(e) {
      this.scannerOpen = false;
      switch (e.type) {
        case "u":
          window.location.href = "#/benutzerinfo?userFbId=" + e.res;
          break;
        case "l": {
          var suffix = "";
          if (window.location.href.includes(e.res))
            suffix = "#" + Math.random().toFixed(5); // when already a qrLift is shown:
          window.location.href = "#/?qrLiftData=" + e.res + suffix;
          break;
        }
      }
    },

    closeScanner(e) {
      if (e.direction == "up") {
        this.scannerOpen = false;
        setTimeout(() => window.scrollTo(0, 0), 300);
      }
    },

    async toggleScannerOpen() {
      // first check whether clipboard contains data to be processed
      var clipboardContent;
      if (!this.scannerOpen)
        clipboardContent = await this.askAndReadClipboard().catch(err => {
          var isDomException = (err + "").includes("NotAllowedError");

          this.$q.notify({
            type: "negative",
            message: "Zwischenablage blockiert",
            caption: isDomException
              ? "Bitte sieh in den FAQ nach, wir haben dafür eine Lösung veröffentlicht."
              : "StudiCar kann aus irgendeinem Grund keine Daten aus der Zwischenablage laden: " +
                err
          });
          setTimeout(_ => {
            this.scannerOpen = false;
            this.$q.notify({
              type: "info",
              message: "Kamera geschlossen",
              caption:
                "StudiCar hat den Scanner wieder geschlossen, weil wie gesagt der Zugriff auf die Kamera geblockt ist"
            });
          }, 500);
        });
      if (clipboardContent) {
        if (clipboardContent.includes("/#/"))
          clipboardContent = clipboardContent.split("/#/")[1];
        if (clipboardContent.includes("#i")) {
          window.location.href = "#/"; // when detecting a lift, first go to marketplace
        }
        await new Promise(res => {
          setTimeout(res, 200); // has to wait until site has been changed, 200ms should be enough
        });
        this.$router.replace(clipboardContent).catch(_ => {});
      } else {
        this.scannerOpen = !this.scannerOpen;
        if (this.scannerOpen) {
          this.leftDrawerOpen = false;
        }
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

  created() {
    this.$q.addressbarColor.set();
  },

  mounted() {
    setTimeout(this.reloadNews, 50); // simple call was buggy, no idea why
    var user = this.$store.getters["auth/user"];
    if (!user) location.reload();
    // bug: when other user first signs in, no data are displayed. Reloading is then the second sign-in and everything is working properly
    else
      (async _ => {
        this.profilePictureUrl = await buildGetRequestUrl(
          GET_USER_PROFILE_PIC,
          { fbid: user.uid }
        );
      })();
  }
});
</script>
