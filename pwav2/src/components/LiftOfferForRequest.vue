<template>
  <!-- actually like LiftOffer, but re-designed to fit better in the incoming requests section -->
  <div>
    <div class="row no-wrap">
      <!-- <div class="self-center">
        <span class="text-primary">2</span>
        <q-btn icon="chevron_left" @click="emit('left')" dense flat />
      </div>-->
      <div class="ellipsis col-9">
        <q-item
          dense
          class="q-px-none"
          clickable
          @click="showLiftDetails = !showLiftDetails"
        >
          <q-item-section>
            <q-toolbar>
              <q-toolbar-title class="text-subtitle1">
                <!-- <q-icon :name="lift.start.id > 3 ? 'home' : 'school'" size="sm" /> -->
                <span>{{
                  getCampusLabel(lift.start.id, lift.start.name)
                }}</span>
                <!-- <small>({{ lift.distance }}km entfernt)</small> -->
                <span class="q-mx-sm">&rsaquo;</span>
                <span>
                  {{
                    getCampusLabel(lift.destination.id, lift.destination.name)
                  }}
                  <!-- <q-badge transparent floating color="white">
            <q-icon :name="lift.destination.id > 3 ? 'home' : 'school'" size="xs" color="grey-9" />
                  </q-badge>-->
                </span>
                <q-slide-transition>
                  <div v-if="!showLiftDetails" class="text-caption">
                    Tippe für Details
                  </div>
                </q-slide-transition>
              </q-toolbar-title>
            </q-toolbar>
          </q-item-section>
        </q-item>
      </div>
      <div class="col-3">
        <q-item dense class="q-px-none">
          <slot></slot>
        </q-item>
      </div>
      <!-- <div class="self-center">
        <q-btn icon="chevron_right" @click="emit('right')" dense flat />
        <span class="text-primary">1</span>
      </div>-->
    </div>
    <q-slide-transition>
      <div v-if="showLiftDetails">
        <div class="q-pl-sm q-pb-sm">
          <q-badge v-if="liftSoonLabel" color="grey-7" class="q-mr-sm">{{
            liftSoonLabel
          }}</q-badge>
          <div>
            Am {{ dateText }} (in {{ daysLeft }} Tage{{
              daysLeft != 1 ? "n" : ""
            }})
          </div>
          <div>{{ timeText }} Uhr</div>
        </div>
      </div>
    </q-slide-transition>

    <div class="full-width q-py-sm">
      <div class="q-ml-md full-width bg-grey-4">
        <q-slide-item left-color="white" @left="acceptAll">
          <template v-slot:left v-if="enoughSeatsLeft">
            <div class="bg-positive q-pa-sm" style="border-radius: 20px">
              <q-icon name="done_all" class="q-mr-sm" />Alle annehmen
            </div>
          </template>
          <div
            class="row bg-grey-4 q-pr-lg full-width"
            style="border-radius: 25px"
          >
            <q-avatar
              class="q-mr-md"
              :text-color="enoughSeatsLeft ? 'positive' : 'negative'"
              :color="enoughSeatsLeft ? 'white' : 'dark'"
            >
              <q-btn
                flat
                dense
                :icon="enoughSeatsLeft ? 'double_arrow' : 'error'"
                size="md"
              />
            </q-avatar>
            <div class="self-center">
              {{ numberOfRequests }} Anfrage{{
                numberOfRequests != 1 ? "n" : ""
              }}
              <span class="text-h5 q-mx-sm">☞</span>
              {{ seatsLeft }} freie{{ seatsLeft == 1 ? "r" : "" }}
              {{ seatsLeft != 1 ? "Plätze" : "Platz" }}
            </div>
          </div>
        </q-slide-item>
      </div>
    </div>
  </div>
</template>

<script>
import { date } from "quasar";
import { defineComponent } from "vue";

export default defineComponent({
  name: "LiftOfferForRequest",
  components: {},
  props: {
    lift: Object,
    numberOfRequests: Number
  },
  data() {
    return {
      showLiftDetails: false
    };
  },
  computed: {
    enoughSeatsLeft() {
      return this.numberOfRequests <= this.seatsLeft && this.seatsLeft > 0;
    },

    timeText() {
      var isArriveBy = this.lift.arriveBy != "00:00:00";
      var time = isArriveBy ? this.lift.arriveBy : this.lift.departAt,
        text = isArriveBy ? "Ankunft" : "Abfahrt";
      time = time.slice(0, 5); // simply cut the seconds
      return text + " um " + time;
    },

    dateText() {
      return date.formatDate(new Date(this.lift.date), "dddd, DD. MMMM", {
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
    },

    daysLeft() {
      return date.getDateDiff(new Date(this.lift.date), new Date(), "days");
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
      return this.lift.car.seatsWithoutDriver - this.lift.passengers.length;
    }
  },
  methods: {
    timeFormatted(dateString) {
      return date.formatDate(new Date(dateString), "H:mm");
    },

    emit(type) {
      this.$emit(type);
    },

    getCampusLabel(campusId, name) {
      switch (campusId) {
        case 1:
          return "Würfel";
        case 2:
          return "Alte DH";
        case 3:
          return "Kloster";
        default:
          return name;
      }
    },

    acceptAll() {
      /* this.$q
        .dialog({
          title: "Alle annehmen",
          message: "Willst du alle Anfragen direkt annehmen?",
          cancel: true,
          persistent: true
        })
        .onOk(() => { */
      this.$emit("acceptAll", this.lift.id);
      /* }); */
    }
  },
  mounted() {}
});
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
