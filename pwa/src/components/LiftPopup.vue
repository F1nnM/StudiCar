<template>
  <div>
    <div class="q-ma-none q-pa-none">
      <!-- <span v-if="isLayoutOpen"></span> -->
      <q-dialog
        :value="open"
        persistent
        maximized
        transition-show="slide-up"
        transition-hide="slide-down"
        @input="emit"
      >
        <q-layout v-if="lift" view="hHh lpR fFr" class="bg-white q-pa-none">
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
                    <q-btn v-ripple icon="close" flat round dense @click="emit" />
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
                <!-- <q-btn flat class="q-ml-sm" icon="select_all" size="md" @click="showQR = !showQR" /> -->

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
                      :value="'l' + lift.qr"
                    />
                    <q-img
                      src="~assets/app-icon_from_web_filled.png"
                      class="absolute-center qrcode-image"
                    />
                  </div>
                  <p
                    class="text-center text-caption"
                  >Vergrößerte Ansicht, geeignet für kleine und dunkle Bildschirme</p>
                </div>
              </q-slide-transition>

              <ExtHr color="grey-5" size="xs" />
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
                <ExtHr :color="lift.car.color" hex size="xs" class="q-my-sm" />
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
                      {{ lift.passengers.length + 1 }} / {{ lift.car.allSeats }}
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
                <q-item v-for="item in lift.passengers" :key="item.id">
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
            <div class="q-pa-md bg-white scroll overflow-hidden">
              <!-- v-touch-swipe.mouse.right="goBack" -->

              <q-page-scroller
                reverse
                position="bottom-right"
                :scroll-offset="1000"
                :duration="50"
                :offset="[10, 18]"
              >
                <q-page-sticky position="bottom-right" :offset="[18, 18]">
                  <q-btn fab icon="keyboard_arrow_down" color="accent" />
                </q-page-sticky>
              </q-page-scroller>

              <div
                v-for="(m, messageIndex) in lift.messages"
                :key="m.timestamp"
                :ref="messageIndex == lift.messages.length - 1 ? 'last_message': ''"
              >
                <p
                  class="custom-chat-label text-caption text-center q-mt-xl text-grey-7"
                  v-if="checkDayBreak(m) != ''"
                >{{ checkDayBreak(m) }}</p>
                <div>
                  <q-menu touch-position context-menu transition-show="fade" transition-hide="none">
                    <q-list class="q-pa-xs">
                      <q-item
                        :disable="m.type != 1"
                        clickable
                        @click="customCopyToClipboard(m.content)"
                        v-ripple
                        dense
                      >
                        <q-item-section avatar>
                          <q-icon name="content_copy" size="sm" />
                        </q-item-section>
                        <q-item-section>Kopieren</q-item-section>
                      </q-item>
                      <q-separator class="q-my-sm" />

                      <q-item
                        dense
                        clickable
                        @click="_=> { showMoreMessageOptions = {
                        message: m,
                        open: true
                       }
                       }"
                      >
                        <q-item-section avatar>
                          <q-icon name="more_horiz" size="sm" />
                        </q-item-section>
                        <q-item-section>Mehr</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
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
                      <AudioPlayer :src="m.content" />
                    </div>
                  </q-chat-message>
                </div>
              </div>
              <span ref="endOfPage" id="endOfPage"></span>
            </div>
            <q-dialog position="top" v-model="showMoreMessageOptions.open">
              <q-toolbar class="bg-primary text-white">
                <q-toolbar-title class="text-subtitle1">Nachrichteninfos</q-toolbar-title>
                <q-btn icon="close" flat round dense v-close-popup />
              </q-toolbar>
              <div v-if="showMoreMessageOptions.message" class="q-pa-md bg-white">
                <q-list>
                  <q-item dense>
                    <q-item-section>Datum</q-item-section>
                    <q-item-section>{{ formatAsDate(showMoreMessageOptions.message.timestamp) }}</q-item-section>
                  </q-item>
                  <q-item dense>
                    <q-item-section>Genaue Uhrzeit</q-item-section>
                    <q-item-section>{{ formatAsLongTime(showMoreMessageOptions.message.timestamp) }} Uhr</q-item-section>
                  </q-item>
                  <q-item dense>
                    <q-item-section>Größe</q-item-section>
                    <q-item-section>{{ (showMoreMessageOptions.message.content.length / 1000).toFixed(2) }} KB</q-item-section>
                  </q-item>
                  <q-separator class="q-mt-sm" />
                  <div class="q-mt-sm row">
                    <q-item
                      class="col-6"
                      clickable
                      @click="customCopyToClipboard(showMoreMessageOptions.message)"
                      v-ripple
                      dense
                    >
                      <q-item-section avatar>
                        <q-icon name="file_copy" size="sm" />
                      </q-item-section>
                      <q-item-section>Infos kopieren</q-item-section>
                    </q-item>
                    <q-item
                      class="col-6"
                      clickable
                      @click="viewUserFromId(showMoreMessageOptions.message.sentBy)"
                      v-ripple
                      dense
                      v-if="showMoreMessageOptions.message.sentBy != user"
                    >
                      <q-item-section avatar>
                        <q-icon name="person_outline" size="sm" />
                      </q-item-section>
                      <q-item-section>Profil von {{ getNameFromId(showMoreMessageOptions.message.sentBy) }}</q-item-section>
                    </q-item>
                  </div>
                </q-list>
              </div>
            </q-dialog>
          </q-page-container>

          <q-footer reveal :class="`q-pa-none bg-${footerBgColor} text-white`">
            <q-slide-transition>
              <div class="bg-white text-dark border-radius-50" v-if="showQuickMessages">
                <div class="q-pl-sm q-pt-md">
                  <q-splitter :value="10">
                    <template v-slot:before>
                      <q-tabs
                        v-model="quickMessagesTab"
                        dense
                        vertical
                        align="justify"
                        class="bg-white text-primary"
                        :breakpoint="0"
                      >
                        <q-tab name="text" icon="text_rotation_angleup" />
                        <q-tab name="emoji" icon="sentiment_satisfied_alt" />
                      </q-tabs>
                    </template>
                    <template v-slot:after>
                      <q-tab-panels
                        v-model="quickMessagesTab"
                        swipeable
                        infinite
                        animated
                        vertical
                        transition-prev="jump-up"
                        transition-next="jump-down"
                      >
                        <q-tab-panel name="emoji">
                          <q-list>
                            <q-item-label header>Emojis</q-item-label>
                            <div v-for="cat in emojis" :key="cat">
                              <q-btn
                                v-for="icon in cat"
                                :key="icon"
                                flat
                                dense
                                @click="messageText += icon"
                                class="text-h5"
                              >{{ icon }}</q-btn>
                              <br />
                              <q-separator />
                            </div>
                          </q-list>
                        </q-tab-panel>
                        <q-tab-panel name="text" class="q-pt-none">
                          <q-list>
                            <q-item-label header>Gängige Nachrichten</q-item-label>
                            <q-item
                              clickable
                              v-ripple
                              @click="messageText = m.text"
                              v-for="m in recentMessages"
                              :key="m.icon"
                            >
                              <q-item-section avatar>
                                <q-icon :name="m.icon" />
                              </q-item-section>
                              <q-item-section class="text-subtitle1">{{ m.text }}</q-item-section>
                            </q-item>
                          </q-list>
                        </q-tab-panel>
                      </q-tab-panels>
                    </template>
                  </q-splitter>
                </div>
              </div>
            </q-slide-transition>

            <q-form @submit="sendMessage(1)" class="q-gutter-md q-pa-none">
              <div>
                <q-toolbar class="bg-white border-radius-50">
                  <q-btn
                    flat
                    :v-if="!recording"
                    dense
                    class="q-pr-sm q-mr-xs notes-border"
                    size="md"
                    :ripple="false"
                    color="dark"
                    icon="notes"
                    @click="showQuickMessages = !showQuickMessages"
                  />
                  <q-toolbar-title class="footer-toolbar-title-border">
                    <q-tab-panels
                      v-model="recording"
                      animated
                      transition-prev="scale"
                      transition-next="scale"
                      class="q-pa-none"
                    >
                      <q-tab-panel :name="false" class="q-pa-none">
                        <q-slide-transition>
                          <div
                            class="bg-white text-dark text-subtitle1 rounded-borders"
                            v-if="showPassengersToBeMentioned"
                          >
                            <div class="q-pt-md row justify-start">
                              <q-btn
                                flat
                                :label="p"
                                v-for="p in passengersThatCanBeMentioned"
                                no-caps
                                :key="p"
                                @click="mentionPassenger(p)"
                              />
                            </div>
                            <ExtHr color="grey-7" size="xs" />
                          </div>
                        </q-slide-transition>
                        <q-input
                          borderless
                          ref="messageInput"
                          @focus="scrollToEnd(350)"
                          type="text"
                          v-model="messageText"
                          placeholder="Nachricht..."
                        />
                      </q-tab-panel>
                      <q-tab-panel :name="true" class="q-pa-none q-my-md flex">
                        <p
                          class="text-subtitle1 text-dark q-mb-none recording-pulsing"
                        >Audio wird aufgenommen...</p>
                        <q-space />
                      </q-tab-panel>
                    </q-tab-panels>
                  </q-toolbar-title>

                  <q-tab-panels
                    class="q-pa-none border-recorder-send"
                    v-model="showRecorder"
                    animated
                    transition-prev="scale"
                    transition-next="scale"
                  >
                    <q-tab-panel :name="false" class="q-pa-none flex">
                      <q-btn
                        @click="sendMessage(1)"
                        icon="send"
                        outline
                        size="lg"
                        type="submit"
                        rounded
                        dense
                        color="primary"
                      />
                    </q-tab-panel>

                    <q-tab-panel :name="true" class="q-pa-none full-width">
                      <q-space />
                      <vue-record-audio
                        mode="hold"
                        @result="sendAudio"
                        @onContextMenu="false"
                        @stream="recording = true"
                        class="record-audio"
                      />
                    </q-tab-panel>
                  </q-tab-panels>
                </q-toolbar>
              </div>
            </q-form>
          </q-footer>
        </q-layout>
      </q-dialog>
    </div>
  </div>
