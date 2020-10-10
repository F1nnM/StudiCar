<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md" style="max-width: 600px">
      <p>Mach dir deine App so, wie du sie willst.</p>
      <q-list>
        <q-item-label header>Account</q-item-label>
        <q-item>
          <SignOutButton class="q-ma-sm full-width" />
        </q-item>
        <q-item-label header>Datennutzung</q-item-label>
        <q-item disable>
          <q-checkbox v-model="dataSaver" label="Datennutzung vermindern" />
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
  },
  mounted() {
    this.$store.commit("setPage", "Einstellungen");
    this.$store.commit("setPageTrans", "slide");
  },
};
</script>