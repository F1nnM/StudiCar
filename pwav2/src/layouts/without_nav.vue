<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>StudiCar Authentifizierung</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <GetUserDataLoading persistent v-model="loadingScreenVisible" />
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import GetUserDataLoading from "components/GetUserDataLoading";
import { defineComponent } from "vue";

export default defineComponent({
  name: "without_nav",
  components: { GetUserDataLoading },
  computed: {
    loadingScreenVisible() {
      return !this.$store.getters["auth/signinLoaded"];
    }
  }
});
</script>

<style scoped>
</style>
