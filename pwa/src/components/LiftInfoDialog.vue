<template>
  <q-dialog
    :value="value"
    transition-show="slide-left"
    transition-hide="slide-right"
    maximized
    @input="emit"
  >
    <div v-if="lift" v-touch-swipe.mouse.right="swipedToRight">
      <div class="row justify-end">
        <div
          class="col-2 text-right column justify-center q-pr-md text-primary bg-white text-subtitle1"
        >Info</div>
        <div class="col-2 bg-white text-primary">
          <q-toolbar>
            <q-toolbar-title>
              <q-btn v-ripple icon="close" flat round dense @click="emit(false)" />
            </q-toolbar-title>
          </q-toolbar>
        </div>
      </div>
      <div class="bg-white full-height q-pa-md">
        <p class="text-h6">Fahrtdetails</p>
        <q-timeline color="primary" class="q-mt-xl">
          <!-- <q-item-label header>Fahrtverlauf</q-item-label> -->
          <q-timeline-entry>
            <template v-slot:title>
              <p>
                {{ lift.start.name }}
                <span
                  class="q-ml-md text-subtitle1"
                >{{ formatAsTime(lift.departAt) }}</span>
              </p>
            </template>
          </q-timeline-entry>
          <q-timeline-entry>
            <template v-slot:title>
              <p>
                {{ lift.destination.name }}
                <span
                  class="q-ml-md text-subtitle1"
                >{{ formatAsTime(lift.arriveBy) }}</span>
                <!-- <q-badge floating v-if="lift.destination.id < 4">
                            <q-icon color="dark" name="school" size="xs" />
                </q-badge>-->
              </p>
            </template>
          </q-timeline-entry>
        </q-timeline>
        <div class="shadow-9 q-pa-md">
          <div class="row">
            <div class="col-6">
              <div class="text-subtitle1">{{ lift.car.brand }} {{ lift.car.model }}</div>
              <div class="text-caption">{{ lift.car.type }}</div>
            </div>
            <div class="col-5">
              <q-avatar>
                <div :style="`background-color: ${ lift.car.color }`" class="full-width">
                  <q-img src="~assets/app-icon_color_preview.png" />
                </div>
              </q-avatar>
              <q-btn color="grey-7" round flat dense icon="help_outline">
                <q-menu cover auto-close>
                  <q-btn flat no-caps clickable @click="viewCar()">Modell online ansehen</q-btn>
                </q-menu>
              </q-btn>
            </div>
          </div>
          <ExtHr :color="lift.car.color" hex size="xs" class="q-my-sm" />
          <p
            class="text-grey-7 q-mb-none"
          >{{ lift.car.licensePlate }} - Baujahr {{ lift.car.built }}</p>
        </div>

        <q-list bordered class="q-mt-md">
          <q-item-label header>Fahrer</q-item-label>
          <q-item>
            <q-item-section top avatar>
              <q-avatar>
                <img :src="getImageOfUser(lift.driver.id)" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <p>
                {{ lift.driver.name }}
                <br />
                <small>{{ lift.driver.surname }}</small>
              </p>
            </q-item-section>
          </q-item>
          <q-item-label header>
            <p v-if="lift.passengers.length">
              Mitfahrer
              <span class="text-caption float-right">
                {{ lift.passengers.length + 1 }} / {{ lift.car.allSeats }}
                <q-icon name="airline_seat_recline_normal" size="xs" />
              </span>
            </p>
            <p
              v-if="!lift.passengers.length"
              class="text-center q-pt-sm text-gray"
            >Bis jetzt hast du noch keine Mitfahrer.</p>
            <p
              class="text-right text-primary text-caption"
              v-if="lift.passengers.length == lift.seats"
            >Volles Auto. Wow!</p>
          </q-item-label>
          <q-item v-for="item in lift.passengers" :key="item.id">
            <q-item-section top avatar>
              <q-avatar>
                <img :src="getImageOfUser(item.id)" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label>
                {{ item.name }}
                <br />
                <small>{{ item.surname }}</small>
              </q-item-label>
              <q-item-label caption></q-item-label>
            </q-item-section>

            <q-item-section side top>
              <q-icon name="directions_car" v-if="item.id == user" size="sm" />
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </q-dialog>
</template>


<script>
import { openURL, date } from "quasar";
import ExtHr from "components/ExtendedHr";
/* import { sendApiRequest } from "../ApiAccess"; */

export default {
  name: "LiftInfoDialog",
  components: {
    ExtHr
  },
  props: {
    value: Boolean,
    lift: Object
  },
  data() {
    return {
      open: false,
      user: this.$store.getters["auth/user"].id,
      ntc: null
    };
  },
  watch: {
   
  },
  computed: {},
  methods: {
    emit(val){
      this.$emit('input', val)
    },
    swipedToRight(){
      this.emit(false)
    },
    getImageOfUser(id) {
      return require("../assets/sad.svg");
    },

    viewCar() {
      var car = this.lift.car;
      var humanColor = ''
      /* if(!this.ntc) this.ntc = require('../js/ntc')
      humanColor = this.ntc.name(car.color)[1] */
      
      var search = 
        `${car.brand}+${car.model.replace(" ", "")}+${car.type}+${humanColor}`;
      openURL("https://www.ecosia.org/images?q=" + search); // easiest way, otherwise we would have to store a image of each model (!)
    },
  }
};
</script>
