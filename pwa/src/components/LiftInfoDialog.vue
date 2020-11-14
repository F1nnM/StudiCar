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

        <q-list class="q-mt-md">
          <q-item-label header>
            Verlauf
            <q-badge
              v-if="(courseStations.length > 2)"
              class="q-ml-md"
            >noch {{ courseStations.length - 2 }} Zwischenstopp{{ courseStations.length > 3 ? 's' : '' }}</q-badge>
          </q-item-label>
          <ExpansionLiftTimeline color="dark" :entries="courseStations"></ExpansionLiftTimeline>
          <q-item-label header>Auto</q-item-label>
          <q-item>
            <q-item-section avatar>
              <q-avatar :style="'border: 1px solid ' + lift.car.color">
                <q-icon name="directions_car" size="sm" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>
                <span class="text-subtitle1">
                  <span class="text-bold">{{ lift.car.brand }}</span>
                  {{ lift.car.model}}
                </span>
                <span class="q-ml-sm">
                  <q-badge color="dark" class="q-ml-sm" transparent>{{ lift.car.type }}</q-badge>
                </span>
              </q-item-label>
              <q-item-label
                caption
                class="q-pt-xs"
                :style="'border-top: 1px solid ' + lift.car.color"
              >
                Baujahr {{ lift.car.built }}
                <span class="q-mx-md">-</span>
                {{ lift.car.licensePlate }}
              </q-item-label>
            </q-item-section>
            <q-item-section side top>
              <q-btn icon="help_outline" flat @click="showModelFrame = true" />
            </q-item-section>
          </q-item>
          <q-item-label header>
            <p v-if="lift.passengers.length">
              Menschen
              <span class="text-caption float-right">
                {{ lift.passengers.length + 1 }} / {{ lift.car.allSeats }}
                <q-icon name="person" size="xs" />
              </span>
            </p>
            <p v-else class="text-center q-pt-sm text-gray">Bis jetzt hast du noch keine Mitfahrer.</p>
            <p
              class="text-right text-primary text-caption"
              v-if="lift.passengers.length == lift.seats"
            >Volles Auto. Wow!</p>
          </q-item-label>
          <q-item v-ripple clickable @click="viewUserFromFbId(lift.driver.fbid)">
            <q-item-section top avatar>
              <q-avatar>
                <img :src="getImageOfUser(lift.driver.id)" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <p>
                {{ lift.driver.name }}
                <q-badge class="q-ml-md" color="primary">Fahrer</q-badge>
                <br />
                <small>{{ lift.driver.surname }}</small>
              </p>
            </q-item-section>
            <q-item-section side>
              <div class="row justify-around">
                <q-btn
                  v-for="(pref) in [{
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
                  outline
                  rounded
                  dense
                  :icon="pref.icon"
                  class="q-pa-xs"
                  :color="betterPrefColor(pref.val)"
                  size="sm"
                />
                <!-- <q-btn icon="arrow_forward_ios" outline dense rounded size="sm" /> -->
              </div>
            </q-item-section>
          </q-item>
          <q-separator />
          <div class="row justify-between">
            <q-item
              clickable
              v-ripple
              @click="viewUserFromFbId(item.fbId)"
              class="col-6"
              v-for="item in lift.passengers"
              :key="item.id"
            >
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

              <!-- <q-item-section side>
                <q-btn icon="arrow_forward_ios" outline dense rounded size="sm" />
              </q-item-section>-->
            </q-item>
          </div>
        </q-list>
      </div>
      <q-dialog v-model="showModelFrame" full-height full-width>
        <q-card class="bg-white">
          <q-card-section style="height: 70vh">
            <q-item-label class="q-mb-sm">
              Modell online ansehen
              <q-badge>BETA</q-badge>
            </q-item-label>
            <vue-friendly-iframe style="height: 70vh" :src="modelUrl" />
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </q-dialog>
</template>


<script>
import { openURL, date } from "quasar";
import ExtHr from "components/ExtendedHr";
import Vue from 'vue';
import VueFriendlyIframe from 'vue-friendly-iframe';
Vue.use(VueFriendlyIframe);

import ExpansionLiftTimeline from "components/ExpansionLiftTimeline";
/* import { sendApiRequest } from "../ApiAccess"; */

export default {
  name: "LiftInfoDialog",
  components: {
    ExpansionLiftTimeline
  },
  props: {
    value: Boolean,
    lift: Object
  },
  data() {
    return {
      open: false,
      user: this.$store.getters["auth/user"].id,
      ntc: null,
      showModelFrame: false
    };
  },
  watch: {
   
  },
  computed: {
    modelUrl(){
      var car = this.lift.car;
      var humanColor = ''
      /* if(!this.ntc) this.ntc = require('../js/ntc')
      humanColor = this.ntc.name(car.color)[1] */
      
      var search = 
        `${car.brand}+${car.model.replace(" ", "")}+${car.type}+${humanColor}`;
        search = search.replace('+', '%20')
        return "https://www.pexels.com/search/" + search
    },

    courseStations(){
      var arr = [],
      start = this.lift.start,
      dest = this.lift.destination,
      arriveBy = this.lift.arriveBy,
      departAt = this.lift.departAt
      addToCourse(start.name, start.id > 3 ? 'home' : 'school', (start.id > 3 ? 'bei ' + this.lift.driver.name : ''), departAt)
      if(this.lift.stations) this.lift.stations.forEach(station => {
        addToCourse(station.name, 'person_outline', 'bei ' + station.passenger, '- ? -') 
        })
      addToCourse(dest.name, dest.id > 3 ? 'home' : 'school', (dest.id > 3 ? 'bei ' + this.lift.driver.name : ''), arriveBy)


      function addToCourse(title, icon, text, time){
            arr.push({
              title: title,
              subtitle: time ? date.formatDate(new Date(time), "H:mm") : '- ? -',
              icon: icon,
              text: text
            })
      }

      return arr

    }
  },
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
      openURL(this.modelUrl); // easiest way, otherwise we would have to store a image of each model (!)
    },
    
    formatAsTime(timeObj) {
      return date.formatDate(timeObj, "H:mm");
    },

    betterPrefColor(prefName) {
      var color = this.lift.driver.prefs[prefName].toLowerCase();
      if (color == "yellow") return "orange";
      else return color;
    },

    viewUserFromFbId(fbId) {
      window.location.href = "/#/benutzerinfo?userFbId=" + fbId;
    },
  }
};
</script>
