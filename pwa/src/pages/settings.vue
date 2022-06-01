<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md">
      <q-list>
        <q-item-label header>System &amp; Account</q-item-label>
        <q-item>
          <SignOutButton class="q-ma-sm full-width" />
        </q-item>
        <q-item tag="label">
          <q-item-section avatar>
            <q-icon name="notifications_none" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Benachrichtigungen testen</q-item-label>
            <q-item-label caption
              >Wenn du von StudiCar keine Benachrichtigungen erhältst, musst du
              den Zugriff eventuell erst erlauben.</q-item-label
            >
          </q-item-section>
          <q-item-section side>
            <q-icon
              v-if="notificationTestPassed"
              name="done"
              color="positive"
            />
            <q-btn v-else label="Test" outline @click="testNotification" />
          </q-item-section>
        </q-item>
        <q-item tag="label">
          <q-item-section avatar>
            <q-icon name="content_paste" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Zugriff auf die Zwischenablage</q-item-label>
            <q-item-label caption
              >Wenn der StudiCar Scanner die Zwischenablage nicht lesen kann,
              musst du den Zugriff eventuell erst erlauben.</q-item-label
            >
          </q-item-section>
          <q-item-section side>
            <q-icon v-if="clipboardTestPassed" name="done" color="positive" />
            <q-btn v-else label="Test" outline @click="testClipboardAccess" />
          </q-item-section>
        </q-item>
        <!-- <q-item-label header>Datennutzung</q-item-label>
        <q-item tag="label">
          <q-item-section avatar>
            <q-toggle v-model="dataSaver" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Datennutzung vermindern</q-item-label>
            <q-item-label caption>
              <span
                v-if="dataSaver"
              >Im Moment werden nur notwendige Daten geladen, schont den Datenverbrauch</span>
              <span
                v-else
              >Im Moment werden alle Daten geladen, bewirkt eine schönere Nutzeroberfläche</span>
            </q-item-label>
          </q-item-section>
        </q-item>-->
        <q-item-label header>Anfragen</q-item-label>
        <q-item tag="label">
          <q-item-section avatar>
            <q-toggle v-model="askAgainWhenAppreciatingNewPassenger" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Eingehende Anfragen bestätigen</q-item-label>
            <q-item-label caption>
              <span v-if="askAgainWhenAppreciatingNewPassenger"
                >Im Moment musst du bestätigen, wenn du jemanden in eine
                Fahrgemeinschaft aufnimmst</span
              >
              <span v-else
                >Im Moment kannst du Anfragen mit einem Tippen direkt
                annehmen</span
              >
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from 'src/stores/app';
import { useUserStore } from 'src/stores/user';
import { onMounted } from 'vue';

let notificationTestRunning = false;
let notificationTestPassed = false;
let clipboardTestPassed = false;

const appStore = useAppStore();
const userStore = useUserStore();

const allSettings = computed(() => {
  return {
    /* {
          title: "Ticker vom Postillon anzeigen",
          enabledText:
            "Im Moment wird der Ticker vom Postillon in der Seitenansicht angezeigt",
          disabledText:
            "Im Moment wird kein Ticker vom Postillon in der Seitenansicht angezeigt",
          setterProp: "enablePostillonNewsFeed",
        }, */
  };
});

const test = computed({
  get() {
    return true;
  },
  set(value) {
    alert('New value: ' + value);
  },
});

const dataSaver = computed({
  get() {
    return appStore.dataSaver;
  },
  set(value) {
    appStore.setDataSaver(value);
  },
});

const askAgainWhenAppreciatingNewPassenger = computed({
  get() {
    return appStore.askAgainWhenAppreciatingNewPassenger;
  },
  set(value) {
    appStore.setAskAgainWhenAppreciatingNewPassenger(value);
  },
});

const enablePostillonNewsFeed = computed({
  get() {
    return appStore.enablePostillonNewsFeed;
  },
  set(value) {
    appStore.setEnablePostillonNewsFeed(value);
  },
});

function changeComputedProp(setterProp) {
  this[setterProp] = !this[setterProp];
}

function getValueOfProp(prop) {
  return this[prop];
}

async function testNotification() {
  notificationTestRunning = true;
  $q.dialog({
    cancel: true,
    persistent: true,
    title: 'Testablauf',
    message: `Wenn du den Test startest, senden wir dir über den Server eine Nachricht. Wenn du keine Benachrichtigung
              kriegen solltest, dann schau in den FAQ nach, woran es liegen könnte.`,
  }).onOk(() => {
    userStore.testPushNotification();
  });
}

async function testClipboardAccess() {
  try {
    var board = navigator.clipboard;
    if (!board) throw Error;
    board
      .readText()
      .then(() => {
        clipboardTestPassed = true;
        $q.dialog({
          title: 'Test erfolgreich',
          message: `StudiCar hat Zugriff auf deine Zwischenablage.
            Jetzt kannst du Inhalte daraus über den StudiCar Scanner verarbeiten lassen.`,
        });
      })
      .catch((err) => {
        $q.notify({
          type: 'Zugriff verweigert',
          message: `Bitte erlaube den Zugriff auf die Zwischenablage, wenn danach gefragt wird
              und stelle in den Einstellungen sicher, dass du den Zugriff nicht bereits blockiert hast.`,
        });
      });
  } catch (e) {
    $q.notify({
      type: 'Test fehlgeschlagen',
      message:
        'Ein ungewöhnlicher Fehler ist aufgetreten, bitte melde dich beim Support',
    });
  }
}

onMounted(() => {
  appStore.setPage({
    name: 'Einstellungen',
  });

  navigator.serviceWorker.onnotificationclick = (notifEvent) => {
    notifEvent.notification.close();

    if (notificationTestRunning) notificationTestPassed = true;
  };
});
</script>
