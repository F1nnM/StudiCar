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
            @click="toggleDrawer"
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
                        @click="hideUpdate"
                        dense
                        v-if="appStore.oldVersionRunning && hideUpdateField"
                        color="deep-orange"
                        text-color="white"
                        icon="new_releases"
                        >ältere Version</q-chip
                      >
                      <!-- {{ appStore.pageTrans }} -->
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
                  >{{ appStore.navTitle || appStore.pageName }}</q-tab-panel
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
      <DrawerWelcomeImage :caption="newsticker || 'Ticker wird geladen...'" />
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
      <ExtendedHr color="grey-7" size="xs" />
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
          <div v-if="appStore.pageName">
            <q-scroll-observer @scroll="scrollHandler" />

            <div class="q-py-md" v-if="!appStore.titleOnlyInNav">
              <!-- <q-btn
                flat
                color="dark"
                dense
                size="md"
                class="q-ml-sm q-mb-sm"
                @click="() => $router.go(-1)"
              >
                <span class="text-h4 font-weight-light">‹</span>
              </q-btn> -->
              <span
                class="text-h5 custom-underline q-ml-md c-u-l c-u-2 c-u-md"
                >{{ appStore.pageName }}</span
              >
            </div>
          </div>
          <router-view v-slot="{ Component }" ref="pageContent">
            <transition :name="appStore.pageTrans" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </q-page-container>
      </div>
    </q-pull-to-refresh>

    <q-dialog
      :value="appStore.oldVersionRunning"
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
              <q-btn flat color="white" label="Ok" @click="clearError" />
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
          Profil
        </q-route-tab>
      </q-tabs>
      <BottomSpaceForiOS />
    </q-footer>
  </q-layout>
</template>

<script setup>
import { useAppStore } from 'src/stores/app';
import { useUserStore } from 'src/stores/user';
import {
  sendApiRequest,
  GET_NEWSTICKER,
} from '../utils/ApiAccess';

const userStore = useUserStore();
const appStore = useAppStore();

const $q = useQuasar();

const $router = useRouter();

let isDev = process.env.DEV;

const scannerOpen = ref(false);
const scrolled = ref(false);
const refreshErr = ref(null);
const hideUpdateField = ref(false);
const leftDrawerOpen = ref(false);
const newsticker = ref(null);

function clearError() {
  refreshErr.value = null
}
function toggleDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
function hideUpdate() {
  hideUpdateField.value = false
}

const navigationLinks = [
  {
    title: 'Hauptseiten',
    links: [
      {
        title: 'Marktplatz',
        caption: 'Zur Übersicht',
        icon: 'home',
        link: '/#/',
      },
      {
        title: 'Team',
        caption: 'Wer hinter dem Projekt steckt',
        icon: 'emoji_people',
        link: '/#/das-team',
      },
      {
        title: 'Support',
        caption: 'Wie können wir dir helfen?',
        icon: 'accessibility_new',
        link: '/#/hilfe',
      },
    ],
  },
  {
    title: 'Rechtliches',
    links: [
      {
        title: 'AGB',
        caption: 'Unsere Nutzungsbedingungen',
        icon: 'format_list_numbered',
        link: '/#/rechtliches?view=agb',
      },
      {
        title: 'Datenschutz',
        caption: 'Was mit deinen Daten passiert',
        icon: 'verified_user',
        link: '/#/rechtliches?view=datenschutz',
      } /* ,
          {
            title: "Impressum",
            caption: "Muss auch sein",
            icon: "policy",
            link: "/#/rechtliches"
          } */,
    ],
  },
  {
    title: 'BETA-Bereich',
    links: [
      {
        title: 'Einstellungen',
        caption: 'Personalisiere die App',
        icon: 'settings',
        link: '/#/einstellungen',
      },
      {
        title: 'Spielwiese',
        caption: 'Endlich wieder Kind sein',
        icon: 'toys',
        link: '/#/spielwiese',
        onlyDev: true,
      },
    ],
  },
];

let reloadPage = () => {
  location.reload();
};

let refresh = async (done) => {
  new Promise((res, rej) => {
    try {
      $refs.pageContent.refreshContent(res, rej);
    } catch (e) {
      rej(e);
    }
  })
    .then()
    .catch((response) => {
      refreshErr.value = response;
    })
    .finally(done); // stop showing the refresh icon
};

