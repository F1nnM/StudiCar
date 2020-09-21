<template>
  <div class="q-pa-md">
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
  </div>
</template>

<script>
import ChatItem from "components/ChatItem";
import LiftPopup from "components/LiftPopup";
import ShortLiftInfo from "components/ShortLiftInfo";
import { date } from "quasar";

export default {
  components: {
    ChatItem,
    LiftPopup,
    ShortLiftInfo,
  },

  data() {
    return {
      lifts: require("../js/apiResponse").lifts,
      alreadyTappedOnItem: false,
      chatPopup: {
        isOpen: false,
        data: require("../js/dummyValues").chats.shortLiftInfo, // can be used here as well
      },
      shortLiftPopup: {
        isOpen: false,
        data: require("../js/dummyValues").chats.shortLiftInfo,
      },
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
  },

  mounted() {
    this.$store.commit("setPage", "Mitfahrgelegenheiten");
    this.$store.commit("setPageTrans", "slide");
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
  },
};
</script>