<template v-show="open">
  <div>
    <div class="q-ma-none q-pa-none">
      <!-- <span v-if="isLayoutOpen"></span> -->
      <q-dialog
        v-model="open"
        persistent
        maximized
        transition-show="slide-up"
        transition-hide="slide-down"
        @show="scrollDown()"
        @input="emitAndClose()"
      >
        <q-layout view="hHh lpR fFr" class="bg-white q-pa-none">
          <q-header reveal elevated class="bg-primary text-white">
            <div class="row">
              <div class="col-10 bg-primary">
                <q-toolbar>
                  <q-toolbar-title class="row">
                    <div class="col-9 text-h6 text-weight-light">
                      {{ lift.start.name }}
                      <span class="q-mx-sm">&rsaquo;</span>
                      {{ lift.destination.name }}
                    </div>
                    <div class="col-3 text-right">
                      <!-- <q-btn flat round dense icon="search" /> -->
                      <q-btn
                        @click="openLiftInfo = true"
                        icon="info"
                        flat
                        v-ripple
                        round
                        size="md"
                        dense
                        class="q-mr-sm"
                      />
                    </div>
                  </q-toolbar-title>
                </q-toolbar>
              </div>
              <div class="col-2 bg-white text-primary">
                <q-toolbar>
                  <q-toolbar-title>
                    <q-btn v-ripple icon="close" flat round dense @click="emitAndClose()" />
                  </q-toolbar-title>
                </q-toolbar>
              </div>
            </div>
          </q-header>
          <q-drawer
            v-model="openLiftInfo"
            :width="300"
            :breakpoint="500"
            overlay
            side="right"
            bordered
            show-if-above
          >
            <div class="q-pa-md">
              <p class="text-h6 row items-center">
                Info
                <q-btn flat class="q-ml-sm" icon="select_all" size="md" @click="showQR = !showQR" />

                <q-space />
                <q-btn icon="close" flat round dense @click="openLiftInfo = false" />
              </p>
              <q-slide-transition>
                <div v-if="showQR">
                  <div class="relative-position text-center">
                    <VueQrcode
                      class="full-width"
                      color="primary"
                      errorCorrectionLevel="H"
                      :value="lift.qr"
                    />
                    <q-img src="~assets/app-icon.svg" class="absolute-center qrcode-image" />
                  </div>
                  <p
                    class="text-center text-caption"
                  >Vergrößerte Ansicht, geeignet für kleine und dunkle Bildschirme</p>
                </div>
              </q-slide-transition>

              <extHR color="grey-4" size="xs" />
              <q-timeline color="primary" class="q-mt-xl">
                <!-- <q-item-label header>Fahrtverlauf</q-item-label> -->
                <q-timeline-entry>
                  <template v-slot:title>
                    <p>
                      {{ lift.start.name }}
                      <span
                        class="q-ml-md text-subtitle1"
                      >{{ formatAsTime(lift.departAt) }}</span>
                    </p>
                  </template>
                </q-timeline-entry>
                <q-timeline-entry>
                  <template v-slot:title>
                    <p>
                      {{ lift.destination.name }}
                      <span
                        class="q-ml-md text-subtitle1"
                      >{{ formatAsTime(lift.arriveBy) }}</span>
                      <!-- <q-badge floating v-if="lift.destination.id < 4">
                            <q-icon color="dark" name="school" size="xs" />
                      </q-badge>-->
                    </p>
                  </template>
                </q-timeline-entry>
              </q-timeline>
              <div class="shadow-9 q-pa-md">
                <div class="row">
                  <div class="col-6">
                    <div class="text-subtitle1">{{ lift.car.brand }} {{ lift.car.model }}</div>
                    <div class="text-caption">{{ lift.car.type }}</div>
                  </div>
                  <div class="col-5">
                    <q-avatar>
                      <div :style="`background-color: ${ lift.car.color }`" class="full-width">
                        <q-img src="~assets/app-icon_color_preview.png" />
                      </div>
                    </q-avatar>
                    <q-btn color="grey-7" round flat dense icon="help_outline">
                      <q-menu cover auto-close>
                        <q-btn flat no-caps clickable @click="viewCar()">Modell online ansehen</q-btn>
                      </q-menu>
                    </q-btn>
                  </div>
                </div>
                <extHR :color="lift.car.color" hex size="xs" class="q-my-sm" />
                <p
                  class="text-grey-7 q-mb-none"
                >{{ lift.car.licensePlate }} - Baujahr {{ lift.car.built }}</p>
              </div>

              <q-list bordered class="q-mt-md">
                <q-item-label header>Fahrer</q-item-label>
                <q-item>
                  <q-item-section top avatar>
                    <q-avatar>
                      <img :src="getImageOfUser(lift.driver.id)" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <p>
                      {{ lift.driver.name }}
                      <br />
                      <small>{{ lift.driver.surname }}</small>
                    </p>
                  </q-item-section>
                </q-item>
                <q-item-label header>
                  <p v-if="lift.passengers.length">
                    Mitfahrer
                    <span class="text-caption float-right">
                      {{ lift.car.occupiedSeats }} / {{ lift.car.allSeats }}
                      <q-icon name="airline_seat_recline_normal" size="xs" />
                    </span>
                  </p>
                  <p
                    v-if="!lift.passengers.length"
                    class="text-center q-pt-sm text-gray"
                  >Bis jetzt hast du noch keine Mitfahrer.</p>
                  <p
                    class="text-right text-primary text-caption"
                    v-if="lift.passengers.length == lift.seats"
                  >Volles Auto. Wow!</p>
                </q-item-label>
                <q-item v-for="item in lift.passengers" :key="item.id" clickable @click="alert">
                  <q-item-section top avatar>
                    <q-avatar>
                      <img :src="getImageOfUser(item.id)" />
                    </q-avatar>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label>
                      {{ item.name }}
                      <br />
                      <small>{{ item.surname }}</small>
                    </q-item-label>
                    <q-item-label caption>
                      <!-- <div class="row">
                          <div class="col-3">
                            <p :class="'text-' + pref.talk.toLowerCase()">●</p>
                          </div>
                          <div class="col-3">
                            <p :class="'text-' + pref.talkMorning.toLowerCase()">●</p>
                          </div>
                          <div class="col-3">
                            <p :class="'text-' + pref.smoking.toLowerCase()">●</p>
                          </div>
                          <div class="col-3">
                            <p :class="'text-' + pref.music.toLowerCase()">●</p>
                          </div>
                      </div>-->
                    </q-item-label>
                  </q-item-section>

                  <q-item-section side top>
                    <q-icon name="directions_car" v-if="item.id == user" size="sm" />
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </q-drawer>
          <q-page-container>
            <div class="q-pa-md bg-white scroll overflow-hidden" id="scrollTarget">
              <!-- v-touch-swipe.mouse.right="goBack" -->
              <q-page-scroller
                reverse
                position="bottom-right"
                :scroll-offset="1000"
                :duration="50"
                :offset="[10, 18]"
              >
                <q-page-sticky position="bottom-right" :offset="[18, 18]">
                  <q-btn fab icon="add" color="accent" />
                </q-page-sticky>
              </q-page-scroller>

              <div v-for="m in lift.messages" :key="m.timestamp">
                <p
                  class="custom-chat-label text-caption text-center q-mt-xl text-grey-7"
                  v-if="checkDayBreak(m) != ''"
                >{{ checkDayBreak(m) }}</p>
                <div>
                  <q-chat-message
                    :name="m.sentBy == user ? '' : getNameFromId(m.sentBy)"
                    :sent="m.sentBy == user"
                    size="8"
                    text-sanitize
                    :text="m.type == 2 ? [] : [m.content]"
                    :stamp="formatAsTime(m.timestamp)"
                    :bg-color="getColor(m.id)"
                  >
                    <div v-if="m.type == 2">
                      <audio
                        v-if="m.type == 2"
                        :src="makeAudioSRC(m.content)"
                        controls
                      >Dein Browser unterstützt keine Audios.</audio>
                      <div>
                        <p>[Custom Controls]</p>
                      </div>
                    </div>
                  </q-chat-message>
                </div>
              </div>
              <span id="endOfPage"></span>
            </div>
          </q-page-container>

          <q-footer reveal class="q-pa-none text-white">
            <!-- <extHR color="primary" size="xs" /> -->
            <div class="row">
              <div class="col-xs-10 col-md-11 bg-grey-3">
                <!-- <q-btn flat dense icon="call_split" /> -->
                <q-toolbar>
                  <q-toolbar-title>
                    <q-form @submit="sendMessage" class="q-gutter-md q-pa-none">
                      <q-input
                        type="text"
                        class="custom-input q-pa-none"
                        v-model="messageText"
                        placeholder="Schreib eine Nachricht..."
                      />
                    </q-form>
                  </q-toolbar-title>
                </q-toolbar>
              </div>

              <div class="col-xs-2 bg-white text-center">
                <q-toolbar>
                  <q-toolbar-title>
                    <q-btn
                      @click="sendMessage(1)"
                      icon="arrow_forward_ios"
                      flat
                      v-if="messageText"
                      round
                      dense
                      class="q-mr-sm bg-positive text-white"
                      style="transition: all .1s"
                    />
                    <vue-record-audio
                      :style="'transform: scale(' +  (recorderBig ? 2.4 : 1) + ')'"
                      v-else
                      mode="hold"
                      @result="sendAudio"
                      @onContextMenu="false"
                      @stream="recorderBig = true"
                      class="record-audio"
                    />
                  </q-toolbar-title>
                </q-toolbar>
              </div>
            </div>
          </q-footer>
        </q-layout>
      </q-dialog>
    </div>
  </div>