let refreshAgain = () => {
  refreshErr.value = null;
  refresh();
};

let scrollHandler = (info) => {
  scrolled.value = !scannerOpen.value ? info.position > 30 : false;
};

let askAndReadClipboard = () => {
  const clipboard = navigator.clipboard;
  return new Promise((res, rej) => {
    if (!clipboard) rej('No clipboard');
    else
      clipboard
        .readText()
        .then((content) => {
          content = content.trim();
          if (!isClipboardValid(content)) {
            res('');
          } else {
            content = content.replaceAll('$', '#'); // resetting the workaround needed on mobile phones

            $q.dialog({
              component: ConfirmDialog,
              parent: this,
              cancelLabel: 'Egal, scannen',
              okLabel: 'Ok, übernehmen',
              title: 'Daten gefunden',
              message: `StudiCar hat passende Daten in deiner Zwischenablage gefunden. Daten übernehmen oder
                    trotzdem einen StudiCar Code scannen?`,
              persistent: true,
              animation: 'fade',
              details:
                content.length > 1000
                  ? content.substr(0, 1000) + '...'
                  : content,
            })
              .onOk(() => {
                res(content);
              })
              .onCancel(() => {
                res(''); // when no confirm, return empty string
              })
              .onDismiss(() => {
                // console.log('I am triggered on both OK and Cancel')
              });
          }
        })
        .catch((err) => {
          rej(err);
        });
  });
};

let isClipboardValid = (text) => {
  var conditions = [
    text.length > 10,
    text.startsWith('https://' + window.location.hostname),
  ];
  return conditions.every((item) => item == true);
};

let gotScanResult = (e) => {
  scannerOpen.value = false;
  switch (e.type) {
    case 'u':
      window.location.href = '#/benutzerinfo?userFbId=' + e.res;
      break;
    case 'l': {
      var suffix = '';
      if (window.location.href.includes(e.res))
        suffix = '#' + Math.random().toFixed(5); // when already a qrLift is shown:
      window.location.href = '#/?qrLiftData=' + e.res + suffix;
      break;
    }
  }
};

let closeScanner = (e) => {
  if (e.direction == 'up') {
    scannerOpen.value = false;
    setTimeout(() => window.scrollTo(0, 0), 300);
  }
};

let toggleScannerOpen = async () => {
  // first check whether clipboard contains data to be processed
  var clipboardContent;
  if (!scannerOpen.value)
    clipboardContent = await askAndReadClipboard().catch((err) => {
      var isDomException = (err + '').includes('NotAllowedError');

      $q.notify({
        type: 'negative',
        message: 'Zwischenablage blockiert',
        caption: isDomException
          ? 'Bitte sieh in den FAQ nach, wir haben dafür eine Lösung veröffentlicht.'
          : 'StudiCar kann aus irgendeinem Grund keine Daten aus der Zwischenablage laden: ' +
            err,
      });
      setTimeout(() => {
        scannerOpen.value = false;
        $q.notify({
          type: 'info',
          message: 'Kamera geschlossen',
          caption:
            'StudiCar hat den Scanner wieder geschlossen, weil der Zugriff auf die Kamera geblockt ist',
        });
      }, 500);
    });
  if (clipboardContent) {
    if (clipboardContent.includes('/#/'))
      clipboardContent = clipboardContent.split('/#/')[1];
    if (clipboardContent.includes('#i')) {
      window.location.href = '#/'; // when detecting a lift, first go to marketplace
    }
    await new Promise((res) => {
      setTimeout(res, 200); // has to wait until site has been changed, 200ms should be enough
    });
    $router.replace(clipboardContent);
  } else {
    scannerOpen.value = !scannerOpen.value;
    if (scannerOpen.value) {
      leftDrawerOpen.value = false;
    }
  }
};

let scannerHelpNeeded = () => {
  scannerOpen.value = false;
};

let reloadNews = () => {
  sendApiRequest(GET_NEWSTICKER, {})
    .then((data) => {
      newsticker.value = data.ticker;
    })
    .catch((err) => {
      console.warn(err);
      newsticker.value = 'Fehler aufgetreten';
    });
};

onMounted(() => {
  setTimeout(reloadNews, 50); // simple call was buggy, no idea why
  if (!userStore.user) location.reload();
  // bug: when other user first signs in, no data are displayed. Reloading is then the second sign-in and everything is working properly
});

$q.addressbarColor.set();
</script>
