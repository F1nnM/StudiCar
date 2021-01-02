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
          <LiftOffer :lift="lift" noShadow />
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

        <div v-else>
          <q-item>
            <q-item-section avatar>
              <q-circular-progress indeterminate size="md" color="primary" class="q-ma-md" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-subtitle1">Einladung wird überprüft</q-item-label>
              <q-item-label caption>Bitte hab einen Moment Geduld</q-item-label>
            </q-item-section>
          </q-item>
        </div>
        <div v-if="err">
          <p class="text-negative text-caption">{{ err }}</p>
        </div>
      </q-card-section>
      <q-card-section actions class="text-right" bordered>
        <q-btn @click="denied = true" label="Ablehnen" class="q-my-none" flat color="negative" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { date } from "quasar";
import ExtHR from "components/ExtendedHr";
import LiftOffer from "components/LiftOffer";
import { sendApiRequest, SQL_GET_MARKETPLACE } from "../ApiAccess";
import ExtendedHr from "./ExtendedHr.vue";

export default {
  name: "QRLiftDisplay",
  components: {
    LiftOffer
  },
  data() {
    return {
      viewTab: "info",
      lift: null,
      err: null,
      alreadyMemberOfLift: false,
      invitingUserName: null,
      denied: false
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
    },

    liftData() {
      var locArr = window.location.href.split("?qrLiftData=");
      if (locArr.length > 1) {
        console.warn("changed to " + locArr[1]);
        return locArr[1];
      } else return "";
    }
  },
  watch: {
    liftData: function(val) {
      if (val) this.refresh();
    },

    $route(to, from) {
      if (this.liftData) {
        this.denied = false; // new play, new luck
        this.refresh();
      }
    }
  },
  methods: {
    emit(val) {
      this.$emit("input", val ? this.liftData : ""); // model is string
    },

    hide() {
      /* this.liftData = ""; */
    },

    refresh() {
      if (this.liftData) {
        var currentLifts = this.$store.getters["auth/user"].chatLifts,
          a = currentLifts.find(l => l.id == this.liftId);
        if (a) {
          this.alreadyMemberOfLift = true;
          this.lift = null; // to be sure
        } else {
          this.callServer();
        }
      }
    },

    callServer() {
      sendApiRequest(
        SQL_GET_MARKETPLACE,
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
    if (this.liftData) this.refresh();
  }
};
</script>

<style lang="scss" scoped>
</style>