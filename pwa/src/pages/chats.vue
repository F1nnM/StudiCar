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
            <q-slide-transition>
              <q-badge
                v-if="item.value == 'pending'"
                class="q-mx-xs"
                :color="totalRequests ? 'primary' : 'dark'"
              >{{ totalRequests }}</q-badge>
            </q-slide-transition>
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
      <q-tab-panel name="pending" class="q-pa-none">
        <div v-if="totalRequests" class="row">
          <!-- <p class="text-caption">Du hast Anfragen für die folgenden Mitfahrgelegenheiten:</p> -->
          <!-- <div class="order-last q-ml-md" style="border-left: 6px dotted gray"></div> -->
          <div>
            <q-tab-panels
              swipeable
              animated
              v-model="pendingRequestTab"
              transition-prev="slide-right"
              transition-next="slide-left"
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
                  @acceptAll="respondLiftRequest"
                  @left="switchTab"
                  @right="switchTab(true)"
                />
                <ExtHr color="dark" size="xs" />
                <div
                  v-if="!(seatsLeft(lift.liftId) > 0)"
                  class="text-negative"
                >Das Auto ist im Moment voll, du kannst keine Angebote annehmen.</div>
                <div class="full-width">
                  <span
                    class="text-negative"
                    v-if="!canAcceptAllRequests(lift) && (seatsLeft(lift.liftId) > 0)"
                  >Du hast mehr Anfragen als noch Plätze frei sind!</span>
                  <q-slide-item
                    left-color="white"
                    right-color="white"
                    class="q-my-sm"
                    v-for="r in lift.requestingUsers"
                    :key="r.id"
                  >
                    <!-- <template v-slot:left v-if="seatsLeft(lift.liftId) <= 0">
                      <q-avatar>
                        <q-icon name="thumb_up" color="positive" size="sm" />
                      </q-avatar>
                      <span class="text-dark text-h6 text-uppercase">Ok</span>

                      <p class="text-grey-9">Anfrage von {{ r.name }} annehmen</p>
                    </template>
                    <template v-slot:right>
                      <q-avatar>
                        <q-icon name="thumb_down" color="negative" size="sm" />
                      </q-avatar>
                      <span class="text-dark text-h6 text-uppercase">Ne</span>

                      <p class="text-grey-9">Anfrage von {{ r.name }} ablehnen</p>
                    </template>-->
                    <div>
                      <IncomingLiftRequest
                        :requestingUser="r"
                        :liftId="lift.liftId"
                        :acceptDisabled="seatsLeft(lift.liftId) <= 0"
                        @respond="respondLiftRequest"
                      />
                    </div>
                  </q-slide-item>
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </div>
        </div>
        <div v-else class="text-caption">Im Moment hast du keine Anfragen.</div>
      </q-tab-panel>

      <q-tab-panel name="current" class="q-pa-none">
        <div v-if="lastMessages.length">
          <q-list class="q-pb-sm">
            <ChatItem
              v-for="(m, index) in lastMessages"
              :key="m.timestamp + Math.random() + ''"
              :message="m"
              :sentByName="getNameFromId(m.liftId, m.sentBy)"
              :firstItem="index == 0"
              @open="openTheLift"
              @shortLiftInfo="openShortLiftInfo"
              @right="openShortLiftInfo"
              @left="openLiftWithDetails"
            />
          </q-list>
          <LiftPopup
            @shortLiftInfo="openShortLiftInfo"
            v-model="chatPopup.isOpen"
            :detailsOpen="chatPopup.detailsOpen"
            :lift="chatPopup.data"
            @closeLift="closeLift"
            @closeAndLeave="leave"
          />
          <QrGen
            position="bottom"
            v-model="liftCodePopup.isOpen"
            linearProgress
            :input="'l' + (liftCodePopup.data ? liftCodePopup.data.id : '') + '#i' + ownId"
            text="Über diesen Code kannst du eine Fahrgemeinschaft direkt teilen."
          >
            {{ liftCodePopup.data ? liftCodePopup.data.start.name : '' }}
            <span class="q-mx-xs">›</span>
            {{ liftCodePopup.data ? liftCodePopup.data.destination.name : '' }}
          </QrGen>
        </div>
        <div
          v-else
          class="text-caption"
        >Du nimmst noch an keinen Fahrten teil. Frage auf dem Marktplatz bei einer Fahrt an oder biete selber eine an.</div>
      </q-tab-panel>
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
      ownId: this.$store.getters["auth/user"].uid,
      alreadyTappedOnItem: false,
      liftTab: "current",
      pendingRequestTab: 0,
      chatPopup: {
        isOpen: false,
        detailsOpen: false,
        data: null
      },
      liftCodePopup: {
        isOpen: false,
        data: null
      }
    };
  },

  watch: {
    liftTab: function(newTab) {
      if (newTab == "current") this.pendingRequestTab = 0; // fallback, because there are edge cases that hide incoming offers when this tab != 0
    }
  },

  computed: {
    lifts() {
      return this.$store.getters["auth/user"].chatLifts;
    },
    liftRequests() {
      return this.$store.getters["auth/user"].liftRequests;
    },
    lastMessages() {
      var returnedArray = [];
      var lifts = JSON.parse(JSON.stringify(this.lifts));
      lifts.forEach((lift, index) => {
        if (
          lift.messages.length > 0 &&
          lift.messages[lift.messages.length - 1].content
        ) {
          var lastMessage = lift.messages[lift.messages.length - 1];
          returnedArray.push({
            liftId: lift.id,
            start: lift.start.name,
            destination: lift.destination.name,
            sentBy: lastMessage.sentBy,
            type: lastMessage.type,
            content: lastMessage.content,
            timestamp: lastMessage.timestamp
          });
        }
      });
      returnedArray.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ); // sort descending, so swap compared values

      return returnedArray;
    },

    withoutMessages() {
      var returnedArray = [];
      var lifts = JSON.parse(JSON.stringify(this.lifts));
      lifts.forEach((lift, index) => {
        var hasMessageButNoContent = lift.messages.length
          ? !lift.messages[lift.messages.length - 1].content
          : true;
        if (lift.messages.length == 0 || hasMessageButNoContent) {
          returnedArray.push({
            liftId: lift.id,
            start: lift.start.name,
            destination: lift.destination.name,
            daysLeft: date.getDateDiff(new Date(lift.date), new Date(), "days"),
            timestamp: new Date()
          });
        }
      });
      returnedArray.sort((a, b) => a.daysLeft - b.daysLeft);

      return returnedArray;
    },

    bigTabOptions() {
      return [
        { value: "current", icon: "playlist_add_check", label: "Bestehend" },
        {
          value: "pending",
          icon: "call_received",
          label: "eingehende Anfrage" + (this.totalRequests != 1 ? "n" : "")
        }
      ];
    },
    bigTabOptionsWithoutLabel() {
      return JSON.parse(JSON.stringify(this.bigTabOptions)).map(item => {
        delete item.label;
        return item;
      });
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
    async refreshContent(res, rej) {
      var method =
        this.liftTab == "current" ? "reloadChatLifts" : "getLiftRequests";
      this.$store.dispatch("auth/" + method, {
        res: res,
        rej: rej
      });
    },

    switchTab(right) {
      var a = this.pendingRequestTab,
        max = this.liftRequests.length - 1,
        min = 0;
      if (right) {
        if (a < max) this.pendingRequestTab++;
      } else {
        if (a > min) this.pendingRequestTab--;
      }
    },

    getNameFromId(liftId, userId) {
      var lift = this.lifts.find(l => l.id == liftId);
      var people = [];
      lift.passengers.forEach(item => people.push(item));
      people.push(JSON.parse(JSON.stringify(lift.driver)));
      if (userId == "NT7XvvMLjlXn0NJozPGb7WF4zac2") return "StudiCar";
      else {
        var a = people.find(p => p.id == userId);
        if (!a) return "[Ehemalig]";
        else return a.name;
      }
    },

    canAcceptAllRequests(lift) {
      return this.seatsLeft(lift.liftId) > lift.requestingUsers.length;
    },

    getPassengerNameFromId(lift, userId) {
      if (!lift.passengers) alert("no passengers");

      var people = {};
      lift.passengers.forEach(p => (people[p.id] = p.name));
      people[lift.driver.id] = lift.driver.name;
      var a = people[userId];
      if (!a) return "[Ehemalig]";
      else return a.name;
    },

    getLiftFromId(liftId) {
      return this.lifts.find(l => l.id == liftId);
    },

    seatsLeft(liftId) {
      const lift = this.getLiftFromId(liftId);
      var a = lift.car.allSeats - lift.passengers.length;
      return a;
    },

    openTheLift(liftId) {
      /* var enableDoubleTap = false;

      if (!process.env.DEV) enableDoubleTap = false; // just to be sure
      if (!enableDoubleTap) { */
      this.openLiftPopup(liftId);
      /* } else {
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
      } */
    },

    openLiftWithDetails(liftId) {
      this.chatPopup.detailsOpen = true;
      this.openLiftPopup(liftId);
    },

    openLiftPopup(liftId) {
      var lift = this.lifts.find(l => l.id == liftId);
      this.chatPopup.data = lift;
      this.liftCodePopup.isOpen = false; // just to be sure
      this.chatPopup.isOpen = true;
    },

    openShortLiftInfo(liftId) {
      var lift = this.lifts.find(l => l.id == liftId);
      this.liftCodePopup.data = lift;
      this.liftCodePopup.isOpen = true;
    },

    finalize(reset) {
      this.timer = setTimeout(() => {
        reset();
      }, 50);
    },

    respondLiftRequest(eventObj) {
      this.$store.dispatch("auth/respondLiftRequest", eventObj);
    },

    closeLift() {
      this.chatPopup.data = null;
      this.chatPopup.isOpen = false;
    },

    leave(liftId) {
      this.closeLift();
      this.$store.dispatch("auth/leaveLift", liftId);
    }
  },

  mounted() {
    this.$store.commit("setPage", {
      name: "Fahrten"
    });
  }
};
</script>