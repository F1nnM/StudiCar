<template>
  <div class="q-pa-md">
    <TitleButtonAnchor>
      <div class="row justify-end">
        <q-tab-panels
          animated
          v-model="liftTab"
          transition-prev="jump-right"
          transition-next="jump-left"
          class="text-caption text-right q-pa-none"
        >
          <q-tab-panel
            class="text-caption text-right q-pa-none q-pr-sm q-pt-sm"
            v-for="item in bigTabOptions"
            :key="item.value"
            :name="item.value"
          >
            <q-badge
              v-if="item.value == 'pending'"
              class="q-mx-xs"
              :color="totalRequests ? 'primary' : 'dark'"
            >{{ totalRequests }}</q-badge>
            {{ item.label }}
          </q-tab-panel>
        </q-tab-panels>
        <q-btn-toggle
          v-model="liftTab"
          no-caps
          rounded
          dense
          unelevated
          outline
          toggle-color="primary"
          text-color="grey-5"
          color="white"
          :options="bigTabOptionsWithoutLabel"
        />
        <!-- 
          {value: 'outgoing', icon: 'ion-trending-up'}

        -->
      </div>
    </TitleButtonAnchor>

    <q-tab-panels
      animated
      v-model="liftTab"
      transition-prev="jump-right"
      transition-next="jump-left"
    >
      <q-tab-panel name="pending" class="q-px-none">
        <q-tab-panels
          swipeable
          animated
          v-model="liftTab"
          transition-prev="jump-right"
          transition-next="jump-left"
          class="text-caption text-right q-pa-none"
        >
          <q-tab-panel class="q-pa-none" name="current">
            <p class="q-mb-none text-overline text-grey-7">Bestehend</p>
          </q-tab-panel>
          <q-tab-panel class="q-pa-none q-mb-sm row justify-between" name="pending">
            <span>Angebote für Tag anzeigen</span>
            <TextPagination
              :options="Object.keys(liftRequests)"
              specialLabel
              labelCapitalized
              v-model="liftRequestDayTab"
            />
          </q-tab-panel>
        </q-tab-panels>
        <q-list>
          <div v-if="totalRequests">
            <!-- <q-splitter :value="18" disable>
              <template v-slot:before>
                <q-tabs  vertical>
                  <div v-for="(day, dayShortName) in liftRequests" :key="dayShortName">
                    <q-tab
                      v-if="requestsOfDay(day)"
                      align="left"
                      no-caps
                      :name="dayShortName"
                      :label="getDayLabel(dayShortName)"
                    >
                      <q-badge floating transparent color="grey-7">{{ requestsOfDay(day) }}</q-badge>
                    </q-tab>
                  </div>
                </q-tabs>
              </template>

            <template v-slot:after>-->
            <q-tab-panels
              class="q-pa-none"
              v-model="liftRequestDayTab"
              animated
              vertical
              transition-prev="jump-right"
              transition-next="jump-left"
            >
              <q-tab-panel
                v-for="(day, dayShort) in liftRequests"
                :key="dayShort"
                class="q-pt-none q-px-none"
                :name="dayShort"
              >
                <div v-if="requestsOfDay(day)">
                  <q-tabs spread v-model="liftRequestTimeTab">
                    <div v-for="(lift, liftId) in day" :key="liftId">
                      <q-tab
                        align="justify"
                        dense
                        v-if="lift.length"
                        :name="liftId"
                        no-caps
                        content-class="text-caption"
                        :label="`› ${ lifts[liftId].destination.name }`"
                      />
                    </div>
                  </q-tabs>
                  <q-tab-panels
                    animated
                    transition-prev="slide-right"
                    class="q-pa-none"
                    transition-next="slide-left"
                    v-model="liftRequestTimeTab"
                  >
                    <q-tab-panel
                      :name="liftId"
                      class="q-pl-md q-pr-none"
                      v-for="(lift, liftId) in day"
                      :key="liftId"
                    >
                      <div class="row" v-if="lift.length">
                        <div class="col-8">
                          <q-item-label>
                            {{ lifts[liftId].start.name }}
                            <span
                              class="text-subtitle1 q-px-sm"
                            >&rsaquo;</span>
                            {{ lifts[liftId].destination.name }}
                          </q-item-label>
                          <q-item-label class="row">
                            <div class="col-6">von da bis da halt</div>
                            <div class="col-6">von da bis da halt</div>
                          </q-item-label>
                        </div>
                        <div class="col-4">
                          <div
                            class="q-ma-md"
                            :style="`background-color: ${lifts[liftId].car.color}`"
                          >
                            <q-img src="~assets/app-icon_color_preview.png" />
                          </div>
                          <div class="flex">
                            {{ lifts[liftId].passengers.length }} /
                            {{ lifts[liftId].car.allSeats }}
                            <q-icon name="person_outline" class="q-pl-xs" size="xs" />
                          </div>
                        </div>
                      </div>

                      <!-- <q-scroll-area
                          :thumb-style="thumbStyle"
                          :bar-style="barStyle"
                          style="height: 40vh"
                      >-->
                      <IncomingLiftRequest
                        v-for="r in lift"
                        :key="r.id"
                        :request="r"
                        :liftId="parseInt(liftId)"
                        @respond="respondLiftRequest"
                      />

                      <!-- </q-scroll-area> -->
                    </q-tab-panel>
                  </q-tab-panels>
                </div>
              </q-tab-panel>
            </q-tab-panels>
            <!-- </template>
            </q-splitter>-->
          </div>
          <div v-else class="text-caption">
            <q-item>Im Moment hast du keine Anfragen</q-item>
          </div>
        </q-list>
      </q-tab-panel>
      <q-tab-panel name="current" class="q-pa-none">
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
      <q-tab-panel name="outgoing">Hier kommen dann die ausgehenden</q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import ChatItem from "components/ChatItem";