</template>

<script>
import { openURL, date, scroll } from "quasar";
import extHR from "components/ExtendedHr";
import VueQrcode from "vue-qrcode";
import LiftInfoDrawer from "components/LiftInfoDrawer";
import {
  sendApiRequest,
  SQL_SEND_MESSAGE,
  SQL_GET_LIFT_INFO,
} from "../ApiAccess";

const { getScrollPosition, setScrollPosition } = scroll;

export default {
  name: "LiftPopup",
  components: {
    extHR,
    VueQrcode,
  },
  data() {
    return {
      alreadyScrolledDown: false,
      showQR: false,
      coloredIDs: {},
      recorderBig: false,
      openLiftInfo: false,
      messageText: "",
      user: this.$store.getters["auth/user"].id,
      // lift: {
      //   car: {
      //     brand: "",
      //     model: "",
      //     color: "",
      //     type: "",
      //     licensePlate: "",
      //   },
      //   passengers: [],
      //   seats: 0, // all "empty" data just to avoid errors when calling variables
      // },
      loading: 0, // as always: 0 means not loading, 1 means in progress, 2 means success and -1 error.
    };
  },
  model: {
    prop: "open",
    event: "input",
  },
  props: {
    open: Boolean,
    lift: Object,
  },
  computed: {},

  mounted() {
    //  document.getElementById("recordButton").onmousedown = (event) => {
    //    event.preventDefault()
    //    this.recordAudio()
    //  }
    //  document.getElementById("recordButton").onmouseup = (event) => {
    //    event.preventDefault()
    //    this.sendAudio()
    //  }
  },

  methods: {
    getImageOfUser(id) {
      return require("../assets/sad.svg");
    },

    getNameFromId(userId) {
      var people = JSON.parse(JSON.stringify(this.lift.passengers)); // otherwise passengers would be overwritten
      people.push(this.lift.driver);
      return people.find((p) => {
        return p.id == userId;
      }).name;
    },

    makeBLOB(data) {
      try {
        var s = window.URL.createObjectURL(data);
        var blob = new Blob(s, { type: "application/json" });
        return blob;
      } catch (e) {
        console.error("---");
        console.error("could not make BLOB");
        console.error("---");
        return null;
      }
    },

    alert() {
      alert("köb");
    },

    emitAndClose() {
      this.open = false;
      this.$emit("input", this.open);
    },

    getColor(userId) {
      if (userId == this.user) return "light-blue-2";
      // Sent messages have special color
      else {
        /* just some standard colors from the quasar palette: */
        var dark = [
          "deep-purple-10",
          "indigo-10",
          "teal-10",
          "lime-10",
          "brown",
          "grey-10",
          "red-14",
          "blue-grey-10",
        ]; // dark/colorful selection
        var light = [
          "red-3",
          "indigo-3",
          "purple-2",
          "blue-1",
          "green-3",
          "yellow-3",
          "orange-4",
          "deep-orange-2",
          "brown-4",
          "grey-6",
        ];
        if (!this.coloredIDs[userId]) {
          // userId hasn't been colored so far, we have to assign new color
          // colors are assigned one after another. So we just have to get the numbers of properties of coloredIDs and know, which color will be assigned next
          var next = Object.keys(this.coloredIDs).length;
          this.coloredIDs[userId] = light[next];
        }
        return this.coloredIDs[userId];
      }
    },

    checkDayBreak(messageItem) {
      // when a parameter is given, return true or false. When no parameter is given, returns the text of the label
      // currently function is always called with a parameter given
      var messages = this.lift.messages,
        pos = this.lift.messages.indexOf(messageItem),
        label = false;

      if (!this.open) return;

      if (pos > 0) {
        var preceder = messages[pos - 1]; // preceder is the older message

        var sameDay = date.isSameDate(
          new Date(messageItem.timestamp),
          new Date(preceder.timestamp),
          "day"
        ); // alwast newest time first at this function
        var sameMonth = date.isSameDate(
          new Date(messageItem.timestamp),
          new Date(preceder.timestamp),
          "month"
        );
      } else if (pos == 0) {
        // though check timestamp of message
        var sameDay = date.isSameDate(
          new Date(messageItem.timestamp),
          new Date(),
          "day"
        );
        var sameMonth = date.isSameDate(
          new Date(messageItem.timestamp),
          new Date(),
          "month"
        );
      }

      var diff = date.getDateDiff(
        new Date(),
        new Date(messageItem.timestamp),
        "days"
      );

      // if you have the order the other way round (newest on top of list and oldest on bottom), then just swap the two params

      if (!sameDay) {
        // checks whether the item and its preceder are not the same day (and not the same month)
        switch (diff) {
          case 0:
            label = "Heute";
            break;
          case 1:
            label = "Gestern";
            break;
          case 3:
            label = "Vorgestern";
            break;
          default:
            label = "Vor " + diff + " Tagen";
        }
      }
      return label;
    },

    formatAsTime(dateString) {
      var d = date.formatDate(new Date(dateString), "H:mm");
      return d;
    },

    false() {
      return false;
    },

    scrollDown() {
      // setTimeout(_=> {
      //   var target = getScrollTarget('endOfPage')
      //   setScrollPosition (target, target.offsetTop, 0)
      // }, 100)
    },

    preventDefault(e) {
      e.preventDefault();
    },

    makeAudioSRC(buffer) {
      const blob = new Blob([buffer], { type: "audio/mp3" });
      console.warn(blob);
      return window.URL.createObjectURL(blob);
    },

    sendAudio(blob) {
      this.sendMessage(2, blob);
    },

    sendMessage(type, blob) {
      this.recorderBig = false;
      var msgObj = {
        content: "",
        type: 0, // 1 means raw text, 2 means audio, 3 means image (hopefully will come in the future)
        liftId: this.messages.list[0].liftId, // all from same lift, doesn't matter which one is taken
        timestamp: Date.now(),
      };
      switch (type) {
        case 1: // only text
        default:
          // when no type is given, propably sent from form which doesn't give any parameters, but still text
          msgObj.content = this.messageText;
          msgObj.type = 1;
          break;
        case 2: // audio
          msgObj.type = 2;
          var content = makeBinary(blob);

          if (!content) {
            break;
            return;
          }
          msgObj.content = content;
          break;
        case 3:
          var content = makeBinary(blob);
          if (!content) return;
          msgObj.content = content;
          msgObj.type = 3;
          break;
      }

      function makeBinary(blob) {
        try {
          return window.URL.createObjectURL(blob);
        } catch (e) {
          return false;
        }
      }

      console.log(blob);
      console.log(JSON.stringify(blob));
      sendApiRequest(
        SQL_SEND_MESSAGE,
        {
          id: this.user,
          message: msgObj,
        },
        (data) => {
          // is id of just inserted row
          // check whether last message was from this user
          msgObj.messageId = data;
          msgObj.nameOfUser = this.$store.getters["auth/user"].name.split(
            " "
          )[0];
          msgObj.userId = this.user;
          msgObj.destination = this.messages.list[0].destination; // just copy the remaining properties from the other messages
          msgObj.start = this.messages.list[0].start;
          this.messages.list.push(msgObj);
          this.messages.list.sort((a, b) => {
            return a.timestamp < b.timestamp;
          });
        },
        (error) => {
          throw error;
        }
      );

      this.messageText = "";
      setTimeout(() => window.scrollTo(0, 1000000), 100);
    },

    viewCar() {
      var car = this.lift.car;
      var search =
        car.brand + "+" + car.model.replace(" ", "") + "+" + car.type;
      openURL("https://www.ecosia.org/images?q=" + search); // easiest way, real images from db would be an extra study exam for laws student
    },
  },
};
</script>

<style scoped lang="scss">
.hiding {
  animation: hide 0.8s forwards;
}
@keyframes hide {
  0%,
  99% {
    visibility: visible;
  }
  100% {
    visibility: hidden;
  }
}

.custom-chat-label {
  position: relative;
  &:after {
    content: "";
    position: absolute;
    top: -5px;
    left: 50%;
    transform: translateX(-50%);
    width: 10vw;
    border-top: 1px solid lightgray;
  }

  > .q-message-label.text-center {
    margin: 0px;
  }
}

.qrcode-image {
  width: 55px;
  height: 55px;
  background: white;
}
</style>