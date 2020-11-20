<template>
  <div class="q-pa-md">
    <q-btn label="Feuer" @click="go" />
    <q-btn label="Variablenfeuer" @click="open = !open" />

    <p v-for="n in 20" :key="n">Lorem</p>
  </div>
</template>

<script>
import { scroll } from "quasar";
/* import ExpansionLiftTimeline from "components/ExpansionLiftTimeline"; */

import { sendApiRequest } from "../ApiAccess";

export default {
  components: {
    
  },
  data() {
    return {
      open: true,
      value: "one",
    };
  },
  computed: {},
  methods: {
    go() {
      navigator.geolocation.getCurrentPosition(pos=> {
        var apiUrl = `https://geocode.xyz/${pos.coords.latitude},${pos.coords.longitude}?json=1`
        this.$axios.get(apiUrl).then(result => {
          var obj = {
            city: result.data.city,
            type: result.data.osmtags.name_prefix,
            postcode: result.data.poi.addr_postcode
          }
        })
      })
    },
  },

  mounted() {
    this.$store.commit("setPage", "Spielwiese");
  },
};
</script>

<style lang="scss" scoped>
</style>