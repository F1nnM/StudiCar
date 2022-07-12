<template>
  <div class="q-pl-lg">
    <q-btn
      color="white"
      no-caps
      outline
      icon="exit_to_app"
      text-color="black"
      label="Abmelden"
      @click="signOut()"
    />
  </div>
</template>

<script setup>
import { useUserStore } from 'src/stores/user';

const userStore = useUserStore();
function signOut() {
  userStore.signOut();
}
</script>

<style scoped></style>
