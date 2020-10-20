<template>
  <div class="q-pa-md">
    <TitleButtonAnchor>
      <q-btn-toggle
        v-model="liftTab"
        no-caps
        rounded
        dense
        unelevated
        outline
        toggle-color="primary"
        color="white"
        text-color="grey-5"
        :options="[
          {value: 'current', icon: 'done'},
          {value: 'requests', icon: 'hearing'}
        ]"
      />
    </TitleButtonAnchor>
    <q-tab-panels
      animated
      v-model="liftTab"
      transition-prev="jump-right"
      transition-next="jump-left"
    >
      <q-tab-panel name="current">
        <q-list>
          <ChatItem
            v-for="(m, index) in lastMessages"
            :key="m.timestamp"
            :message="m"
            :firstItem="index == 0"
            @left="onLeft"
            @right="onRight"
            @open="openTheLift"
            @shortLiftInfo="openShortLiftInfo"
          />
        </q-list>
        <LiftPopup v-model="chatPopup.isOpen" :lift="chatPopup.data" />
        <ShortLiftInfo v-model="shortLiftPopup.isOpen" :lift="shortLiftPopup.data" />
      </q-tab-panel>
      <q-tab-panel name="requests">
        <q-list>
          <div v-if="Object.keys(liftRequests).length">
            <q-splitter :value="15">
              <template v-slot:before>
                <q-tabs v-model="liftRequestTab" vertical>
                  <q-tab
                    no-caps
                    v-for="day in Object.keys(liftRequests)"
                    :key="day"
                    :name="day"
                    :label="getDayLabel(day)"
                  />
                </q-tabs>
              </template>

              <template v-slot:after>
                <q-tab-panels
                  class="q-pa-none"
                  v-model="liftRequestTab"
                  animated
                  swipeable
                  vertical
                  transition-prev="slide-down"
                  transition-next="slide-up"
                >
                  <q-tab-panel
                    class="q-pt-none q-pl-none"
                    v-for="day in Object.keys(liftRequests)"
                    :key="day"
                    :name="day"
                  >
                    <div class="q-pa-md q-pl-lg" style="border-bottom: 1px solid black">
                      <div class="row">
                        <div class="col-8">
                          <q-item-label>
                            {{ dataOfSelectedDaysFirstLift.start.name }}
                            <span
                              class="text-subtitle1 q-px-sm"
                            >&rsaquo;</span>
                            {{ dataOfSelectedDaysFirstLift.destination.name }}
                          </q-item-label>
                          <q-item-label class="row">
                            <div class="col-6">von da bis da halt</div>
                            <div class="col-6">von da bis da halt</div>
                          </q-item-label>
                        </div>
                        <div class="col-4">
                          <div
                            class="q-ma-md"
                            :style="`background-color: ${dataOfSelectedDaysFirstLift.car.color}`"
                          >
                            <q-img src="~assets/app-icon_color_preview.png" />
                          </div>
                          <div class="flex">
                            {{ dataOfSelectedDaysFirstLift.passengers.length }} /
                            {{ dataOfSelectedDaysFirstLift.car.allSeats }}
                            <q-icon name="person_outline" class="q-pl-xs" size="xs" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <q-expansion-item
                      expand-separator
                      v-for="r in liftRequests[day]"
                      :key="r.id"
                      style="border: 1px solid gray"
                      class="q-my-md rounded-borders"
                    >
                      <template v-slot:header>
                        <q-item>
                          <q-item-section avatar>
                            <q-avatar>
                              <q-img :src="r.requestingUser.imageUrl" />
                            </q-avatar>
                          </q-item-section>
                          <q-item-section>
                            <div class="text-subtitle1">{{ r.requestingUser.name }}</div>
                            <div>{{ r.requestingUser.surname }}</div>
                            <div class="row full-width">
                              <div
                                :class="`col-auto q-px-xs text-${betterPrefColor(p)}`"
                                v-for="(p,index) in r.requestingUser.prefs"
                                :key="index"
                              >●</div>
                            </div>
                          </q-item-section>
                        </q-item>
                      </template>
                      <q-card>
                        <q-card-section>
                          <div class="row">
                            <div class="col-8">
                              <p class="text-caption">Nachricht</p>
                              <div class="text-caption text-grey-9">{{ r.requestingUser.bio }}</div>
                            </div>
                            <div class="col-4">
                              <ColoredMeter
                                width="20vw"
                                :angle="r.requestingUser.stats.driverCount / r.requestingUser.stats.liftCount"
                                :minInput="0"
                                :maxInput="1"
                              >{{ r.requestingUser.stats.driverCount }} / {{ r.requestingUser.stats.liftCount }}</ColoredMeter>
                            </div>
                          </div>
                        </q-card-section>
                        <q-card-section class="text-right">
                          <q-btn
                            label="zum Profil"
                            outline
                            :to="'benutzerinfo?slId='+r.requestingUser.fbId"
                            no-caps
                            class="q-px-xs q-mr-lg"
                            color="dark"
                            dense
                          />
                          <q-btn
                            :label="r.requestingUser.name + ' zusagen'"
                            outline
                            @click="grantRequest(r.id, r.requestingUser.fbId)"
                            no-caps
                            class="q-px-xs"
                            color="primary"
                            dense
                          />
                        </q-card-section>
                      </q-card>
                    </q-expansion-item>
                  </q-tab-panel>
                </q-tab-panels>
              </template>
            </q-splitter>
          </div>
          <div v-else class="text-caption">
            <q-item>Im Moment hast du keine Anfragen</q-item>
          </div>
        </q-list>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import ChatItem from "components/ChatItem";
