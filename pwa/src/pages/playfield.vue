<template>
  <div class="q-pa-md">
    <q-btn label="Feuer" @click="go" />
    <span v-for="n in 20" :key="-n">Hier steht dann eine ganze Menge Test</span>

    <span v-for="n in 20" :key="n">Hier steht dann eine ganze Menge Test</span>

    <p v-for="n in 20" :key="'1000' + n">Lorem</p>
  </div>
</template>

<script>
import { scroll } from "quasar";

import {
  sendApiRequest,
  PING,
  SQL_GET_MARKETPLACE_OFFER,
  TEST_PUSH
} from "../ApiAccess";

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
        TEST_PUSH,
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

<style lang="scss" scoped></style>
