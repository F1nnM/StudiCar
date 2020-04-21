<template>
  <q-btn color="white" text-color="black" label="Abmelden" @click="signOut()"/>
</template>

<script>
export default {
  name: 'SignOutButton',
  methods: {
    signOut() {
      this.$store.dispatch('auth/signOut');
    }
  }
}
</script>

<style scoped>

</style>