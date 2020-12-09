<template>
  <q-page class="flex flex-center">
    <p>{{JSON.stringify(Firebase.auth().currentUser)}}</p>
  </q-page>
</template>

<script>
export default {
  name: 'verifyEmail'
}
</script>