import LiftPopup from "components/LiftPopup";
import ShortLiftInfo from "components/ShortLiftInfo";
import TitleButtonAnchor from "components/TitleButtonAnchor";
import IncomingLiftRequest from "components/IncomingLiftRequest";
import TextPagination from "components/TextPagination";

import { date } from "quasar";

export default {
  components: {
    ChatItem,
    LiftPopup,
    ShortLiftInfo,
    TitleButtonAnchor,
    IncomingLiftRequest,
    TextPagination,
  },

  data() {
    return {
      lifts: this.$store.getters["auth/user"].chatLifts,
      alreadyTappedOnItem: false,
      liftTab: "current",
      chatPopup: {
        isOpen: false,
        data: null,
      },
      shortLiftPopup: {
        isOpen: false,
        data: null,
      },
      liftRequests: this.$store.getters["auth/user"].liftRequests,
      liftRequestDayTab: null,
      liftRequestTimeTab: null,
    };
  },

  watch: {
    liftRequestDayTab: function (newDay) {
      if (!this.liftRequests[newDay][this.liftRequestTimeTab]) {
        // if previous selected lift isn't present at that day, select first lift of that day
        this.liftRequestTimeTab = Object.keys(this.liftRequests[newDay])[0];
      }
    },
  },

  computed: {
    bigTabOptions() {
      return [
        { value: "current", icon: "playlist_add_check", label: "Bestehend" },
        {
          value: "pending",
          icon: "call_received",
          label: "Eingehende Anfragen",
        },
      ];
    },
    bigTabOptionsWithoutLabel() {
      return JSON.parse(JSON.stringify(this.bigTabOptions)).map((item) => {
        delete item.label;
        return item;
      });
    },
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
      var liftsOfThatDay = Object.keys(
        this.liftRequests[this.liftRequestDayTab]
      );
      lift = this.lifts[idOfLiftToBeViewed];
      return lift;
    },

    thumbStyle() {
      return {
        right: "4px",
        borderRadius: "5px",
        backgroundColor: "#027be3",
        width: "5px",
        opacity: 0.75,
      };
    },

    barStyle() {
      return {
        right: "2px",
        borderRadius: "9px",
        backgroundColor: "#027be3",
        width: "9px",
        opacity: 0.2,
      };
    },

    totalRequests() {
      var n = 0;
      Object.values(this.liftRequests).forEach((day) => {
        Object.values(day).forEach((lift) => {
          n += lift.length;
        });
      });
      return n;
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

    requestsOfDay(day) {
      var a = 0;
      Object.values(day).forEach((lift) => (a += lift.length));
      return a;
    },

    respondLiftRequest(eventObj) {
      // here comes dispatching code then
      eventObj.dayShort = this.liftRequestDayTab; // add missing information to object
      this.$store.dispatch("auth/respondLiftRequest", eventObj);
    },
  },

  mounted() {
    this.$store.commit("setPage", "Fahrten");
    this.$store.commit("setPageTrans", "slide");

    this.liftRequestDayTab = Object.keys(this.liftRequests)[0];
    this.liftRequestTimeTab = Object.keys(
      this.liftRequests[this.liftRequestDayTab]
    )[0];
  },
};
</script>