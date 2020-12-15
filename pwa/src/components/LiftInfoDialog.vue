<template>
  <q-dialog
    :value="value"
    transition-show="slide-left"
    transition-hide="slide-right"
    maximized
    @input="emit"
  >
    <div v-if="lift" v-touch-swipe.mouse.right="swipedToRight" v-touch-swipe.mouse.left="closeLift">
      <div class="row justify-end">
        <div class="col-2 text-right column justify-center q-pr-md text-primary bg-white">Info</div>
        <div class="col-2 bg-white text-primary">
          <q-toolbar>
            <q-toolbar-title class="text-uppercase">
              <q-btn
                v-ripple
                icon="close"
                flat
                round
                dense
                @click="emit(false)"
                v-touch-hold:300.mouse="closeLift"
              />
            </q-toolbar-title>
          </q-toolbar>
        </div>
      </div>
      <div class="bg-white q-pa-md" style="min-height: 100vh">
        <p class="text-h6">Fahrtdetails</p>

        <q-list class="q-mt-md bg-white">
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
                <p class="q-mb-none">
                  <span class="text-subtitle1">
                    <span class="text-bold">{{ lift.car.brand }}</span>
                    {{ lift.car.model}}
                  </span>

                  <q-badge class="q-ml-sm" color="dark" transparent>{{ lift.car.type }}</q-badge>
                </p>
              </q-item-label>
              <q-item-label
                caption
                class="q-pt-xs"
                :style="'border-top: 1px solid ' + lift.car.color"
              >
                Baujahr {{ lift.car.built }}
                <span class="q-mx-sm">-</span>
                {{ lift.car.licensePlate }}
              </q-item-label>
            </q-item-section>
            <q-item-section side top>
              <q-btn icon="help_outline" flat @click="showModelFrame = true" />
            </q-item-section>
          </q-item>
          <q-item-label header>
            <div v-if="lift.passengers">
              Teilnehmer
              <br />
              <small
                class="text-caption"
                style="font-size: .7em;"
              >Tippe, um zum jeweiligen Profil zu kommen</small>
              <span class="text-caption float-right">
                {{ lift.passengers.length + 1 }} / {{ lift.car.allSeats + 1 }}
                <q-icon name="person" size="xs" v-if="lift.passengers.length < lift.car.allSeats" />
                <q-icon name="how_to_reg" color="positive" size="xs" v-else />
              </span>
            </div>
            <span v-else class="text-caption float-right">
              0 / {{ lift.car.allSeats }}
              <q-icon name="person" size="xs" />
            </span>
          </q-item-label>
          <q-item v-ripple clickable @click="viewUserFromFbId(lift.driver.id)">
            <q-item-section top avatar>
              <q-avatar>
                <img :src="imageUrlTable[lift.driver.id]" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <p class="q-mb-none">
                {{ lift.driver.name }}
                <q-badge class="q-ml-sm" transparent color="white">
                  <q-icon name="directions_car" size="xs" color="black" />
                </q-badge>
              </p>

              <small>{{ lift.driver.surname }}</small>
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
          <div v-if="lift.passengers">
            <div class="row justify-between">
              <q-item
                clickable
                v-ripple
                @click="viewUserFromFbId(item.id)"
                class="col-6"
                v-for="(item) in lift.passengers"
                :key="item.id"
              >
                <q-item-section top avatar>
                  <q-avatar>
                    <img :src="imageUrlTable[item.id]" />
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
          </div>
          <p v-else class="text-center q-mt-sm text-grey-7">Du hast noch keine Mitfahrer</p>
          <q-expansion-item>
            <template v-slot:header>
              <q-item>
                <q-item-section>
                  <q-item-label>Optionen</q-item-label>
                </q-item-section>
                <q-item-section avatar>
                  <q-avatar>
                    <q-icon name="settings" color="dark" />
                  </q-avatar>
                </q-item-section>
              </q-item>
            </template>
            <q-card>
              <q-card-section>
                <q-btn
                  :disable="isDriver && !!lift.passengers.length"
                  color="dark"
                  outline
                  @click="leave"
                >
                  <q-icon name="logout" color="negative" />
                  <span class="q-ml-sm" v-if="isDriver">Mitfahrgelegenheit auflösen</span>
                  <span class="q-ml-sm" v-else>Verlassen</span>
                  <q-tooltip
                    anchor="top middle"
                    style="border-bottom: 1px solid black"
                    :content-class="`bg-white text-dark`"
                    self="bottom middle"
                    :offset="[10, 10]"
                  >Hinweis: Wenn du noch Mitfahrer hast, dann kannst du als Fahrer nicht einfach so absagen.</q-tooltip>
                </q-btn>
              </q-card-section>
            </q-card>
          </q-expansion-item>
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
import Vue from "vue";
import { buildGetRequestUrl, GET_USER_PROFILE_PIC } from "../ApiAccess";
import VueFriendlyIframe from "vue-friendly-iframe";
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
      showModelFrame: false,
      imageUrlTable: {}
    };
  },
  watch: {},
  computed: {
    modelUrl() {
      var car = this.lift.car;
      var humanColor = "";
      /* if(!this.ntc) this.ntc = require('../js/ntc')
      humanColor = this.ntc.name(car.color)[1] */

      var search = `${car.brand}+${car.model.replace(" ", "")}+${
        car.type
      }+${humanColor}`;
      search = search.replace("+", "%20");
      return "https://www.pexels.com/search/" + search;
    },

    areRequestsOnThisLift() {
      return !!this.$store.getters["auth/user"].liftRequests.length;
    },

    courseStations() {
      var arr = [],
        start = this.lift.start,
        dest = this.lift.destination,
        arriveBy = this.lift.arriveBy,
        departAt = this.lift.departAt;
      addToCourse(
        start.name,
        start.id == -1 ? "home" : "school",
        start.id == -1 ? "bei " + this.lift.driver.name : "",
        departAt
      );
      if (this.lift.stations)
        this.lift.stations.forEach(station => {
          addToCourse(
            station.name,
            "person_outline",
            "bei " + station.passenger,
            "- ? -"
          );
        });
      addToCourse(
        dest.name,
        dest.id == -1 ? "home" : "school",
        dest.id == -1 ? "bei " + this.lift.driver.name : "",
        arriveBy
      );

      function addToCourse(title, icon, text, time) {
        arr.push({
          title: title,
          subtitle: time ? date.formatDate(new Date(time), "H:mm") : "- ? -",
          icon: icon,
          text: text
        });
      }

      return arr;
    },

    isDriver() {
      return this.lift.driver.id == this.$store.getters["auth/user"].uid;
    }
  },
  methods: {
    emit(val) {
      this.$emit("input", val);
    },
    closeLift() {
      this.$emit("closeLift");
    },
    swipedToRight() {
      this.emit(false);
    },
    getImageOfUser(id) {
      buildGetRequestUrl(
        GET_USER_PROFILE_PIC,
        {
          fbid: id
        },
        url => {
          this.imageUrlTable[id] = url;
        }
      );
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

    viewUserFromFbId(id) {
      window.location.href = "/#/benutzerinfo?userFbId=" + id;
    },

    leave() {
      this.$q
        .dialog({
          title: "Verlassen",
          message: `Willst du diese Mitfahrgelegenheit wirklich ${
            this.isDriver
              ? "auflösen?"
              : "verlassen? Deine Nachrichten bleiben ohne Namensanzeige erhalten."
          }`,
          ok: {
            color: "negative"
          },
          cancel: {
            color: "white"
          },
          cancel: true,
          persistent: true
        })
        .onOk(data => {
          this.$emit("closeAndLeave", this.lift.id);
        })
        .onCancel();
    }
  },

  mounted() {
    this.getImageOfUser(this.lift.driver.id);
    this.lift.passengers.forEach(p => this.getImageOfUser(p.id));
  }
};
</script>
