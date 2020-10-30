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