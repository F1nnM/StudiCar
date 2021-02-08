<template>
  <div class="q-pa-md">
    <q-btn label="Feuer" @click="go" />

    <p v-for="n in 20" :key="n">Lorem</p>
  </div>
</template>

<script>
import { scroll } from "quasar";
import ConfirmDialog from "components/dialogs/Confirm";

import { sendApiRequest, PING } from "../ApiAccess";

export default {
  components: {},
  data() {
    return {};
  },
  computed: {},
  methods: {
    go() {
      this.$q
        .dialog({
          component: ConfirmDialog,
          parent: this,
          cancelLabel: "Nein, scannen",
          okLabel: "Ok, übernehmen",
          title: "Daten gefunden",
          message: "StudiCar hat Daten in deiner Zwischenablage gefunden",
          persistent: true
        })
        .onOk(() => {
          alert("ok");
        })
        .onCancel(() => {
          alert("damn");
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    }
  },

  mounted() {
    this.$store.commit("setPage", "Spielwiese");
  }
};
</script>

<style lang="scss" scoped>
</style>