<template>
  <q-dialog
    :value="value"
    transition-show="slide-left"
    transition-hide="slide-right"
    maximized
    @input="emit"
  >
    <div
      v-if="lift"
      v-touch-swipe.mouse.right="swipedToRight"
      v-touch-swipe.mouse.left="closeLift"
    >
      <div class="row justify-end">
        <div
          class="col-2 text-right column justify-center q-pr-md text-primary bg-white"
        >
          Info
        </div>
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
              <q-item-label class="text-h5 text-weight-light"
                >Fahrtdetails</q-item-label
              >
            </q-item-section>
          </q-item>
          <q-item-label header>
            <div class="row justify-between">
              <span>Verlauf</span>
              <q-item-label caption>
                <q-icon
                  name="loop"
                  size="xs"
                  class="q-mr-xs"
                  v-if="isRepeating"
                />
                <q-icon name="query_builder" size="xs" class="q-mr-xs" v-else />
                {{ formattedDate }}
              </q-item-label>
            </div>
          </q-item-label>

          <ExpansionLiftTimeline :lift="lift"></ExpansionLiftTimeline>
          <q-separator />
          <q-item-label header>Fahrzeug</q-item-label>
          <CompactCarInfo :car="lift.car" expandable />
          <q-item-label header>
            <div v-if="lift.passengers">
              Teilnehmer
              <br />
              <small class="text-caption" style="font-size: .7em;"
                >Tippe, um zum jeweiligen Profil zu kommen</small
              >
              <span class="text-caption float-right">
                {{ lift.passengers.length + 1 }} /
                {{ lift.car.seatsWithoutDriver + 1 }}
                <q-icon
                  name="person"
                  size="xs"
                  v-if="lift.passengers.length < lift.car.seatsWithoutDriver"
                />
                <q-icon name="how_to_reg" color="positive" size="xs" v-else />
              </span>
            </div>
            <span v-else class="text-caption float-right">
              0 / {{ lift.car.seatsWithoutDriver }}
              <q-icon name="person" size="xs" />
            </span>
          </q-item-label>
          <q-item v-ripple clickable @click="viewUserFromFbId(lift.driver.id)">
            <q-item-section top avatar>
              <q-avatar>
                <img
                  :key="keyToRefreshImages"
                  :src="imageUrlTable[lift.driver.id]"
                />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <p class="q-mb-none">
                {{ !isDriver ? lift.driver.name : "Du" }}
                <q-badge class="q-ml-sm" transparent color="white">
                  <q-icon name="directions_car" size="xs" color="black" />
                </q-badge>
              </p>

              <small v-if="!isDriver">{{ lift.driver.surname }}</small>
            </q-item-section>
            <q-item-section side>
              <div class="row justify-around">
                <q-btn
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
                  outline
                  rounded
                  dense
                  class="q-pa-xs"
                  :color="betterPrefColor(pref.val)"
                  size="sm"
                >
                  <q-icon :name="pref.icon" color="grey-7" />
                </q-btn>
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
                v-for="item in lift.passengers"
                :key="item.id"
              >
                <q-item-section top avatar>
                  <q-avatar>
                    <img
                      :key="keyToRefreshImages"
                      :src="imageUrlTable[item.id]"
                    />
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
          <p v-else class="text-center q-mt-sm text-grey-7">
            Du hast noch keine Mitfahrer
          </p>
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
                  :disable="!isDriver"
                  color="dark"
                  outline
                  @click="openEditTime = true"
                  class="q-my-sm"
                  icon="update"
                  label="Fahrtzeit bearbeiten"
                />
                <q-btn
                  :disable="isDriver && !!lift.passengers.length"
                  color="dark"
                  outline
                  @click="leave"
                >
                  <q-icon name="logout" color="negative" />
                  <span class="q-ml-sm" v-if="isDriver"
                    >Mitfahrgelegenheit auflösen</span
                  >
                  <span class="q-ml-sm" v-else>Verlassen</span>
                  <q-tooltip
                    anchor="top middle"
                    style="border-bottom: 1px solid black"
                    :content-class="`bg-white text-dark`"
                    self="bottom middle"
                    :offset="[10, 10]"
                    >Hinweis: Wenn du noch Mitfahrer hast, dann kannst du als
                    Fahrer nicht einfach so absagen.</q-tooltip
                  >
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

      <SettingScope
        v-model="openEditTime"
        @show="loadCurrentTime"
        :uploading="uploading"
        property="Fahrzeit"
        :disableSave="!areTimeChanges"
      >
        <template v-slot:description>
          Der Termin der Fahrt setzt sich aus zwei Komponenten zusammen:
          <ul>
            <li>
              Tag: Der Tag kann entweder ein festes Datum oder ein
              wiederkehrender Wochentag sein.
            </li>
            <li>
              Zeit: Die Zeit an sich kann willkürlich gewählt werden, es wird
              allerdings immer nur die Zeit an der DH gespeichert: Abfahrtzeit
              bei Start, Ankunftszeit bei Fahrtende. Somit ist die Wahl der
              beiden Optionen mit der Reihenfolge der Stationen verbunden, die
              im Moment noch nicht geändert werden kann.
            </li>
          </ul>
        </template>

        <LiftEditDateTime v-model="newTime" />
      </SettingScope>
    </div>
  </q-dialog>
</template>

