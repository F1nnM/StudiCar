<template>
  <div>
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
    </q-toolbar>
    <q-item>
      <q-item-section>
        <q-item-label caption>
          <q-badge v-if="liftSoonLabel" color="grey-7" class="q-mr-sm">{{ liftSoonLabel }}</q-badge>
          <span>{{ timeText }}</span>
        </q-item-label>
      </q-item-section>
    </q-item>

    <div class="full-width q-py-sm">
      <div class="q-ml-md full-width bg-grey-4">
        <q-slide-item left-color="white">
          <template v-slot:left>
            <div class="bg-positive q-pa-sm" style="border-radius: 20px">
              <q-icon name="done_all" class="q-mr-sm" />Alle annehmen
            </div>
          </template>
          <div class="row bg-grey-4 q-pr-lg full-width" style="border-radius: 25px">
            <q-avatar
              class="q-mr-md"
              :text-color="enoughSeatsLeft ? 'positive' : 'negative'"
              :color="enoughSeatsLeft ? 'white' : 'dark'"
            >
              <q-btn flat dense :icon="enoughSeatsLeft ? 'done_outline' : 'error'" size="md" />
            </q-avatar>
            <div class="self-center">
              {{ numberOfRequests }} Anfrage{{ numberOfRequests != 1 ? 'n' :'' }}
              <span
                class="text-h5 q-mx-sm"
              >☞</span>
              {{ seatsLeft }} freie{{ seatsLeft == 1 ? 'r' : '' }} {{ seatsLeft != 1 ? 'Plätze' : 'Platz' }}
            </div>
          </div>
        </q-slide-item>
      </div>
    </div>
  </div>
</template>

<script>
import { date } from "quasar";

export default {
  name: "LiftOfferForRequest",
  components: {},
  props: {
    lift: Object,
    numberOfRequests: Number
  },
  data() {
    return {};
  },
  computed: {
    enoughSeatsLeft() {
      return this.numberOfRequests <= this.seatsLeft;
    },

    timeText() {
      var isArriveBy = this.lift.arriveBy != "00:00:00";
      var time = isArriveBy ? this.lift.arriveBy : this.lift.departAt,
        text = isArriveBy ? "Ankunft bis" : "Abfahrt um";
      time = time.slice(0, 5); // simply cut the seconds
      return text + " " + time;
    },

    dateText() {
      const timeString = this.lift.departAt || this.lift.arriveBy;
      var dateObj = new Date(timeString),
        dateFormatted = date.formatDate(dateObj, "dddd, DD. MMMM", {
          days: [
            "Sonntag",
            "Montag",
            "Dienstag",
            "Mittwoch",
            "Donnerstag",
            "Freitag",
            "Samstag"
          ],
          months: [
            "Januar",
            "Februar",
            "März",
            "April",
            "Mai",
            "Juni",
            "Juli",
            "August",
            "September",
            "Oktober",
            "November",
            "Dezember"
          ]
        });

      return dateFormatted;
    },

    liftSoonLabel() {
      const diff = date.getDateDiff(
        this.lift.arriveBy || this.lift.departAt,
        new Date()
      );
      switch (diff) {
        case 0:
          return "Heute";
          break;
        case 1:
          return "Morgen";
          break;
        case 2:
          return "Übermorgen";
          break;
        default:
          return false;
      }
    },

    seatsLeft() {
      return this.lift.car.allSeats - this.lift.passengers.length;
    }
  },
  methods: {
    timeFormatted(dateString) {
      return date.formatDate(new Date(dateString), "H:mm");
    }
  },
  mounted() {}
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