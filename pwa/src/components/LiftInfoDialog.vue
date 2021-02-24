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
          </q-item>
          <q-item-label header>
            <div class="row justify-between">
              <span>Verlauf</span>
              <q-item-label caption>
                <q-icon name="loop" size="xs" class="q-mr-xs" v-if="isRepeating" />
                <q-icon name="query_builder" size="xs" class="q-mr-xs" v-else />
                {{ formattedDate }}
              </q-item-label>
            </div>
          </q-item-label>

          <ExpansionLiftTimeline :lift="lift"></ExpansionLiftTimeline>
          <q-separator />
          <q-item-label header>Auto</q-item-label>
          <CompactCarInfo :car="lift.car" expandable />
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

      <q-dialog
        v-model="openEditTime"
        persistent
        @show="loadCurrentTime"
        position="bottom"
        style="width: 90vw"
      >
        <q-toolbar class="bg-white">
          <q-btn
            round
            flat
            dense
            outline
            :disable="uploading"
            size="lg"
            @click="newTime.help = !newTime.help"
          >
            <span class="text-h6 text-weight-light">?</span>
          </q-btn>
          <span v-if="!newTime.help" class="text-weight-light left-border-primary">Fahrtzeit</span>
          <q-space />
          <q-btn
            flat
            round
            dense
            icon="close"
            size="md"
            color="grey-9"
            v-close-popup
            @click="openEditTime"
            class="q-mr-lg q-pr-sm"
          />
          <q-btn
            flat
            round
            dense
            icon="done"
            :disable="!areTimeChanges"
            size="md"
            color="positive"
            @click="saveNewTime"
          />
        </q-toolbar>
        <q-linear-progress :indeterminate="uploading" :value="100" track-color="white" />
        <q-slide-transition>
          <div class="bg-white row justify-start" v-if="newTime.help && !uploading">
            <div class="bg-primary q-px-lg" />
            <div class="q-pa-xs q-pl-sm q-py-md">
              <div class="text-weight-light text-h6">Fahrtzeit bearbeiten</div>
              <div class="text-caption text-grey-9">
                Deine Fahrtzeit besteht aus zwei unabhängigen Teilen:
                <ul>
                  <li>Tag: Der Tag kann entweder ein festes Datum oder ein wiederkehrender Wochentag sein.</li>
                  <li>
                    Zeit: Die Zeit kann willkürlich gewählt werden, zusätzlich musst du noch angeben,
                    ob du zu dieser Zeit an der DH ankommst oder von ihr wegfährst.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </q-slide-transition>

        <div class="q-pa-md bg-white">
          <q-list>
            <q-item>
              <q-item-section avatar>
                <q-item-label header>Tag</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-btn-toggle
                  v-model="newTime.dateTab"
                  @click="setDateTab"
                  no-caps
                  rounded
                  unelevated
                  outline
                  toggle-color="primary"
                  class="q-mb-xs"
                  color="white"
                  text-color="grey-5"
                  :options="[
          {label: 'Fester Tag', value: 'fix'},
          {label: 'Wöchentlich', value: 'weekly'}
        ]"
                />
                <q-input
                  clickable
                  @click="_=> { if(this.newTime.dateTab == 'fix') $refs.datepicker.toggle() 
                    else $refs.datepicker.showPopup() }"
                  outlined
                  readonly
                  :value="newTime.dateTab == 'fix' ? (newTime.date || '- Datum -') : getWeekDayFromIndex"
                >
                  <template v-slot:append>
                    <q-btn
                      icon="edit"
                      color="grey-9"
                      flat
                      @click="_=> { if(newTime.dateTab == 'weekly') $refs.datepicker.showPopup() }"
                    >
                      <q-menu
                        v-if="newTime.dateTab == 'fix'"
                        ref="datepicker"
                        transition-show="jump-down"
                        transition-hide="jump-up"
                      >
                        <q-date
                          title="Tag auswählen"
                          :subtitle="`Maximal 30 Tage im Voraus`"
                          event-color="primary"
                          mask="YYYY-MM-DD"
                          v-model="newTime.date"
                          :events="[todayString]"
                          :options="dateOptions"
                        />
                      </q-menu>
                      <q-select
                        v-else
                        ref="datepicker"
                        class="hidden"
                        emit-value
                        label="Wochentag auswählen"
                        transition-show="jump-down"
                        transition-hide="jump-up"
                        v-model="newTime.date"
                        :options="getRepeatingDayOptions"
                      />
                    </q-btn>
                  </template>
                </q-input>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section avatar>
                <q-item-label header>Zeit</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-btn-toggle
                  v-model="newTime.timeTab"
                  no-caps
                  rounded
                  unelevated
                  class="q-mb-sm"
                  outline
                  toggle-color="primary"
                  color="white"
                  text-color="grey-5"
                  :options="[
          {label: 'Ankunft um', value: 'arrive'},
          {label: 'Abfahrt ab', value: 'depart'}
        ]"
                />
                <q-input
                  class="col-6"
                  clickable
                  @click="_=> $refs.timepicker.toggle()"
                  outlined
                  readonly
                  :value="newTime.time || '- Zeit -'"
                >
                  <template v-slot:append>
                    <q-btn icon="edit" color="grey-9" flat>
                      <q-menu
                        ref="timepicker"
                        transition-show="jump-down"
                        transition-hide="jump-up"
                      >
                        <q-time format24h v-model="newTime.time" mask="HH:mm" color="primary" />
                      </q-menu>
                    </q-btn>
                  </template>
                </q-input>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-dialog>
    </div>
  </q-dialog>
</template>


<script>
import { openURL, date } from "quasar";
import Vue from "vue";
import {
  buildGetRequestUrl,
  GET_USER_PROFILE_PIC,
  sendApiRequest,
  SQL_UPDATE_LIFT_TIME
} from "../ApiAccess";
import VueFriendlyIframe from "vue-friendly-iframe";
Vue.use(VueFriendlyIframe);

import CompactCarInfo from "components/CompactCarInfo";
import ExpansionLiftTimeline from "components/ExpansionLiftTimeline";
/* import { sendApiRequest } from "../ApiAccess"; */

export default {
  name: "LiftInfoDialog",
  components: {
    ExpansionLiftTimeline,
    CompactCarInfo
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
        time: null,
        help: false
      },
      oldTime: {},
      uploading: false
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

<style lang="scss" scoped>
.left-border-primary {
  border-left: 1px solid $primary;
  padding-left: 15px;
}
</style>
