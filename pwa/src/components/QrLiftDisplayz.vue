<template>
  <q-dialog :value="!!value" @input="emit" full-width square position="bottom">
    <q-card>
      <q-card-section>
        <div v-if="lift">
          <p class="text-subtitle1">Du wurdest zu dieser Fahrgelegenheit eingeladen:</p>
          <p
            v-if="lift.requested"
            class="text-caption text-red"
          >Du hast hier schon angefragt, Antwort steht noch aus</p>
          <LiftOffer :lift="lift" />
        </div>
        <div v-else>
          <q-item>
            <q-item-section avatar>
              <q-circular-progress indeterminate size="lg" color="primary" class="q-ma-md" />
            </q-item-section>
            <q-item-section>
              <p class="text-subtitle1">Daten werden geladen</p>
            </q-item-section>
          </q-item>
        </div>
        <div v-if="err">
          <p class="text-red text-caption">Ein Fehler ist aufgetreten: {{ err }}</p>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { date } from "quasar";
import ExtHR from "components/ExtendedHr";
import LiftOffer from "components/LiftOffer";
import { sendApiRequest, SQL_GET_LIFT_INFO } from "../ApiAccess";

export default {
  name: "QRLiftDisplay",
  components: {
    LiftOffer,
  },
  props: {
    value: String,
  },
  data() {
    return {
      viewTab: "info",
      lift: null,
      err: null,
    };
  },
  watch: {
    value: function (val) {
      /* sendApiRequest(
          SQL_GET_LIFT_INFO,
          {
            qrId: val, // here comes the scanned qr content without the type letter, is encrypted lift id
          },
          (lift_) => {
            this.lift = lift_;
          },
          (err_) => {
            this.err = err_;
          }
        ); */
      if (val) {
        const allLifts = this.$store.getters["auth/user"].marketplaceOffers;
        this.lift = allLifts.find((item) => {
          return item.id == this.liftQrId;
        });
      }
    },
  },
  methods: {
    emit(val) {
      this.$emit("input", val ? this.value : ""); // model is string
    },
  },
};
</script>

<style lang="scss" scoped>
</style>