<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>StudiCar Authentifizierung</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <GetUserDataLoading persistent :open="loadingScreenVisible" />
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useUserStore } from 'src/stores/user';

const userStore = useUserStore();
const loadingScreenVisible = computed(() => {
  return !userStore.loggedIn;
});
</script>

<style scoped></style>
