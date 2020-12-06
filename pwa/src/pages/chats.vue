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

    <q-tab-panels animated v-model="liftTab" transition-prev="fade" transition-next="fade">
      <q-tab-panel name="pending" class="q-px-none">
        <div v-if="totalRequests" class="row">
          <!-- <p class="text-caption">Du hast Anfragen für die folgenden Mitfahrgelegenheiten:</p> -->
          <div class="order-last q-ml-md" style="border-left: 6px dotted gray"></div>
          <div class="col-11">
            <q-tab-panels
              swipeable
              vertical
              animated
              v-model="pendingRequestTab"
              transition-prev="slide-down"
              transition-next="slide-up"
              class="text-caption q-pa-none"
            >
              <q-tab-panel
                v-for="(lift, index) in liftRequests"
                :key="lift.liftId"
                class="q-pa-none"
                :name="index"
              >
                <LiftOfferForRequest
                  :lift="getLiftFromId(lift.liftId)"
                  :numberOfRequests="lift.requestingUsers.length"
                />
                <ExtHr color="dark" size="xs" />
                <div v-if="seatsLeft(lift.liftId) > lift.requestingUsers.length" class="full-width">
                  <IncomingLiftRequest
                    v-for="r in lift.requestingUsers"
                    :key="r.id"
                    :requestingUser="r"
                    :liftId="lift.liftId"
                    @respond="respondLiftRequest"
                  />
                </div>
                <div
                  v-else
                  class="text-negative"
                >Das Auto ist voll, du kannst keine Angebote mehr annehmen.</div>
              </q-tab-panel>
            </q-tab-panels>
          </div>
        </div>
        <div v-else class="text-caption">
          <q-item>Im Moment hast du keine Anfragen</q-item>
        </div>
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
        <LiftPopup
          @shortLiftInfo="openShortLiftInfo"
          v-model="chatPopup.isOpen"
          :lift="chatPopup.data"
        />
        <QrGen
          position="bottom"
          v-model="shortLiftPopup.isOpen"
          :label="shortLiftPopup.data ? shortLiftPopup.data.start.name + '  ›  ' + shortLiftPopup.data.destination.name : ''"
          linearProgress
          :input="'l' + (shortLiftPopup.data ? shortLiftPopup.data.qr : '')"
          text="Über diesen Code kannst du eine Fahrgemeinschaft direkt teilen."
        />
      </q-tab-panel>
      <q-tab-panel name="outgoing">Hier kommen dann die ausgehenden</q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import ChatItem from "components/ChatItem";
import LiftPopup from "components/LiftPopup";
import QrGen from "components/QrGenerator";
import ExtHr from "components/ExtendedHr";
import TitleButtonAnchor from "components/TitleButtonAnchor";
import IncomingLiftRequest from "components/IncomingLiftRequest";
import LiftOfferForRequest from "components/LiftOfferForRequest";
import TextPagination from "components/TextPagination";

import { date } from "quasar";

export default {
  components: {
    ChatItem,
    LiftPopup,
    QrGen,
    TitleButtonAnchor,
    IncomingLiftRequest,
    LiftOfferForRequest,
    ExtHr
  },

  data() {
    return {
      lifts: this.$store.getters["auth/user"].chatLifts,
      alreadyTappedOnItem: false,
      liftTab: "current",
      pendingRequestTab: 0,
      chatPopup: {
        isOpen: false,
        data: null
      },
      shortLiftPopup: {
        isOpen: false,
        data: null
      },
      liftRequests: this.$store.getters["auth/user"].liftRequests,
      liftRequestDayTab: null,
      liftRequestTimeTab: null
    };
  },

  watch: {
    liftRequestDayTab: function(newDay) {
      if (!this.liftRequests[newDay][this.liftRequestTimeTab]) {
        // if previous selected lift isn't present at that day, select first lift of that day
        this.liftRequestTimeTab = Object.keys(this.liftRequests[newDay])[0];
      }
    }
  },

  computed: {
    bigTabOptions() {
      return [
        { value: "current", icon: "playlist_add_check", label: "Bestehend" },
        {
          value: "pending",
          icon: "call_received",
          label: "Eingehende Anfragen"
        }
      ];
    },
    bigTabOptionsWithoutLabel() {
      return JSON.parse(JSON.stringify(this.bigTabOptions)).map(item => {
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
          timestamp: lastMessage.timestamp
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

    thumbStyle() {
      return {
        right: "4px",
        borderRadius: "5px",
        backgroundColor: "#027be3",
        width: "5px",
        opacity: 0.75
      };
    },

    barStyle() {
      return {
        right: "2px",
        borderRadius: "9px",
        backgroundColor: "#027be3",
        width: "9px",
        opacity: 0.2
      };
    },

    totalRequests() {
      var n = 0;
      Object.values(this.liftRequests).forEach(lift => {
        n += lift.requestingUsers.length;
      });
      return n;
    }
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
      return people.find(p => {
        return p.id == userId;
      }).name;
    },

    getLiftFromId(liftId) {
      return this.lifts.find(l => l.id == liftId);
    },

    seatsLeft(liftId) {
      const lift = this.getLiftFromId(liftId);
      debugger;
      var a = lift.car.allSeats - lift.passengers.length;
      return a;
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
          setTimeout(_ => {
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
      Object.values(day).forEach(lift => (a += lift.length));
      return a;
    },

    respondLiftRequest(eventObj) {
      // here comes dispatching code then
      eventObj.dayShort = this.liftRequestDayTab; // add missing information to object
      this.$store.dispatch("auth/respondLiftRequest", eventObj);
    }
  },

  mounted() {
    this.$store.commit("setPage", {
      name: "Fahrten"
    });

    this.liftRequestDayTab = Object.keys(this.liftRequests)[0];
    this.liftRequestTimeTab = Object.keys(
      this.liftRequests[this.liftRequestDayTab]
    )[0];
  }
};
</script>