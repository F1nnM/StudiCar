<template>
  <q-btn
    color="white"
    no-caps
    icon="exit_to_app"
    text-color="black"
    label="Abmelden"
    @click="signOut()"
  />
</template>

<script>
export default {
  name: "SignOutButton",
  methods: {
    signOut() {
      this.$store.dispatch("auth/signOut");
    },
  },
};
</script>

<style scoped>
</style>