<template>
  <div class="shadow-5 q-pa-sm primary-border" style="border-radius: 7px">
    <q-toolbar>
      <q-toolbar-title>
        <!-- <q-icon :name="lift.start.id > 3 ? 'home' : 'school'" size="sm" /> -->
        <span>{{ lift.start.name }}</span>
        <!-- <small>({{ lift.distance }}km entfernt)</small> -->
        <span class="q-mx-md">&rsaquo;</span>
        <span>
          {{ lift.destination.name }}
          <!-- <q-badge transparent floating color="white">
            <q-icon :name="lift.destination.id > 3 ? 'home' : 'school'" size="xs" color="grey-9" />
          </q-badge>-->
        </span>
      </q-toolbar-title>
      <q-icon v-if="lift.requested" name="mark_chat_read" size="xs" color="dark">
        <q-tooltip
          anchor="top middle"
          :content-class="`bg-white text-dark`"
          content-style="border: 1px solid darkgrey"
          self="bottom middle"
          :offset="[10, 10]"
        >Du hast hier schon angefragt</q-tooltip>
      </q-icon>
      <q-btn flat @click="requestLift" v-else dense icon="touch_app" size="md" color="primary">
        <q-tooltip
          anchor="top middle"
          :content-class="`bg-white text-dark`"
          content-style="border: 1px solid darkgrey"
          self="bottom middle"
          :offset="[10, 10]"
        >Eine Anfrage senden</q-tooltip>
      </q-btn>
    </q-toolbar>
    <q-list>
      <q-item dense>
        <q-item-section>
          <q-item-label caption>{{ dateText.firstLine }}</q-item-label>
          <q-item-label caption>{{ dateText.secondLine }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-knob
            size="lg"
            show-value
            :thickness="0.05"
            readonly
            track-color="white"
            color="primary"
            text-color="dark"
            :value="lift.seatsOccupied / lift.seatsOffered * 100"
          >
            <span>{{ lift.seatsOccupied }}/{{ lift.seatsOffered }}</span>
            <q-icon style="display: inline" id="seats" size="12px" name="person" />
          </q-knob>
        </q-item-section>
      </q-item>
      <!-- <q-item>
        <q-item-section class="text-grey-9">
          <div class="text-subtitle1"></div>
        </q-item-section>
      </q-item>-->

      <q-expansion-item dense class="link-border full-width q-mt-md">
        <template v-slot:header>
          <div class="text-subtitle1">
            angeboten von {{ lift.driver.name }}
            <q-avatar>
              <img :src="lift.driver.imageUrl" />
            </q-avatar>
          </div>
        </template>
        <q-card>
          <q-card-section class="q-pa-xs">
            <q-toolbar dense class="row justify-between">
              <q-toolbar-title class="row justify-evenly">
                <div
                  class="text-center"
                  v-for="pref in [{
val: 'talk', icon: 'record_voice_over'
                    },
                    {
val: 'talkMorning', icon: 'alarm'
                    },
                    {
val: 'smoking', icon: 'smoking_rooms'
                    },
                    {
val: 'music', icon: 'music_note'
                    }]"
                  :key="pref.val"
                >
                  <q-icon
                    style="border: 1px solid lightgray"
                    class="rounded-borders q-pa-md"
                    :name="pref.icon"
                    :color="betterPrefColor(pref.val)"
                    size="sm"
                  >
                    <q-tooltip
                      anchor="top middle"
                      :content-class="`bg-white text-dark`"
                      :content-style="'border-bottom: 1px solid ' + betterPrefColor(pref.val)"
                      self="bottom middle"
                      :offset="[10, 10]"
                    >{{ prefsDocu[pref.val][lift.driver.prefs[pref.val].toLowerCase()] }}</q-tooltip>
                  </q-icon>
                </div>
              </q-toolbar-title>
              <q-btn
                :to="'benutzerinfo?slId='+lift.driver.fbid"
                outline
                class="rounded-borders"
                color="dark"
                label="zum Profil"
                no-caps
              />
            </q-toolbar>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>
  </div>
</template>

<script>
import { date } from "quasar";
import ExtendedHr from "components/ExtendedHr";
import {
  buildGetRequestUrl,
  sendApiRequest,
  GET_USER_PROFILE_PIC,
} from "../ApiAccess";

export default {
  name: "LiftOffer",
  components: {},
  props: {
    lift: Object,
  },
  data() {
    return {
      imageUrl: "",
    };
  },
  computed: {
    dateText() {
      var dateObj = new Date(this.lift.departAt || this.lift.arriveBy),
        dateFormatted = date.formatDate(dateObj, "dddd, DD.MM.", {
          days: [
            "Sonntag",
            "Montag",
            "Dienstag",
            "Mittwoch",
            "Donnerstag",
            "Freitag",
            "Samstag",
          ],
        }),
        timeFormatted = this.formatAsTime(dateObj),
        isNextText =
          date.getDateDiff(new Date(), dateObj, "days") < 7 ? "kommenden " : "",
        directionText = this.lift.departAt ? "Abfahrt" : "Ankunft";

      return {
        firstLine: "Fahrt ist am " + isNextText + dateFormatted,
        secondLine:
          "Angestrebte " + directionText + ": " + timeFormatted + " Uhr",
      };
    },

    prefsDocu() {
      return this.$store.state.prefsDocu;
    },
  },
  methods: {
    betterPrefColor(prefName) {
      var color = this.lift.driver.prefs[prefName].toLowerCase();
      if (color == "yellow") return "orange";
      else return color;
    },

    changePrefView() {
      if (this.prefViewTab != "legend") {
        this.prefViewTab = "legend";
        this.prefsExpanded = false;
        setTimeout((_) => {
          this.prefsExpanded = true;
        }, 50);
      } else {
        this.prefViewTab = "short";
        this.prefsExpanded = false;

        setTimeout((_) => {
          this.prefsExpanded = true;
        }, 0); // just that we have a transition, otherwise there would be no pretty scaling effect
      }
    },

    formatAsTime(dateString) {
      return date.formatDate(new Date(dateString), "H:mm");
    },

    requestLift(){
      this.$q
              .dialog({
                title: "Anfragen",
                message: `${this.lift.driver.name} fragen, ob du mitfahren kannst?`,
                ok: {
                  color: "positive",
                },
                cancel: {
                  color: "white",
                },
                cancel: true,
                persistent: true,
              })
              .onOk((data) => {
                this.$emit('request', this.lift.id)
              })
              .onCancel();
    }
  },
  mounted() {},
};
</script>

<style scoped lang="scss">
.link-border {
  border-radius: 4px;
  border-top: 1px solid rgba(19, 70, 21, 0.671);
}

.primary-border {
  border: 1px solid rgba(19, 70, 21, 0.24);
}
</style>