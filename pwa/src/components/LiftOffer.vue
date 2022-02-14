<template>
  <!-- the first component you will recognize when you open StudiCar, shows a single lift offer at marketplace -->
  <div
    :class="`${noShadow ? '' : 'shadow-5 '} q-pa-sm primary-border`"
    style="border-radius: 7px"
  >
    <q-toolbar>
      <q-toolbar-title>
        <!-- <q-icon :name="lift.start.id > 3 ? 'home' : 'school'" size="sm" /> -->
        <span class="ellipsis">{{ lift.start.name }}</span>
        <!-- <small>({{ lift.distance }}km entfernt)</small> -->
        <span class="q-mx-sm">&rsaquo;</span>
        <span>
          {{ lift.destination.name }}
          <!-- <q-badge transparent floating color="white">
            <q-icon :name="lift.destination.id > 3 ? 'home' : 'school'" size="xs" color="grey-9" />
          </q-badge>-->
        </span>
      </q-toolbar-title>
      <q-icon
        v-if="lift.requested"
        name="mark_chat_read"
        size="xs"
        color="dark"
      >
        <q-tooltip
          anchor="top middle"
          :content-class="`bg-white text-dark`"
          content-style="border: 1px solid darkgrey"
          self="bottom middle"
          :offset="[10, 10]"
          >Du hast hier schon angefragt</q-tooltip
        >
      </q-icon>
      <q-btn
        flat
        @click="requestLift"
        v-else-if="!isAlreadyRequested"
        dense
        icon="hail"
        size="md"
        color="primary"
      >
        <q-tooltip
          anchor="top middle"
          :content-class="`bg-white text-dark`"
          content-style="border: 1px solid darkgrey"
          self="bottom middle"
          :offset="[10, 10]"
          >Eine Anfrage senden</q-tooltip
        >
      </q-btn>
      <q-btn
        @click="cancelRequest"
        flat
        v-else
        dense
        icon="event_busy"
        size="md"
        color="primary"
      >
        <q-tooltip
          anchor="top middle"
          :content-class="`bg-white text-dark`"
          content-style="border: 1px solid darkgrey"
          self="bottom middle"
          :offset="[10, 10]"
          >Anfrage zurückziehen</q-tooltip
        >
      </q-btn>
    </q-toolbar>
    <q-list>
      <q-item dense>
        <q-item-section>
          <q-item-label caption>
            <q-icon name="loop" size="xs" class="q-mr-xs" v-if="isRepeating" />
            {{ dateText }}
          </q-item-label>
          <q-item-label caption>{{ timeText }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <div class="text-grey-7 text-right">
            noch {{ lift.seatsOffered - lift.seatsOccupied }} Pl{{
              lift.seatsOffered - (lift.seatsOccupied % 1) != 0 ? "ätze" : "atz"
            }}
            frei
          </div>

          <q-linear-progress
            size="xs"
            :value="lift.seatsOccupied / lift.seatsOffered"
            color="primary"
            :rounded="true"
          >
          </q-linear-progress>
          <!-- 
          <q-knob
            size="lg"
            show-value
            :thickness="0.05"
            readonly
            track-color="white"
            color="primary"
            text-color="dark"
            :value="(lift.seatsOccupied / lift.seatsOffered) * 100"
          >
            <q-icon style="display: inline" size="12px" name="transport_car" />
          </q-knob> -->
        </q-item-section>
      </q-item>
      <!-- <q-item>
        <q-item-section class="text-grey-9">
          <div class="text-subtitle1"></div>
        </q-item-section>
      </q-item>-->

      <q-expansion-item dense class="link-border full-width q-mt-md">
        <template v-slot:header>
          <q-item dense>
            <q-item-section avatar>
              <q-avatar>
                <img :src="imageUrl" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>
                <div class="text-subtitle1">
                  angeboten von {{ lift.driver.name }}
                </div>
              </q-item-label>
            </q-item-section>
          </q-item>
        </template>
        <q-card>
          <q-card-section class="q-pa-xs">
            <q-toolbar dense class="row justify-between">
              <q-toolbar-title class="row justify-evenly">
                <div
                  class="text-center"
                  v-for="pref in [
                    {
                      val: 'talk',
                      icon: 'record_voice_over'
                    },
                    {
                      val: 'talkMorning',
                      icon: 'alarm'
                    },
                    {
                      val: 'smoking',
                      icon: 'smoking_rooms'
                    },
                    {
                      val: 'music',
                      icon: 'music_note'
                    }
                  ]"
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
                      :content-style="
                        'border-bottom: 1px solid ' + betterPrefColor(pref.val)
                      "
                      self="bottom middle"
                      :offset="[10, 10]"
                      >{{
                        prefsDocu[pref.val][
                          lift.driver.prefs[pref.val].toLowerCase()
                        ]
                      }}</q-tooltip
                    >
                  </q-icon>
                </div>
              </q-toolbar-title>
              <q-btn
                :to="'benutzerinfo?userFbId=' + lift.driver.id"
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
import { buildGetRequestUrl, GET_USER_PROFILE_PIC } from "../ApiAccess";

