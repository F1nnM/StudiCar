<template>
  <div class="q-pa-md">
    <q-btn label="Feuer" @click="go" />
    <div v-if="lift">
      <LiftOffer :lift="lift" />
      <p>username: {{ name }}</p>
    </div>

    <p v-for="n in 20" :key="n">Lorem</p>
  </div>
</template>

<script>
import { scroll } from "quasar";
import ConfirmDialog from "components/dialogs/Confirm";
import LiftOffer from "components/LiftOffer";

import { sendApiRequest, PING, SQL_GET_MARKETPLACE_OFFER } from "../ApiAccess";

export default {
  components: {
    LiftOffer
  },
  data() {
    return {
      lift: null,
      name: "",
      err: null
    };
  },
  computed: {},
  methods: {
    go() {
      var uid = "wG3cG4M7NFMJzJYcreFjLrJC9Q23";
      uid += "a";
      sendApiRequest(
        PING,
        {},
        data => {},
        err => {}
      );
    }
  },

  mounted() {
    this.$store.commit("setPage", "Spielwiese");
  }
};
</script>

<style lang="scss" scoped>
</style>