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
    <LiftPopup :open="liftOpen" :messages="messagesToBeShown" @close="liftOpen = false" />
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
      liftOpen: false,
      liftOpenId: null,
      messagesToBeShown: {
        list: [],
      },
      allMessages: JSON.parse(
        JSON.stringify(this.$store.getters["auth/user"].messages)
      ),
      lifts: require("../js/apiResponse").lifts,
      alreadyTappedOnItem: false,
      shortLiftPopup: {
        isOpen: false,
        data: require("../js/dummyValues").chats.shortLiftInfo,
      },
    };
  },

  computed: {
    lastMessages() {
      var returnedArray = [];
      for (let lift in this.lifts) {
        var data = this.lifts[lift],
          lastMessage = data.messages[data.messages.length - 1];
        returnedArray.push({
          liftId: lift, // just name of key
          start: data.start.name,
          destination: data.destination.name,
          sentBy: this.getNameFromId(lift, lastMessage.sentBy),
          type: lastMessage.type,
          content: lastMessage.content,
          timestamp: lastMessage.timestamp,
        });
        // if(firstItem) firstItem = false; // just not to have a gray line above top item
      }
      return returnedArray;
    },
  },

  mounted() {
    this.$store.commit("setPage", "Mitfahrgelegenheiten");
    this.$store.commit("setPageTrans", "slide");
  },

  ready() {
    this.liftOpenId = this.lifts[0].id;
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
        people = lift.passengers;
      people.push(lift.driver);
      return people.find((p) => {
        return p.id == userId;
      }).name;
    },

    openTheLift(liftId) {
      var enableDoubleTap = false;

      if (!process.env.DEV) enableDoubleTap = false; // just to be sure
      if (!enableDoubleTap) {
        this.liftOpen = true;
        this.messagesToBeShown = this.allMessages[liftId];
      } else {
        if (this.alreadyTappedOnItem) this.openShortLiftInfo(liftId);
        else {
          this.alreadyTappedOnItem = true;
          setTimeout((_) => {
            if (!this.alreadyTappedOnItem) {
              this.liftOpen = true;
              this.messagesToBeShown = {
                list: this.sortMessages(liftId, false), // last item in array will be displayed on top of page, so we have to sort descending
              };
            }
            this.alreadyTappedOnItem = false;
          }, 200);
        }
      }
    },

    openShortLiftInfo(liftId) {
      var lift = this.lifts[liftId];
      this.shortLiftPopup.data = lift;
      this.shortLiftPopup.isOpen = true;
    },

    sortMessages(liftId, ascending) {
      var list = this.allMessages[liftId];
      list.sort((a, b) => {
        return new Date(b.timestamp) - new Date(a.timestamp);
      });
      return list;
    },

    getTimelineIcon(index, beginsAtSchool) {
      if (index == 0) return beginsAtSchool ? "school" : "home";
      else if (index == this.lift.stops.length - 1)
        return !beginsAtSchool ? "school" : "home";
      return "";
    },

    pagetrans_zoom() {
      this.$emit("pagetrans_zoom");
    },

    pagetrans_slide() {
      this.$emit("pagetrans_slide");
    },

    long_tab({ e }) {
      alert("LONG");
    },

    finalize(reset) {
      this.timer = setTimeout(() => {
        reset();
      }, 50);
    },
  },

  beforeDestroy() {
    clearTimeout(this.timer);
  },
};
</script>