export default {
  name: "LiftOffer",
  components: {},
  props: {
    lift: Object,
    noShadow: Boolean,
    isAlreadyRequested: Boolean
  },
  data() {
    return {
      imageUrl: ""
    };
  },
  computed: {
    timeText() {
      var isArriveBy = this.lift.arriveBy != "00:00:00";
      var time = isArriveBy ? this.lift.arriveBy : this.lift.departAt,
        text = isArriveBy ? "Ankunft" : "Abfahrt";
      time = time.slice(0, 5); // simply cut the seconds
      return text + " um " + time;
    },

    isRepeating() {
      return this.lift.repeatsOn != 0;
    },

    objWithAllWeekDays() {
      var obj = {};
      [
        "Montag",
        "Dienstag",
        "Mittwoch",
        "Donnerstag",
        "Freitag",
        "Samstag"
      ].forEach((d, index) => {
        obj[index + 1] = d;
      });
      return obj;
    },

    dateText() {
      if (this.isRepeating)
        return "jeden " + this.objWithAllWeekDays[this.lift.repeatsOn];
      var dateObj = new Date(this.lift.date),
        dateFormatted = date.formatDate(dateObj, "dddd, DD.MM.", {
          days: [
            "Sonntag",
            "Montag",
            "Dienstag",
            "Mittwoch",
            "Donnerstag",
            "Freitag",
            "Samstag"
          ]
        }),
        daysLeft = date.getDateDiff(dateObj, new Date(), "days"),
        nextWeekText = "";
      switch (daysLeft) {
        case 0:
          nextWeekText = "Heute -";
          break;
        case 1:
          nextWeekText = "Morgen -";
          break;
        case 2:
          nextWeekText = "Übermorgen -";
          break;
        default:
          if (daysLeft < 7) nextWeekText = "Am kommenden";
          else nextWeekText = "Am ";
      }

      return nextWeekText + " " + dateFormatted;
    },

    prefsDocu() {
      return this.$store.state.prefsDocu;
    }
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
        setTimeout(_ => {
          this.prefsExpanded = true;
        }, 50);
      } else {
        this.prefViewTab = "short";
        this.prefsExpanded = false;

        setTimeout(_ => {
          this.prefsExpanded = true;
        }, 0); // just that we have a transition, otherwise there would be no pretty scaling effect
      }
    },

    formatAsTime(dateString) {
      return date.formatDate(new Date(dateString), "H:mm");
    },

    requestLift() {
      this.$q
        .dialog({
          title: "Anfragen",
          message: `${this.lift.driver.name} fragen, ob du mitfahren kannst?`,
          ok: {
            color: "positive"
          },
          cancel: {
            color: "white"
          },
          cancel: true,
          persistent: true
        })
        .onOk(data => {
          this.$emit("request", this.lift.id);
        })
        .onCancel();
    },

    cancelRequest() {
      this.$q
        .dialog({
          title: "Zurückziehen",
          message: `Deine Anfrage zur Fahrt zurückziehen?`,
          ok: {
            color: "positive"
          },
          cancel: {
            color: "white"
          },
          cancel: true,
          persistent: true
        })
        .onOk(_ => {
          this.$emit("cancelRequest", this.lift.id);
        })
        .onCancel();
    },

    async refreshImage() {
      this.imageUrl = await buildGetRequestUrl(GET_USER_PROFILE_PIC, {
        fbid: this.lift.driver.id
      });
    }
  },

  mounted() {
    this.refreshImage();
  },

  updated() {
    this.refreshImage();
  }
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