</template>

<script>
import VueRecord from "@codekraft-studio/vue-record";
import Vue from "vue";
Vue.use(VueRecord);

import { openURL, date, copyToClipboard, Notify } from "quasar";
import ExtHr from "components/ExtendedHr";
import VueQrcode from "vue-qrcode";
import LiftInfoDrawer from "components/LiftInfoDrawer";
import AudioPlayer from "components/AudioPlayer";

import {
  sendApiRequest,
  SQL_SEND_MESSAGE,
  SQL_GET_LIFT_INFO,
} from "../ApiAccess";

export default {
  name: "LiftPopup",
  components: {
    ExtHr,
    VueQrcode,
    AudioPlayer,
  },
  data() {
    return {
      alreadyScrolledDown: false,
      showQR: false,
      coloredIDs: {},
      recording: false,
      openLiftInfo: false,
      messageText: "",
      showQuickMessages: false,
      showPassengersToBeMentioned: false,
      showMoreMessageOptions: {
        open: false,
        message: null,
      },
      quickMessagesTab: "emoji",
      footerBgColor: "white",
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
      endOfPage: null,
      bottomReached: false,
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
  watch: {
    open: function (newValue) {
      if (newValue) {
        setTimeout((_) => {
          this.scrollToEnd();
        });
      }
      // this.focusTextInput()
    },

    messageText: function (newText) {
      if (newText.slice(-1) == "@") {
        this.showPassengersToBeMentioned = true;
      } else {
        this.showPassengersToBeMentioned = false;
      }
    },
  },
  computed: {
    showRecorder() {
      return !this.messageText || this.messageText.slice(-1) == "@";
    },

    emojis() {
      var stringArray = this.$store.state.emojis;
      //   betterArray = [];
      // stringArray.forEach((string) => {
      //   var categoryArray = [];
      //   for (var i = 0; i < string.length; i++)
      //     categoryArray.push(string.slice(i, i + 1));
      //   betterArray.push(categoryArray);
      // });
      return stringArray;
    },

    recentMessages() {
      return this.$store.state.recentMessages;
    },

    passengersThatCanBeMentioned() {
      // return ["Günther", "Robert", "Alicia", "Sebastian", "Jonas", "Merdan"];
      var all = [],
        nameOfThisUser = this.$store.getters["auth/user"].name.split(" ")[0];
      this.lift.passengers.forEach((p) => all.push(p.name));
      all.push(this.lift.driver.name);
      all = all.filter((name) => name != nameOfThisUser);
      return all;
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
    async scrollToEnd(delay) {
      if (delay)
        await new Promise((res) => {
          setTimeout(res, delay);
        });
      var endOfPage = document.getElementById("endOfPage");
      endOfPage.scrollIntoView(
        delay
          ? {
              behavior: "smooth",
              block: "start",
            }
          : null
      );
    },

    pageScrolled(e) {
      if (!this.open) return;
      const limit = 100;
      var done = e.position <= limit;
      console.warn(done);
      this.bottomReached = done;
    },

    getImageOfUser(id) {
      return require("../assets/sad.svg");
    },

    getNameFromId(userId) {
      var people = JSON.parse(JSON.stringify(this.lift.passengers)); // deep copy, otherwise passengers would be overwritten
      people.push(this.lift.driver);
      return people.find((p) => {
        return p.id == userId;
      }).name;
    },

    emit(val) {
      this.$emit("input", val);
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
        ); // always newest time first at this function
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
      return date.formatDate(new Date(dateString), "H:mm");
    },

    formatAsLongTime(dateString) {
      return date.formatDate(new Date(dateString), "H:mm:ss");
    },

    formatAsDate(dateObj) {
      return date.formatDate(dateObj, "DD. MMMM YYYY", {
        months: [
          "Januar",
          "Februar",
          "März",
          "April",
          "Mai",
          "Juni",
          "Juli",
          "August",
          "September",
          "Oktober",
          "November",
          "Dezember",
        ],
      });
    },

    preventDefault(e) {
      e.preventDefault();
    },

    focusTextInput() {
      setTimeout((_) => {
        (
          this.$refs.messageInput || document.getElementById("messageInput")
        ).focus();
      });
    },

    mentionPassenger(p) {
      this.messageText += p + " ";
      this.showPassengersToBeMentioned = false;
      this.focusTextInput();
      this.scrollToEnd(50);
    },

    async makeAudioSRC(base64) {
      const response = await fetch(base64),
        blob = await response.blob();
      console.warn(blob);
      return blob;
    },

    sendAudio(blob) {
      this.sendMessage(2, blob);
    },

    async sendMessage(type, blob) {
      this.recording = false;
      this.showQuickMessages = false;
      var msgObj = {
        type: 0, // 1 means raw text, 2 means audio, 3 will mean image when implemented in future
        liftId: this.lift.messages[0].id, // all from same lift, doesn't matter which one is taken
        timestamp: Date.now(),
      };
      switch (type) {
        case 1: // only text
          msgObj.content = this.messageText;
          msgObj.type = 1;
          break;
        case 2: // audio
          msgObj.type = 2;
          var haha;
          await new Promise((res, rej) => {
            var reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = (_) => {
              msgObj.content = reader.result;
              haha = reader.result;
              alert(reader.result);
              res();
            };
          });
          break;
      }

      // sendApiRequest(
      //   SQL_SEND_MESSAGE,
      //   {
      //     id: this.user,
      //     message: msgObj,
      //   },
      //   (data) => {
      //     // is id of just inserted row
      //     // check whether last message was from this user
      //     msgObj.messageId = data;
      //     msgObj.nameOfUser = this.$store.getters["auth/user"].name.split(
      //       " "
      //     )[0];
      //     msgObj.userId = this.user;
      //     msgObj.destination = this.messages.list[0].destination; // just copy the remaining properties from the other messages
      //     msgObj.start = this.messages.list[0].start;
      //     this.messages.list.push(msgObj);
      //     this.messages.list.sort((a, b) => {
      //       return a.timestamp < b.timestamp;
      //     });
      //   },
      //   (error) => {
      //     throw error;
      //   }
      // );

      this.messageText = "";
      setTimeout(() => window.scrollTo(0, 1000000), 100);
    },

    viewCar() {
      var car = this.lift.car;
      var search =
        car.brand + "+" + car.model.replace(" ", "") + "+" + car.type;
      openURL("https://www.ecosia.org/images?q=" + search); // easiest way, otherwise we would have to store a image of each model (!)
    },

    viewUserFromId(userId) {
      window.location.href = "/#/benutzerinfo?slId=" + userId;
    },

    customCopyToClipboard(obj) {
      // copied from 30secondsofcode
      var toBeCopied;

      if (typeof obj == "string") toBeCopied = obj;
      else {
        toBeCopied = JSON.stringify({
          text: obj.content,
          timestamp: obj.timestamp,
          sentByName: this.getNameFromId(obj.sentBy),
        });
      }
      copyToClipboard(toBeCopied)
        .then((_) => {
          this.$q.notify({
            message: "Inhalt wurde kopiert",
            color: "white",
          });
        })
        .catch((e) => alert("Fehler beim Kopieren: " + e));
    },
  },
};
</script>

<style scoped lang="scss">
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
  background: transparent;
}

.border-radius-50 {
  border-left: 1px solid $primary;
  border-radius: 50px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
}

.border-recorder-send {
  border-radius: 50px;
  // border-right: 1px solid $primary;
}

.record-audio {
  -youbkit-touch-callout: none; /* iOS Safari */
  -youbkit-user-select: none; /* Chrome 6.0+, Safari 3.1+, Edge & Opera 15+ */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE 10+ and Edge */
  user-select: none; /* Non-prefixed version, 
                  currently supported by Chrome and Opera */ // this setting is just to prevent text selecting

  height: 50px;
  width: 50px;
  border-radius: 50%;
  background-color: $primary;
}

.footer-toolbar-title-border {
  border-top: 1px solid $primary;
  border-bottom: 1px solid $primary;
}

.notes-border {
  border-right: 1px solid rgb(134, 127, 127);
}

.recording-pulsing {
  animation: pulsing 0.8s alternate infinite;

  @keyframes pulsing {
    to {
      opacity: 0.75;
    }
  }
}
</style>