import LiftPopup from "components/LiftPopup";
import ShortLiftInfo from "components/ShortLiftInfo";
import TitleButtonAnchor from "components/TitleButtonAnchor";
import ColoredMeter from "components/ColoredMeter";
import { date } from "quasar";
import { liftRequests } from "../js/apiResponse";

export default {
  components: {
    ChatItem,
    LiftPopup,
    ShortLiftInfo,
    TitleButtonAnchor,
    ColoredMeter,
  },

  data() {
    return {
      lifts: require("../js/apiResponse").chatLifts,
      alreadyTappedOnItem: false,
      liftTab: "requests",
      chatPopup: {
        isOpen: false,
        data: require("../js/dummyValues").chats.shortLiftInfo, // can be used here as well
      },
      shortLiftPopup: {
        isOpen: false,
        data: require("../js/dummyValues").chats.shortLiftInfo,
      },
      liftRequests: require("../js/apiResponse").liftRequests,
      liftRequestTab: null,
    };
  },

  computed: {
    lastMessages() {
      var returnedArray = [];
      for (let liftId in this.lifts) {
        var data = this.lifts[liftId],
          lastMessage = data.messages[data.messages.length - 1];
        returnedArray.push({
          liftId: liftId, // id is property
          start: data.start.name,
          destination: data.destination.name,
          sentBy: this.getNameFromId(liftId, lastMessage.sentBy),
          type: lastMessage.type,
          content: lastMessage.content,
          timestamp: lastMessage.timestamp,
        });
        // if(firstItem) firstItem = false; // just not to have a gray line above top item
      }
      returnedArray.sort((a, b) => {
        return (
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        // sort descending, so swap compared values
      });

      return returnedArray;
    },

    dataOfSelectedDaysFirstLift() {
      var idOfLiftToBeViewed = this.liftRequests[this.liftRequestTab][0].id,
        lift = this.lifts[idOfLiftToBeViewed];
      return lift;
    },
  },

  methods: {
    onLeft({ reset }) {
      //alert("SWIPED LEFT")

      this.finalize(reset);
    },

    onRight({ reset }) {
      //alert("SWIPED RIGHT")

      this.finalize(reset);
    },

    getNameFromId(liftId, userId) {
      var lift = this.lifts[liftId],
        people = JSON.parse(JSON.stringify(lift.passengers)); // otherwise passengers would be overwritten
      people.push(lift.driver);
      return people.find((p) => {
        return p.id == userId;
      }).name;
    },

    openTheLift(liftId) {
      var enableDoubleTap = false;

      if (!process.env.DEV) enableDoubleTap = false; // just to be sure
      if (!enableDoubleTap) {
        this.openLiftPopup(liftId);
      } else {
        if (this.alreadyTappedOnItem) this.openShortLiftInfo(liftId);
        else {
          this.alreadyTappedOnItem = true;
          setTimeout((_) => {
            if (!this.alreadyTappedOnItem) {
              this.openLiftPopup(liftId);
            }
            this.alreadyTappedOnItem = false;
          }, 200);
        }
      }
    },

    openLiftPopup(liftId) {
      var lift = this.lifts[liftId];
      this.chatPopup.data = lift;
      this.shortLiftPopup.isOpen = false; // just to be sure
      this.chatPopup.isOpen = true;
    },

    openShortLiftInfo(liftId) {
      var lift = this.lifts[liftId];
      this.shortLiftPopup.data = lift;
      this.chatPopup.isOpen = false; // just to be sure
      this.shortLiftPopup.isOpen = true;
    },

    finalize(reset) {
      this.timer = setTimeout(() => {
        reset();
      }, 50);
    },

    getDayLabel(stringOfDate) {
      var array = stringOfDate.split("/"),
        day = array[0],
        month = array[1],
        year = new Date().getFullYear(),
        d = new Date(year, month, day);
      return date.formatDate(d, "dd");
    },

    betterPrefColor(color) {
      if (color == "GREEN") return "green-8";
      else if (color == "YELLOW") return "orange";
      else return color.toLowerCase();
    },

    grantRequest(liftId, userFbId) {
      // here comes dispatching code then
    },
  },

  mounted() {
    this.$store.commit("setPage", "Mitfahrgelegenheiten");
    this.$store.commit("setPageTrans", "slide");

    this.liftRequestTab = Object.keys(this.liftRequests)[0];
  },
};
</script>