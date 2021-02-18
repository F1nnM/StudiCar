<template>
  <div class="q-pa-md">
    <q-btn label="Feuer" @click="go" />
    <q-avatar>
      <div class="relative-position">
        <q-icon class="absolute absolute-center" size="sm" name="favorite" color="grey-5" />
        <q-icon class="absolute absolute-center" size="sm" name="favorite" color="positive" />
      </div>
    </q-avatar>

    <p v-for="n in 20" :key="n">Lorem</p>
  </div>
</template>

<script>
import { scroll } from "quasar";
import ConfirmDialog from "components/dialogs/Confirm";
import LiftOffer from "components/LiftOffer";

import { sendApiRequest, PING, SQL_GET_MARKETPLACE_OFFER } from "../ApiAccess";

export default {
  components: {},
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