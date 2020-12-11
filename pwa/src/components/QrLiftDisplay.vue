<template>
  <q-dialog :value="!!liftData" @input="emit" full-width square position="bottom">
    <q-card>
      <q-card-section>
        <div v-if="lift && !alreadyMemberOfLift">
          <p
            class="text-subtitle2"
          >{{ invitingUserName }} hat dich zu einer Fahrgemeinschaft eingeladen:</p>
          <p
            v-if="lift.requested"
            class="text-caption text-red"
          >Du hast hier schon angefragt, Antwort steht noch aus</p>
          <LiftOffer :lift="lift" noShadow />
        </div>
        <q-item v-else-if="alreadyMemberOfLift">
          <q-item-section avatar>
            <q-avatar size="4em">
              <q-icon name="info" />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>Info zur Einladung</q-item-label>
            <q-item-label caption>Ihr seid bereits beide in der Fahrgemeinschaft.</q-item-label>
          </q-item-section>
        </q-item>

        <div v-else>
          <q-item>
            <q-item-section avatar>
              <q-circular-progress indeterminate size="md" color="primary" class="q-ma-md" />
            </q-item-section>
            <q-item-section>
              <p class="text-subtitle1">Einladung wird überprüft</p>
            </q-item-section>
          </q-item>
        </div>
        <div v-if="err">
          <p class="text-negative text-caption">{{ err }}</p>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { date } from "quasar";
import ExtHR from "components/ExtendedHr";
import LiftOffer from "components/LiftOffer";
import { sendApiRequest, SQL_GET_MARKETPLACE } from "../ApiAccess";

export default {
  name: "QRLiftDisplay",
  components: {
    LiftOffer
  },
  props: {
    liftData: String
  },
  model: {
    prop: "liftData"
  },
  data() {
    return {
      viewTab: "info",
      lift: null,
      err: null,
      alreadyMemberOfLift: false,
      invitingUserName: null
    };
  },
  computed: {
    liftId() {
      return parseInt(this.liftData.split("#i")[0]);
    },
    invitingUserId() {
      return this.liftData.split("#i")[1];
    }
  },
  watch: {
    liftData: function(val) {
      if (val) {
        var currentLifts = this.$store.getters["auth/user"].chatLifts,
          a = currentLifts.find(l => l.id == this.liftId);
        if (a) {
          this.alreadyMemberOfLift = true;
          this.lift = null; // to be sure
        } else
          sendApiRequest(
            SQL_GET_MARKETPLACE,
            {
              uuid: this.liftId, // a uuid, can be treated as a longer and more secure liftId
              invitingUserId: this.invitingUserId
            },
            data => {
              this.lift = data.lift;
              this.invitingUserName = data.invitingUserName;
            },
            err_ => {
              this.err = err_;
            }
          );
      }
    }
  },
  methods: {
    emit(val) {
      this.$emit("input", val ? this.liftData : ""); // model is string
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
</style>