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
      >
        <q-layout view="hHh lpR fFr" class="bg-white q-pa-none">
          <q-header reveal elevated class="bg-primary text-white">
            <div class="row">
              <div class="col-8 bg-primary row items-center">
                <q-toolbar>
                  <q-toolbar-title>
                    Würzburg &rarr; Ansbach
                    <q-btn flat round dense icon="search" />
                  </q-toolbar-title>
                </q-toolbar>
              </div>

              <div class="col-4 bg-white text-primary">
                <q-toolbar>
                  <q-toolbar-title>
                    <q-btn
                      @click="openLiftInfo = true"
                      icon="info"
                      flat
                      v-ripple
                      round
                      dense
                      class="q-mr-sm"
                    />
                    <q-btn v-ripple icon="close" flat round dense @click="$emit('close')" />
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
            @show="loadLiftInfo"
          >
            <div class="q-pa-md">
              <p class="text-h6 row items-center">
                Info
                <q-space />
                <q-btn icon="close" flat round dense @click="openLiftInfo = false" />
              </p>
              <q-slide-transition>
                <div v-if="loading == 1">
                  <q-separator spaced />
                  <p class="q-mt-md text-center">
                    Daten werden geladen
                    <q-circular-progress indeterminate size="20px" color="primary" class="q-ma-md" />
                  </p>
                </div>
              </q-slide-transition>
              <div v-if="loading == -1">
                <q-card>
                  <q-card-section>
                    <p>
                      <q-icon name="error_outline" size="md" color="negative" />Ein Fehler ist aufgetreten. Wenn das auftritt, dann
                      <a
                        href="#/contact"
                      >schreib uns</a> bitte.
                    </p>
                  </q-card-section>
                </q-card>
              </div>
              <div v-if="loading == 2">
                <q-card flat bordered class="my-card bg-grey-1">
                  <q-card-section>
                    <div class="row items-center no-wrap">
                      <div class="col">
                        <div class="text-h6">{{lift.car.brand}} {{lift.car.model}}</div>
                        <div class="text-subtitle2">{{lift.car.type}}</div>
                        <extHR :color="lift.car.color" size="xs" />
                      </div>

                      <div class="col-auto">
                        <q-btn color="grey-7" round flat icon="more_vert">
                          <q-menu cover auto-close>
                            <q-btn flat clickable @click="viewCar()">Modell online ansehen</q-btn>
                          </q-menu>
                        </q-btn>
                      </div>
                    </div>
                  </q-card-section>
                  <q-card-section>{{lift.car.licensePlate}}</q-card-section>
                  <q-separator />
                </q-card>

                <q-list bordered>
                  <q-item-label header>
                    <p v-if="lift.passengers.length > 0">
                      Mitfahrer
                      <span class="text-caption float-right">
                        {{lift.passengers.length}} / {{lift.seats}}
                        <q-icon name="airline_seat_recline_normal" size="xs" />belegt
                      </span>
                    </p>
                    <p
                      v-if="lift.passengers.length == 0"
                      class="text-center q-pt-sm text-gray"
                    >Bis jetzt hast du noch keine Mitfahrer.</p>
                    <p
                      class="text-right text-primary text-caption"
                      v-if="lift.passengers.length == lift.seats"
                    >Volles Auto. Wow!</p>
                  </q-item-label>
                  <q-item
                    v-for="item in lift.passengers"
                    :key="item.userId"
                    clickable
                    @click="alert"
                  >
                    <q-item-section top avatar>
                      <q-avatar>
                        <img :src="getImageOfUser(item.userId)" />
                      </q-avatar>
                    </q-item-section>

                    <q-item-section>
                      <q-item-label>{{item.nameOfUser}}</q-item-label>
                      <q-item-label caption>
                        <div class="row">
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
                        </div>
                      </q-item-label>
                    </q-item-section>

                    <q-item-section side top>
                      <q-icon name="directions_car" v-if="item.userId == user" size="sm" />
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
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

              <div v-for="item in messages.list" :key="item.timestamp">
                <q-chat-message
                  class="custom-chat-label q-mt-xl text-gray"
                  v-if="checkDayBreak(item) != ''"
                  :label="checkDayBreak(item)"
                />
                <div>
                  <q-chat-message
                    :name="item.userId == user ? '' : item.nameOfUser"
                    :sent="item.userId == user"
                    size="8"
                    text-sanitize
                    :text="item.type == 2 ? [] : [item.content]"
                    :stamp="formatDate(item)"
                    :bg-color="getColor(item.userId)"
                  >
                    <div v-if="item.type == 2">
                      <audio
                        v-if="item.type == 2"
                        :src="makeAudioSRC(item.content)"
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
            <extHR color="primary" size="xs" />
            <div class="row">
              <div class="col-xs-10 col-md-11 bg-grey-3">
                <q-btn flat dense icon="call_split" v-if="false"></q-btn>
                <q-toolbar>
                  <q-toolbar-title>
                    <q-form @submit="sendMessage" class="q-gutter-md q-pa-none">
                      <q-input
                        type="text"
                        class="custom-input q-pa-none"
                        v-model="messageText"
                        placeholder="Schreibe etwas..."
                      />
                    </q-form>
                  </q-toolbar-title>
                </q-toolbar>
              </div>

              <div class="col-xs-2 bg-white text-center">
                <vue-record-audio
                  :style="'transform: scale(' +  (recorderBig ? 2.4 : 1) + ')'"
                  v-show="!messageText"
                  mode="hold"
                  @result="sendAudio"
                  @onContextMenu="false"
                  @stream="recorderBig = true"
                  class="record-audio"
                />

                <q-btn
                  @click="sendMessage(1)"
                  icon="arrow_forward_ios"
                  flat
                  v-show="messageText"
                  round
                  dense
                  class="q-mr-sm bg-green-10 text-white"
                  style="transition: all .1s"
                />
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
  },
  data() {
    return {
      openLayout: true,
      closing: false,
      alreadyScrolledDown: false,
      coloredIDs: {},
      recorderBig: false,
      openLiftInfo: false,
      messageText: "",
      user: this.$store.getters["auth/user"].id,
      lift: {
        car: {
          brand: "",
          model: "",
          color: "",
          type: "",
          licensePlate: "",
        },
        passengers: [],
        seats: 0, // all "empty" data just to avoid errors when calling variables
      },
      loading: 0, // as always: 0 means not loading, 1 means in progress, 2 means success and -1 error.
    };
  },
  props: {
    open: {
      type: Boolean,
      required: true,
    },
    messages: {
      type: Object, // not required to avoid error messages
      list: [], // I have chosen this unusual way because Array as type didn't work. So I give messages as property and take the real data from the inner array
    },
  },
  computed: {
    liftId() {
      var firstMessage = this.messages.list[0] || { firstId: 1 }; // when no messages selected, just give 1 as parameter
      return firstMessage.liftId;
    },
    isLayoutOpen() {
      // if(!this.open && !this.closing){
      //   this.closing = true
      //   setTimeout(_=>{
      //     this.openLayout = false
      //   }, 500) // 500ms after getting the close trigger layout will be hidden, because otherwise it would still be visible and just a blank area below the last messages
      //   return true
      // }

      return true;
    },
  },

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

    checkDayBreak(message) {
      // when a parameter is given, return true or false. When no parameter is given, returns the text of the label
      // currently function is always called with a parameter given
      var pos = this.messages.list.indexOf(message);

      var label = false;

      if (!this.open) return;

      if (pos > 0) {
        var preceder = this.messages.list[pos - 1]; // preceder is the older message

        var sameDay = date.isSameDate(
          new Date(message.timestamp),
          new Date(preceder.timestamp),
          "day"
        ); // alwast newest time first at this function
        var sameMonth = date.isSameDate(
          new Date(message.timestamp),
          new Date(preceder.timestamp),
          "month"
        );
      } else if (pos == 0) {
        // though check timestamp of message
        var sameDay = date.isSameDate(
          new Date(message.timestamp),
          new Date(),
          "day"
        );
        var sameMonth = date.isSameDate(
          new Date(message.timestamp),
          new Date(),
          "month"
        );
      }

      var diff = date.getDateDiff(
        new Date(),
        new Date(message.timestamp),
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

      //console.warn(label)

      return label;
    },

    formatDate(item) {
      // var fullDate = date.formatDate(item.timestamp, 'DD.MM.YYYY - H:mm')
      var normalDate = date.formatDate(item.timestamp, "H:mm");
      return normalDate;
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
        car.brand +
        "+" +
        car.model.replace(" ", "") +
        "+" +
        car.type +
        "+" +
        this.lift.car.color;
      openURL("https://www.ecosia.org/images?q=" + search); // easiest way, real images from db would be an extra study exam for laws student
    },

    loadLiftInfo() {
      if (this.loading != 1) {
        // just in case this function is called more times, this is a catcher
        this.loading = 1;
        var t = setTimeout((_) => {
          loading = -1; // simple request timeout after 10sec, I have built it because there were some issues I had no idea where they were coming from
        }, 10000);
        sendApiRequest(
          SQL_GET_LIFT_INFO,
          {
            id: this.liftId,
          },
          (lift) => {
            try {
              this.loading = 2;
              this.lift = lift; // data is structured exact like "empty" values above
              clearTimeout(t);
            } catch (e) {
              alert("error: " + e);
              this.loading = -1;
              clearTimeout = -1;
            }
          },
          (error) => {
            this.loading = -1;
            alert("errr");
            clearTimeout(t);
          }
        );
      }
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
</style>