<script>
import { openURL, date } from "quasar";
import Vue from "vue";
import LiftEditDateTime from "components/LiftEditDateTime";
import SettingScope from "components/SettingScope";
import { buildGetRequestUrl, GET_USER_PROFILE_PIC } from "../ApiAccess";
import VueFriendlyIframe from "vue-friendly-iframe";
Vue.use(VueFriendlyIframe);

import CompactCarInfo from "components/CompactCarInfo";
import ExpansionLiftTimeline from "components/ExpansionLiftTimeline";
/* import { sendApiRequest } from "../ApiAccess"; */

export default {
  name: "LiftInfoDialog",
  components: {
    ExpansionLiftTimeline,
    CompactCarInfo,
    LiftEditDateTime,
    SettingScope
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
      imageUrlTable: {},
      openEditTime: false,
      editTimeTab: "date",
      newTime: {
        dateTab: "fix",
        timeTab: "arrive",
        date: null,
        time: null
      },
      oldTime: {},
      newTimeHelp: false,
      uploading: false,
      keyToRefreshImages: 0
    };
  },
  watch: {},
  computed: {
    todayString() {
      return date.formatDate(new Date(), "YYYY/MM/DD");
    },

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

    isRepeating() {
      return this.lift.repeatsOn != 0;
    },

    getRepeatingDayOptions() {
      return [
        "Montag",
        "Dienstag",
        "Mittwoch",
        "Donnerstag",
        "Freitag",
        "Samstag"
      ].map((val, index) => ({
        label: val,
        value: index + 1
      }));
    },

    getRepeatingWeekday() {
      // getter for display in overview
      if (!this.isRepeating) return null;
      var day = this.getRepeatingDayOptions.find(
        d => d.value == this.lift.repeatsOn
      );
      return day ? day.label : null;
    },

    getWeekDayFromIndex() {
      // getter for display while editing
      var day = this.getRepeatingDayOptions.find(
        d => d.value == this.newTime.date
      );
      return day ? day.label : null;
    },

    isDriver() {
      return this.lift.driver.id == this.$store.getters["auth/user"].uid;
    },

    myFbId() {
      return this.$store.getters["auth/user"].uid;
    },

    formattedDate() {
      if (this.isRepeating) return "jeden " + this.getRepeatingWeekday;
      var liftDate = new Date(this.lift.date + " " + this.lift.arriveBy),
        daysLeft = date.getDateDiff(liftDate, new Date(), "days"),
        text = _ => {
          switch (daysLeft) {
            case 0:
              return "Fahrt ist heute";
              break;
            case 1:
              return "Fahrt ist morgen";
              break;
            case 2:
              return "Fahrt ist übermorgen";
              break;
            case -1:
              return "Fahrt war gestern";
              break;
            case -2:
              return "Fahrt war vorgestern";
              break;
            default:
              if (daysLeft < 0) return "Fahrt war";
              else if (daysLeft <= 7)
                return "Fahrt ist in " + daysLeft + " Tagen";
              else return "Fahrt ist erst";
          }
        };
      return text() + " am " + date.formatDate(liftDate, "DD.MM.");
    },

    areTimeChanges() {
      return JSON.stringify(this.oldTime) != JSON.stringify(this.newTime);
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

    dateOptions(d) {
      const limit = 30;

      var a = date.getDateDiff(d, new Date(), "days");
      a = a < limit && a >= 0;
      return a;
    },

    loadCurrentTime() {
      if (this.isRepeating) {
        this.newTime.dateTab = "weekly";
        this.newTime.date = this.lift.repeatsOn;
      } else {
        this.newTime.dateTab = "fix";
        this.newTime.date = date.formatDate(
          new Date(this.lift.date),
          "YYYY-MM-DD"
        );
      }

      if (this.lift.arriveBy != "00:00:00") {
        this.newTime.timeTab = "arrive";
        this.newTime.time = this.lift.arriveBy.substr(0, 5);
      } else {
        this.newTime.timeTab = "depart";
        this.newTime.time = this.lift.departAt.substr(0, 5);
      }

      this.oldTime = JSON.parse(JSON.stringify(this.newTime)); // so that user can see whether he has made changes
    },

    setDateTab() {
      var tab = this.newTime.dateTab;
      if (tab == "weekly") this.newTime.date = 1;
      // default on monday
      else this.newTime.date = date.formatDate(new Date(), "YYYY-MM-DD");
    },

    async saveNewTime() {
      var liftId = this.lift.id,
        t = this.newTime,
        objToBeSent = {
          liftId: liftId,
          time: t.time,
          isArriveBy: t.timeTab == "arrive",
          date: t.date,
          isFixDate: t.dateTab == "fix"
        };

      this.uploading = true;
      await this.$store.dispatch("auth/updateLiftTime", objToBeSent);
      this.uploading = false;
      this.openEditTime = false;
    },

    async getImageOfUser(id) {
      this.imageUrlTable[id] = await buildGetRequestUrl(GET_USER_PROFILE_PIC, {
        fbid: id
      });
    },

    viewCar() {
      openURL(this.modelUrl); // easiest way, otherwise we would have to store a image of each(!) model
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
          this.$emit("closeAndLeave", {
            liftId: this.lift.id,
            wasDriver: this.isDriver
          });
        })
        .onCancel();
    }
  },

  mounted() {
    (async _ => {
      await this.getImageOfUser(this.lift.driver.id);
      for (const p of this.lift.passengers) {
        await this.getImageOfUser(p.id);
      }
      const lift = this.imageUrlTable;
      this.keyToRefreshImages++;
    })();
  }
};
</script>

<style lang="scss" scoped></style>
