<template>
  <q-page class="flex flex-center">
    <p>{{JSON.stringify(Firebase.auth().currentUser)}}</p>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: 'verifyEmail'
});
</script>
