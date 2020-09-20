<template>
  <div>
    <q-dialog v-model="open" @input="emit()" full-width square position="bottom">
      <q-card>
        <q-card-section>
          <div>
            <q-toolbar>
              <q-avatar>
                <div :style="`background-color: ${ lift.car.color }`" class="full-width">
                  <q-img src="~assets/app-icon_color_preview.png" />
                </div>
              </q-avatar>
              <q-toolbar-title>
                <p>
                  {{ lift.start.name }}
                  <span class="q-mx-md">&rsaquo;</span>
                  {{ lift.destination.name }}
                </p>
              </q-toolbar-title>
            </q-toolbar>
            <div class="row">
              <div class="col-5">
                <div>
                  {{ lift.car.brand }} {{ lift.car.model }}
                  <span class="q-pl-md">
                    {{ lift.car.occupiedSeats }} / {{ lift.car.allSeats }}
                    <q-icon
                      name="airline_seat_recline_normal"
                      :color="fullCar ? 'positive' : 'dark'"
                      size="xs"
                    />
                  </span>
                </div>
                <div>
                  <p class="text-caption">{{ lift.car.licensePlate }}</p>
                  <p>
                    <span>{{ lift.car.built }}er Baujahr</span>
                  </p>
                </div>
              </div>
              <div class="col-7">
                <q-item>
                  <q-item-section>
                    <q-item-label>
                      Ankunft
                      <span class="text-caption q-ml-xs">{{ formatAsTime(lift.departAt) }}</span>
                    </q-item-label>
                    <q-item-label>
                      Abfahrt
                      <span class="text-caption q-ml-xs">{{ formatAsTime(lift.arriveBy) }}</span>
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side class="text-subtitle1">{{ dateDiff }}</q-item-section>
                </q-item>
                <q-separator spaced inset="item" />
                <p>
                  {{ lift.driver.name }}
                  <q-icon name="drive_eta" class="q-ml-sm" size="xs" color="grey-6" />
                </p>
                <div class="row">
                  <span v-for="p in lift.passengers" :key="p.id" class="q-px-sm col-4">{{ p.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { date } from "quasar";

export default {
  name: "ShortLiftInfo",
  model: {
    prop: "open",
    event: "input",
  },
  props: {
    lift: Object,
    open: Boolean,
  },
  methods: {
    emit() {
      this.$emit("input", this.open);
    },

    formatAsTime(time) {
      return date.formatDate(new Date(time), "H:mm");
    },
  },
  computed: {
    fullCar() {
      var car = this.lift.car;
      return car.occupiedSeats == car.allSeats;
    },

    dateDiff() {
      var now = new Date(),
        liftDate = this.lift.date,
        diff = date.getDateDiff(liftDate, now, "days");
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
          return "Da ist noch hin";
      }
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
</style>