<template>
  <q-dialog
    :value="!!liftData && !denied"
    @input="emit"
    persistent
    @hide="hide"
    full-width
    square
    position="bottom"
    transition-hide="flip-down"
  >
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
          <LiftOffer :lift="lift" @request="emitRequest" noShadow />
          <q-item v-if="!prefsMatching">
            <q-item-section avatar>
              <q-icon name="warning" color="negative" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Deine Präferenzen scheinen nicht zu denen von {{ lift.driver.name }} zu passen.</q-item-label>
            </q-item-section>
          </q-item>
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
        <q-item v-else-if="err">
          <q-item-section avatar>
            <q-avatar size="4em">
              <q-icon name="error_outline" color="negative" />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>Anfrage fehlgeschlagen</q-item-label>
            <q-item-label caption>Fehler {{ err.status }}: {{ err.data }}</q-item-label>
          </q-item-section>
        </q-item>
        <div v-else>
          <q-item>
            <q-item-section avatar>
              <q-circular-progress indeterminate size="md" color="primary" class="q-ma-md" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-subtitle1">StudiCar überprüft deine Einladung</q-item-label>
              <q-item-label caption>Bitte hab einen Moment Geduld</q-item-label>
            </q-item-section>
          </q-item>
        </div>
      </q-card-section>
      <q-card-section actions class="text-right" bordered>
        <q-btn @click="denied = true" label="Abbrechen" class="q-my-none" flat color="negative" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { date } from "quasar";
import ExtHr from "components/ExtendedHr";
import LiftOffer from "components/LiftOffer";
import { sendApiRequest, SQL_GET_MARKETPLACE_OFFER } from "../ApiAccess";

export default {
  name: "QRLiftDisplay",
  components: {
    LiftOffer
  },
  data() {
    return {
      viewTab: "info",
      lift: null, // is the lift object returned by the server
      err: null,
      alreadyMemberOfLift: false,
      invitingUserName: null,
      denied: false,
      liftData: "" // computed property makes no sence because url as depending value is not reactive as well
    };
  },
  computed: {
    liftId() {
      if (this.liftData) return parseInt(this.liftData.split("#i")[0]);
      else return -1;
    },
    invitingUserId() {
      return this.liftData.split("#i")[1];
    },
    userPrefs() {
      return this.$store.getters["auth/user"].prefs;
    },
    prefsMatching() {
      if (!this.lift) return null;
      var liftPrefs = this.lift.driver.prefs;
      var matching = Object.keys(liftPrefs).every(pref => {
        var liftPrefValue = prefToInt(liftPrefs[pref]),
          userPrefValue = prefToInt(this.userPrefs[pref]);

        return liftPrefValue >= userPrefValue;
        function prefToInt(val) {
          switch (val) {
            case "GREEN":
              return 0;
            case "YELLOW":
              return 1;
            case "RED":
              return 2;
          }
        }
      });

      return matching;
    }
  },
  watch: {
    $route() {
      // const forceReloadData = true

      this.denied = false; // new round, new luck
      this.refresh();
    }
  },
  methods: {
    emitRequest(val) {
      this.$emit("request", val); // model is string
      this.hide(); // close it after requesting
    },

    hide() {
      this.denied = true; // just to be sure, in case user made it to close without denying
    },

    refresh() {
      var locArr = window.location.href.split("?qrLiftData=");
      if (locArr.length > 1) {
        var data = locArr[1];
        data = data.split("#0.")[0]; // cut the random part
        if (this.liftData != data) {
          this.liftData = data;
          this.lift = null; // when new data wanted, vars are reset again
        }
        var currentLifts = this.$store.getters["auth/user"].chatLifts,
          a = currentLifts.find(l => l.id == this.liftId);
        if (a) {
          this.alreadyMemberOfLift = true;
          this.lift = null; // to be sure
        } else {
          this.callServer();
        }
      } else this.liftData = "";
    },

    callServer() {
      sendApiRequest(
        SQL_GET_MARKETPLACE_OFFER,
        {
          uuid: this.liftId, // a uuid, is as a longer and more secure liftId
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
  },
  mounted() {
    this.refresh();
  }
};
</script>

<style lang="scss" scoped>
</style>