<template>
  <div>
    <q-dialog v-model="isOpen" @input="emit()" full-width square position="bottom">
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
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
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
  model: {
    prop: "liftId",
    event: "input",
  },
  props: {
    liftId: Number,
  },
  data() {
    return {
      viewTab: "info",
      lift: null,
    };
  },
  computed: {
    isOpen: {
      get() {
        return !!this.liftId;
      },
      set(value) {
        if (!value) {
          this.liftId = 0;
          this.emit();
        }
      },
    },
  },
  watch: {
    liftId: function (val) {
      if (false)
        sendApiRequest(
          SQL_GET_LIFT_INFO,
          {
            id: val,
          },
          (data) => {
            lift = data;
          },
          (_) => {} // no error handling
        );
      else {
        if (val) {
          const allLifts = require("../js/apiResponse").marketplaceOffers;
          this.lift = allLifts.find((item) => {
            return item.id == this.liftId;
          });
        }
      }
    },
  },
  methods: {
    emit() {
      this.$emit("input", this.isOpen);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>