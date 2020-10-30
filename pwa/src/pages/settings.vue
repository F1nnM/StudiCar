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
    return {};
  },
  components: {
    SignOutButton,
  },
  computed: {
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
  },
  mounted() {
    this.$store.commit("setPage", "Einstellungen");
    this.$store.commit("setPageTrans", "slide");
  },
};
</script>