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
    <q-item>
      <q-item-section >
        <!-- <q-knob
          size="lg"
          show-value
          :thickness="0.05"
          readonly
          track-color="white"
          color="primary"
          text-color="dark"
          :value="lift.passengers.length / lift.car.allSeats * 100"
        >
          <span>{{ lift.passengers.length }}/{{ lift.car.allSeats }}</span>
          <q-icon style="display: inline" id="seats" size="12px" name="person" />
        </q-knob> -->
        <q-chip
        text-color="dark"
      >
      <q-avatar 
        :text-color="enoughSeatsLeft ? 'positive' : 'negative'" :color="enoughSeatsLeft ? 'white' : 'dark'" size="md">
        <q-icon :name="enoughSeatsLeft ? 'done' : 'error'" size="sm" />
        </q-avatar>
      {{ numberOfRequests }} Anfrage{{ numberOfRequests != 1 ? 'n' :'' }} <span class="text-h5 q-mx-sm">☞</span> {{ seatsLeft }} freie{{ seatsLeft == 1 ? 'r' : '' }} {{ seatsLeft != 1 ? 'Plätze' : 'Platz' }}</q-chip>
      </q-item-section>
    </q-item>
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
    enoughSeatsLeft(){
      return this.numberOfRequests <= this.seatsLeft
    },

     timeText(){
      var isArriveBy = this.lift.arriveBy != '00:00:00'
      var time = isArriveBy ? this.lift.arriveBy : this.lift.departAt,
      text = isArriveBy ? 'Ankunft bis' : 'Abfahrt um'
            time = time.slice(0,5) // simply cut the seconds
            return text + ' ' + time
      
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

    seatsLeft(){
      return this.lift.car.allSeats - this.lift.passengers.length
    }
  },
  methods: {
    timeFormatted(dateString) {
      return date.formatDate(new Date(dateString), "H:mm");
    },

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