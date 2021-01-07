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
        <q-list class="q-mt-md bg-white">
          <q-item dense class="q-mb-md">
            <q-item-section>
              <q-item-label class="text-h5 text-weight-light">Fahrtdetails</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label caption>{{ formattedDate }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item-label header>Verlauf</q-item-label>
          <q-item-label>
            <q-badge
              v-if="(courseStations.length > 2)"
              class="q-ml-md"
            >noch {{ courseStations.length - 2 }} Zwischenstopp{{ courseStations.length > 3 ? 's' : '' }}</q-badge>
            <q-chip :label="'jeden ' + getRepeatingWeekday" icon="refresh" v-if="lift.repeatsOn" />
          </q-item-label>
          <ExpansionLiftTimeline color="dark" :entries="courseStations"></ExpansionLiftTimeline>
          <q-separator />
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
                {{ !isDriver ? lift.driver.name : 'Du' }}
                <q-badge class="q-ml-sm" transparent color="white">
                  <q-icon name="directions_car" size="xs" color="black" />
                </q-badge>
              </p>

              <small v-if="!isDriver">{{ lift.driver.surname }}</small>
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

                <q-item-section v-if="item.id != myFbId">
                  <q-item-label>
                    {{ item.name }}
                    <br />
                    <small>{{ item.surname }}</small>
                  </q-item-label>
                  <q-item-label caption></q-item-label>
                </q-item-section>
                <q-item-section v-else>
                  <q-item-label>Du</q-item-label>
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
      search = search.replaceAll("+", "%20");
      return "https://www.pexels.com/search/" + search;
    },

    areRequestsOnThisLift() {
      return !!this.$store.getters["auth/user"].liftRequests.length;
    },

    getRepeatingWeekday() {
      switch (this.lift.repeatsOn) {
        case 1:
          return "Montag";
        case 2:
          return "Dienstag";
        case 3:
          return "Mittwoch";
        case 4:
          return "Donnerstag";
        case 5:
          return "Freitag";
        case 6:
          return "Samstag";
        case 7:
          return "Sonntag";
        case 0:
        default:
          return "Fehler";
      }
    },

    courseStations() {
      var arr = [],
        start = this.lift.start,
        dest = this.lift.destination,
        startsAtSchool = this.lift.start.id == -1;
      arr.push({
        id: start.id,
        city: start.name,
        details: this.getStationLabel(start.id, start.name)
      });
      if (this.lift.stations)
        this.lift.stations.forEach(station => {
          arr.push({
            id: -1, // cannot be a school
            city: station.city,
            passengerName: station.passengerName
          });
        });
      arr.push({
        city: dest.name,
        id: dest.id,
        details: this.getStationLabel(dest.id, dest.name)
      });

      return arr;
    },

    isDriver() {
      return this.lift.driver.id == this.$store.getters["auth/user"].uid;
    },

    myFbId() {
      return this.$store.getters["auth/user"].uid;
    },

    formattedDate() {
      var liftDate = new Date(this.lift.date + " " + this.lift.arriveBy),
        daysLeft = date.getDateDiff(liftDate, new Date(), "days"),
        text = date.formatDate(liftDate, "DD.MM."),
        daysLeftText =
          daysLeft > 7 ? "In über einer Woche" : "In " + daysLeft + " Tagen";
      return daysLeftText + " am " + text;
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

    getStationLabel(campusId, name) {
      switch (campusId) {
        case 1:
          return "Würfel";
        case 2:
          return "Alte DH";
        case 3:
          return "Kloster";
        default:
          return "bei " + name;
      }
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
