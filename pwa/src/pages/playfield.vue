<template>
  <div class="q-pa-md">
    <q-btn label="Feuer" @click="go" />
    <q-btn label="Bernd" @click="pushTest('Bernd')" />
    <q-btn label="der andere Bernd" @click="pushTest('Bernd2')" />
    <q-btn label="Finn" @click="pushTest('Finn')" />
    <q-btn label="All in Lift" @click="notifyTest()" />

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
  TEST_PUSH,
  NOTIFY_USERS_IN_LIFT
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
        err => {
          throw err;
        }
      );
    },

    pushTest(code) {
      var uid = "";
      switch (code) {
        case "Bernd":
          uid = "wG3cG4M7NFMJzJYcreFjLrJC9Q23";
          break;
        case "Bernd2":
          uid = "9V2F272TmUV6EMIl9bJHHZW5tPE2";
          break;
        case "Finn":
          uid = "QTs2vuk6O0RHjr8uDyLBwb9DZ5G3";
          break;
      }
      sendApiRequest(
        TEST_PUSH,
        {
          receiverFbId: uid,
          title: "Heyho",
          message: "Von jemandem an " + code
        },
        _ => {},
        _ => {}
      );
    },

    notifyTest() {
      sendApiRequest(NOTIFY_USERS_IN_LIFT, {
        liftId: 51091511115776,
        title: "Hey Leute",
        message: "Bernd hat euch was zu sagen"
      });
    }
  },

  mounted() {
    this.$store.commit("setPage", "Spielwiese");
  }
};
</script>

<style lang="scss" scoped></style>
