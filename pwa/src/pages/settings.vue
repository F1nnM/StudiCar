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
            <q-item-label
              caption
            >Wenn du keine Benachrichtigungen erhältst, musst du sie eventuell erst erlauben.</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon v-if="notificationTestPassed" name="done" color="positive" />
            <q-btn v-else label="Test" outline @click="testNotification" />
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
              <span
                v-if="askAgainWhenAppreciatingNewPassenger"
              >Im Moment musst du bestätigen, wenn du jemanden in eine Fahrgemeinschaft aufnimmst</span>
              <span v-else>Im Moment kannst du Anfragen mit einem Tippen direkt annehmen</span>
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

      
<script>
import SignOutButton from "components/SignOutButton";

export default {
  data() {
    return {
      notificationTestRunning: false,
      notificationTestPassed: false
    };
  },
  components: {
    SignOutButton
  },
  computed: {
    allSettings() {
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
    },
    test: {
      get() {
        return true;
      },
      set(value) {
        alert("New value: " + value);
      }
    },
    dataSaver: {
      get() {
        return this.$store.dataSaver;
      },
      set(value) {
        this.$store.dispatch("dataSaver", value);
      }
    },

    askAgainWhenAppreciatingNewPassenger: {
      get() {
        return this.$store.state.settings.askAgainWhenAppreciatingNewPassenger;
      },
      set(value) {
        this.$store.commit("setAskAgainWhenAppreciatingNewPassenger", value);
      }
    },

    enablePostillonNewsFeed: {
      get() {
        return this.$store.state.settings.enablePostillonNewsFeed;
      },
      set(value) {
        this.$store.commit("setEnablePostillonNewsFeed", value);
      }
    }
  },
  methods: {
    changeComputedProp(setterProp) {
      this[setterProp] = !this[setterProp];
    },

    getValueOfProp(prop) {
      return this[prop];
    },

    async testNotification() {
      this.notificationTestRunning = true;
      navigator.serviceWorker.ready.then(registration => {
        this.makeNotification(registration).catch(_ => {
          // perms have to be granted first

          this.requestNotificationPermission()
            .then(_ => {
              // finally granted

              this.makeNotification(registration).then(
                _ => (this.notificationTestPassed = true)
              );
            })
            .catch(_ => {
              alert(
                `Bitte starte den Test erneut und akzeptiere dann die Anfrage. Wenn keine Anfrage kommt,
                kann es sein, dass die Website schon blockiert wurde, in diesem Fall musst du das über 
                die Browser-Einstellungen rückgängig machen.`
              );
            });
        });
      });
    },

    async requestNotificationPermission() {
      return new Promise((res, rej) => {
        Notification.requestPermission(function(result) {
          if (result === "granted") res();
          else rej();
        });
      });
    },

    async makeNotification(reg) {
      return new Promise(function(res, rej) {
        reg
          .showNotification("StudiCar Test", {
            body: "Testbenachrichtigung",
            icon: "https://cdn.quasar.dev/logo/svg/quasar-logo.svg",
            // vibrate: [200, 100, 200, 100, 200, 100, 200],
            tag: "studicar-test-notification"
          })
          .catch(rej)
          .then(res);
      });
    }
  },
  mounted() {
    this.$store.commit("setPage", {
      name: "Einstellungen"
    });

    navigator.serviceWorker.onnotificationclick = notifEvent => {
      notifEvent.notification.close();

      if (this.notificationTestRunning) this.notificationTestPassed = true;
    };
  }
};
</script>