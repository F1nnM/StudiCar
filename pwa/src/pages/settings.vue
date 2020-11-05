<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md">
      <q-list>
        <q-item-label header>Account</q-item-label>
        <q-item>
          <SignOutButton class="q-ma-sm full-width" />
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
        <q-item tag="label" v-for="item in allSettings" :key="item.title">
          <q-item-section avatar>
            <q-toggle
              :value="getValueOfProp(item.setterProp)"
              @input="changeComputedProp(item.setterProp)"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ item.title }}</q-item-label>
            <q-item-label caption>
              <span v-if="item.computedProp">{{ item.enabledText }}</span>
              <span v-else>{{ item.disabledText }}</span>
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
    return {};
  },
  components: {
    SignOutButton,
  },
  computed: {
    allSettings() {
      return [
        {
          title: "Eingehende Anfragen bestätigen",
          enabledText:
            "Im Moment musst du bestätigen, wenn du jemanden in eine Fahrgemeinschaft aufnimmst",
          disabledText:
            "Im Moment kannst du Anfragen mit einem Tippen direkt annehmen",
          setterProp: "askAgainWhenAppreciatingNewPassenger",
        },
        {
          title: "Ticker vom Postillon anzeigen",
          enabledText:
            "Im Moment wird der Ticker vom Postillon in der Seitenansicht angezeigt",
          disabledText:
            "Im Moment wird kein Ticker vom Postillon in der Seitenansicht angezeigt",
          setterProp: "enablePostillonNewsFeed",
        },
      ];
    },
    test: {
      get() {
        return true;
      },
      set(value) {
        alert("New value: " + value);
      },
    },
    dataSaver: {
      get() {
        return this.$store.dataSaver;
      },
      set(value) {
        this.$store.dispatch("dataSaver", value);
      },
    },

    askAgainWhenAppreciatingNewPassenger: {
      get() {
        return this.$store.state.settings.askAgainWhenAppreciatingNewPassenger;
      },
      set(value) {
        this.$store.commit("setAskAgainWhenAppreciatingNewPassenger", value);
      },
    },

    enablePostillonNewsFeed: {
      get() {
        return this.$store.state.settings.enablePostillonNewsFeed;
      },
      set(value) {
        this.$store.commit("setEnablePostillonNewsFeed", value);
      },
    },
  },
  methods: {
    changeComputedProp(setterProp) {
      this[setterProp] = !this[setterProp];
    },

    getValueOfProp(prop) {
      return this[prop];
    },
  },
  mounted() {
    this.$store.commit("setPage", "Einstellungen");
    this.$store.commit("setPageTrans", "slide");
  },
};
</script>