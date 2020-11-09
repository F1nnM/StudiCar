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
      <q-icon v-if="lift.requested" name="mark_chat_read" size="xs" color="dark" />
    </q-toolbar>
    <q-list>
      <q-item dense>
        <q-item-section>
          <q-item-label caption>{{ dateText }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <span>{{ lift.seatsOccupied }}/{{ lift.seatsOffered }}</span>
          <q-icon style="display: inline" id="seats" size="xs" name="person" />
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
                    :color="betterPrefColor(lift.driver.prefs[pref.val])"
                    size="sm"
                  />
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

      return (
        "Fahrt ist am " +
        isNextText +
        dateFormatted +
        "\nAngestrebte " +
        directionText +
        ": " +
        timeFormatted +
        " Uhr"
      );
    },
  },
  methods: {
    betterPrefColor(color) {
      if (color == "GREEN") return "green-8";
      else if (color == "YELLOW") return "orange";
      else return color.toLowerCase();
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
  },
  mounted() {},
};
</script>

<style scoped>
.link-border {
  border-radius: 4px;
  border: 1px solid rgba(19, 70, 21, 0.671);
}

.primary-border {
  border: 1px solid rgba(19, 70, 21, 0.671);
}
</style>