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
            <q-pull-to-refresh @refresh="reloadMessages">
              <div class="row">
                <div class="col-10 bg-primary">
                  <q-toolbar class="q-pr-xs">
                    <q-toolbar-title>
                      <q-item
                        dense
                        class="q-px-none"
                        clickable
                        @click="infoDrawerOpen = true"
                      >
                        <q-item-section class="text-white">
                          <q-item-label class="row no-wrap">
                            <div
                              class="col-auto text-h6 text-weight-light ellipsis"
                            >
                              {{
                                getCampusLabel(lift.start.id, lift.start.name)
                              }}
                              <span class="q-mx-sm">&rsaquo;</span>
                              {{
                                getCampusLabel(
                                  lift.destination.id,
                                  lift.destination.name
                                )
                              }}
                            </div>
                          </q-item-label>
                          <q-slide-transition>
                            <q-item-label
                              v-if="!infoDrawerOpen"
                              caption
                              class="q-mt-none"
                            >
                              <q-tab-panels
                                class="q-pa-none bg-primary q-mb-xs text-grey-3 text-weight-thin"
                                v-model="showMembersInTitle"
                                animated
                                transition-next="fade"
                                transition-prev="fade"
                              >
                                <q-tab-panel
                                  :name="true"
                                  class="q-pa-none row justify-between"
                                >
                                  <div>
                                    <span>
                                      Du
                                      <span v-if="isDriver">
                                        (
                                        <q-icon
                                          size="1.3em"
                                          name="directions_car"
                                        />)
                                      </span>
                                    </span>
                                    <span v-if="allMembersOfLift.length">
                                      <span
                                        v-for="p in allMembersOfLift"
                                        :key="p.fbId"
                                      >
                                        <span v-if="p.id != myFbId"
                                          >{{ ", " }}{{ p.name }}</span
                                        >
                                      </span>
                                    </span>
                                    <span v-else>keine Mitfahrer</span>
                                  </div>
                                  <!--  <q-btn
                                @click="searchDialogOpen = true"
                                icon="search"
                                disable
                                flat
                                v-ripple
                                round
                                size="sm"
                                color="white"
                                dense
                                  />-->
                                  <!-- <q-btn flat round dense icon="search" /> -->
                                </q-tab-panel>
                                <q-tab-panel :name="false" class="q-pa-none"
                                  >Tippe für Info</q-tab-panel
                                >
                              </q-tab-panels>
                            </q-item-label>
                          </q-slide-transition>
                        </q-item-section>
                      </q-item>
                    </q-toolbar-title>
                  </q-toolbar>
                </div>
                <div class="col-2 bg-white text-primary">
                  <q-toolbar>
                    <q-toolbar-title>
                      <q-btn
                        v-ripple
                        class="self-center"
                        icon="close"
                        flat
                        round
                        dense
                        @click="emit(false)"
                      />
                    </q-toolbar-title>
                  </q-toolbar>
                </div>
              </div>
            </q-pull-to-refresh>
          </q-header>

          <q-page-container>
            <LiftInfoDialog
              @closeAndLeave="closeAndLeave"
              v-model="infoDrawerOpen"
              @input="infoDrawerOpen = false"
              @closeLift="closeLift"
              :lift="lift"
            />
            <q-tab-panels
              v-model="infoDrawerOpen"
              animated
              transition-next="jump-left"
              class="q-pa-none"
            >
              <q-tab-panel :name="true"></q-tab-panel>
              <q-tab-panel :name="false" class="q-pa-none">
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
                    :ref="
                      messageIndex == lift.messages.length - 1
                        ? 'last_message'
                        : ''
                    "
                  >
                    <!-- <p
                      class="custom-chat-label text-caption text-center q-mt-xl text-grey-7"
                    </p>-->
                    <p class="text-center">
                      <span
                        class="rounded-borders bg-grey-3 text-dark q-pa-xs text-weight-light"
                        style="font-size:0.8em"
                        v-if="checkDayBreak(m) != ''"
                        >{{ checkDayBreak(m) }}</span
                      >
                    </p>
                    <p
                      class="text-center"
                      v-if="getNameFromId(m.sentBy) == 'StudiCar'"
                    >
                      <span
                        class="rounded-borders bg-grey-4 text-dark q-pa-xs text-weight-light"
                        style="font-size:1.0em"
                        >{{ m.content }}</span
                      >
                    </p>
                    <div>
                      <q-menu
                        touch-position
                        context-menu
                        transition-show="fade"
                        transition-hide="none"
                      >
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
                            @click="
                              _ => {
                                showMoreMessageOptions = {
                                  message: m,
                                  open: true
                                };
                              }
                            "
                          >
                            <q-item-section avatar>
                              <q-icon name="more_horiz" size="sm" />
                            </q-item-section>
                            <q-item-section>Mehr</q-item-section>
                          </q-item>
                        </q-list>
                      </q-menu>
                      <q-chat-message
                        v-if="getNameFromId(m.sentBy) != 'StudiCar'"
                        :name="m.sentBy == user ? '' : getNameFromId(m.sentBy)"
                        :sent="m.sentBy == user"
                        size="8"
                        text-sanitize
                        :text="m.type == 2 ? [] : [m.content]"
                        :stamp="formatAsTime(m.timestamp)"
                        :bg-color="getColor(m.sentBy)"
                      >
                        <div v-if="m.type == 2">
                          <div
                            v-if="m.content.length < 40 && !medias[m.content]"
                          >
                            <q-item dense>
                              <q-item-section avatar>
                                <q-btn
                                  @click="loadMedia(m.content)"
                                  icon="get_app"
                                  flat
                                  size="md"
                                  color="dark"
                                />
                              </q-item-section>
                              <q-item-section>
                                <!-- <q-icon name="play_arrow" disable size="sm" flat color="grey-7" /> -->
                                <span class="text-caption"
                                  >Memo herunterladen</span
                                >
                              </q-item-section>
                            </q-item>
                          </div>
                          <div v-else>
                            <audio controls>
                              <source
                                type="audio/wav"
                                :src="medias[m.content]"
                              />
                              <!-- <AudioPlayer :src="m.content" /> -->
                            </audio>
                          </div>
                        </div>
                      </q-chat-message>
                    </div>
                  </div>
                  <span ref="endOfPage" id="endOfPage"></span>
                </div>
              </q-tab-panel>
            </q-tab-panels>
            <q-dialog position="top" v-model="showMoreMessageOptions.open">
              <q-toolbar class="bg-primary text-white">
                <q-toolbar-title class="text-subtitle1"
                  >Nachrichteninfos</q-toolbar-title
                >
                <q-btn icon="close" flat round dense v-close-popup />
              </q-toolbar>
              <div
                v-if="showMoreMessageOptions.message"
                class="q-pa-md bg-white"
              >
                <q-list>
                  <q-item dense>
                    <q-item-section>Datum</q-item-section>
                    <q-item-section>{{
                      formatAsDate(showMoreMessageOptions.message.timestamp)
                    }}</q-item-section>
                  </q-item>
                  <q-item dense>
                    <q-item-section>Genaue Uhrzeit</q-item-section>
                    <q-item-section
                      >{{
                        formatAsLongTime(
                          showMoreMessageOptions.message.timestamp
                        )
                      }}
                      Uhr</q-item-section
                    >
                  </q-item>
                  <q-item dense>
                    <q-item-section>Länge</q-item-section>
                    <q-item-section
                      >{{
                        showMoreMessageOptions.message.content.length
                      }}
                      Zeichen</q-item-section
                    >
                  </q-item>
                  <q-separator class="q-mt-sm" />
                  <div class="q-mt-sm row">
                    <q-item
                      class="col-6"
                      clickable
                      @click="
                        customCopyToClipboard(showMoreMessageOptions.message)
                      "
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
                      @click="
                        viewUserFromFbId(showMoreMessageOptions.message.sentBy)
                      "
                      v-ripple
                      dense
                      v-if="showMoreMessageOptions.message.sentBy != user"
                    >
                      <q-item-section avatar>
                        <q-icon name="person_outline" size="sm" />
                      </q-item-section>
                      <q-item-section
                        >Profil von
                        {{
                          getNameFromId(showMoreMessageOptions.message.sentBy)
                        }}</q-item-section
                      >
                    </q-item>
                  </div>
                </q-list>
              </div>
            </q-dialog>
          </q-page-container>

          <q-footer reveal :class="`q-pa-none bg-${footerBgColor} text-white`">
            <q-slide-transition>
              <div
                class="bg-white text-dark border-radius-50"
                v-if="showQuickMessages"
              >
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
                        transition-prev="jump-right"
                        transition-next="jump-left"
                      >
                        <q-tab-panel name="emoji">
                          <q-list>
                            <q-item-label header>Emojis</q-item-label>
                            <div
                              v-for="cat in emojis"
                              :key="cat + Math.random()"
                            >
                              <q-btn
                                v-for="icon in cat"
                                :key="icon"
                                flat
                                dense
                                @click="messageText += icon"
                                class="text-h5"
                                >{{ icon }}</q-btn
                              >
                              <br />
                              <q-separator />
                            </div>
                          </q-list>
                        </q-tab-panel>
                        <q-tab-panel name="text" class="q-pt-none">
                          <q-list>
                            <q-item-label header
                              >Gängige Nachrichten</q-item-label
                            >
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
                              <q-item-section class="text-subtitle1">{{
                                m.text
                              }}</q-item-section>
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
                          autogrow
                          v-model="messageText"
                          placeholder="Nachricht..."
                        />
                      </q-tab-panel>
                      <q-tab-panel :name="true" class="q-pa-none q-my-md flex">
                        <p
                          class="text-subtitle1 text-dark q-mb-none recording-pulsing"
                        >
                          Audio wird aufgenommen...
                        </p>
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
                      <q-btn
                        @click="informUserAboutAudios"
                        icon="settings_voice"
                        outline
                        size="lg"
                        rounded
                        dense
                        color="primary"
                      />
                      <!-- <vue-record-audio
                        mode="hold"
                        @result="sendAudio"
                        @onContextMenu="false"
                        @stream="recording = true"
                        class="record-audio"
                      /> -->
                    </q-tab-panel>
                  </q-tab-panels>
                </q-toolbar>
              </div>
            </q-form>
            <BottomSpaceForiOS />
          </q-footer>
        </q-layout>
      </q-dialog>
    </div>
  </div>
</template>

<script>
/* import VueRecord from "@codekraft-studio/vue-record";
import Vue from "vue";
Vue.use(VueRecord); */

import { openURL, date, copyToClipboard, Notify } from "quasar";
import LiftInfoDialog from "components/LiftInfoDialog";
import BottomSpaceForiOS from "components/BottomSpaceForiOS";

import { sendApiRequest, SQL_LOAD_MESSAGE_MEDIA } from "../ApiAccess";

export default {
  name: "LiftPopup",
  components: {
    LiftInfoDialog,
    BottomSpaceForiOS
  },
  data() {
    return {
      alreadyScrolledDown: false,
      showQR: false,
      coloredIds: {},
      recording: false,
      infoDrawerOpen: false,
      messageText: "",
      showQuickMessages: false,
      showPassengersToBeMentioned: false,
      showMoreMessageOptions: {
        open: false,
        message: null
      },
      showMembersInTitle: false,
      quickMessagesTab: "text",
      footerBgColor: "white",
      user: this.$store.getters["auth/user"].uid,
      loading: 0, // as always: 0 means not loading, 1 means in progress, 2 means success and -1 error.
      bottomReached: false,
      medias: {}
    };
  },
  model: {
    prop: "open",
    event: "input"
  },
  props: {
    open: Boolean,
    detailsOpen: Boolean,
    lift: Object
  },
  watch: {
    open: function(newValue) {
      if (newValue) {
        this.showMembersInTitle = false; // so that each time you open tap-for-info is displayed again
        setTimeout(_ => {
          this.showMembersInTitle = true;
        }, 2000); // after that time, hide tap-for-info-hint and show members instead
        setTimeout(_ => {
          this.scrollToEnd();
        }, 50); // has to have short delay to get wanted effect
      } else {
        this.infoDrawerOpen = false;
        this.detailsOpen = false;
      }
    },

    messageText: function(val) {
      if (val.slice(-1) == "@") {
        this.showPassengersToBeMentioned = true;
      } else {
        this.showPassengersToBeMentioned = false;
      }
    },

    detailsOpen: function(val) {
      if (val) this.infoDrawerOpen = true;
    }
  },
  computed: {
    showRecorder() {
      return !this.messageText || this.messageText.slice(-1) == "@";
    },

    myFbId() {
      return this.$store.getters["auth/user"].uid;
    },

    isDriver() {
      return this.lift.driver.id == this.myFbId;
    },

    allMembersOfLift() {
      return this.lift.passengers.concat(this.lift.driver);
    },

    emojis() {
      var stringArray = this.$store.state.emojis;
      return stringArray;
    },

    recentMessages() {
      return this.$store.state.recentMessages;
    },

    passengersThatCanBeMentioned() {
      var all = [];
      this.lift.passengers.forEach(p => {
        if (p.id != this.myFbId) all.push(p.name);
      });
      if (!this.isDriver) all.push(this.lift.driver.name);

      return all;
    },

    messageColors() {
      return {
        user: {
          light: "green-3",
          dark: "dark"
        },
        light: [
          "blue-1",
          "grey-5",
          "indigo-3",
          "brown-12",
          "grey-13",
          "blue-grey-11",
          "brown-4",
          "grey-6",
          "blue-grey-4"
        ],
        dark: [
          /* just some standard colors from the quasar palette, a lift hasn't more people */
          "deep-purple-10",
          "indigo-10",
          "teal-10",
          "lime-10",
          "brown",
          "grey-10",
          "red-14",
          "blue-grey-10"
        ] // dark/colored selection
      };
    },

    passengersAndDriverNames() {
      // returns an object like that: {'weu43ef34f': 'John Doe', 'je374ffu494': 'Sarah Smith'}
      var people = {},
        firstNamesAlreadyFound = [],
        firstNamesNotUnique = [];
      this.lift.passengers.forEach(p => {
        // we first have to get an overview and do a pre-sorting
        if (firstNamesAlreadyFound.includes(p.name)) {
          firstNamesNotUnique.push(p.name);
        } else firstNamesAlreadyFound.push(p.name);
      });

      var driverName = this.lift.driver.name; // have coded it separately to make special handling on driver easier
      if (firstNamesAlreadyFound.includes(driverName)) {
        firstNamesNotUnique.push(driverName);
      } else firstNamesAlreadyFound.push(driverName);

      // now we know which names are not unique

      var allPeopleToBeHandled = JSON.parse(
        JSON.stringify(this.lift.passengers)
      );
      allPeopleToBeHandled.unshift(
        JSON.parse(JSON.stringify(this.lift.driver))
      );

      allPeopleToBeHandled.forEach(p => {
        var nameToBeShown = p.name;
        if (firstNamesNotUnique.includes(p.name))
          nameToBeShown += " " + p.surname;
        people[p.id] = nameToBeShown;
      });
      return people;
    }
  },

  methods: {
    async scrollToEnd(delay) {
      if (delay)
        await new Promise(res => {
          setTimeout(res, delay);
        });
      try {
        var endOfPage =
          this.$refs.endOfPage.$el || document.getElementById("endOfPage"); // just to be sure, sometimes Vue Element isn't be found

        endOfPage.scrollIntoView(
          delay
            ? {
                behavior: "smooth", // delay is used when user is expected to see scrolling, a hard jump when not (e.g. on opening)
                block: "start"
              }
            : null
        );
      } catch (e) {}
    },

    informUserAboutAudios() {
      this.$q.dialog({
        title: "Audios in StudiCar",
        message: `Sprachnachrichten gestalten sich zwar für den Sender als äußerst komfortabel, allerdings ist der Empfänger
        oftmals gezwungen, eine Minute lang zuzuhören für den Inhalt von zwei Zeilen Text. StudiCar verweist daher 
        auf die in den meisten Tastaturen eingebaute Speech-To-Text Funktion, die Gesprochenes
        direkt in Text umwandelt. Schau in deinen Einstellungen nach, nutze die Funktion und ermögliche so auch den anderen Mitfahrern 
        deine Nachrichten datenschonend, von den Umgebungsgeräuschen unabhängig und vor allem schnell zu lesen.`
      });
    },

    getNameFromId(userId) {
      if (userId == "Go6vlU74gFgz5GgM5eRnWPPt2Cf1") return "StudiCar";
      // StudiCar is registered as user, id has to be checked this way
      else {
        var name = this.passengersAndDriverNames[userId];
        if (!name) return "[Ehemalig]";
        else return name;
      }
    },

    getCampusLabel(campusId, name) {
      switch (campusId) {
        case 1:
          return "Würfel";
        case 2:
          return "Alte DH";
        case 3:
          return "Kloster";
        default:
          return name;
      }
    },

    emit(val) {
      this.$emit("input", val);
    },

    closeLift() {
      this.$emit("closeLift");
    },

    closeAndLeave(event) {
      this.infoDrawerOpen = false;
      this.$emit("closeAndLeave", event);
    },

    emitShortLiftInfo() {
      this.$emit("shortLiftInfo");
    },

    getColor(userId) {
      const colorCollection = "light"; // configure here which colors shall be taken

      if (userId == this.user) return this.messageColors.user[colorCollection];
      // Sent messages have special color
      else {
        if (!this.coloredIds[userId]) {
          // userId hasn't been colored so far, we have to assign new color
          var next = Object.keys(this.coloredIds).length;
          this.coloredIds[userId] = this.messageColors[colorCollection][next];
        }
        return this.coloredIds[userId];
      }
    },

    checkDayBreak(messageItem) {
      // when a parameter is given, return true or false. When no parameter is given, returns the text of the label
      // currently function is always called with a parameter given
      var messages = this.lift.messages;
      if (!messages[0]) return false;
      else {
        var pos = this.lift.messages.indexOf(messageItem),
          label = false;

        if (!this.open) return;

        var messageDate = new Date(messageItem.timestamp);

        if (pos > 0) {
          var preceder = messages[pos - 1], // preceder is the older message
            precederDate = new Date(preceder.timestamp);

          var sameDay = date.isSameDate(messageDate, precederDate, "day"); // always newest time first at this function
          var sameMonth = date.isSameDate(messageDate, precederDate, "month");
        } else if (pos == 0) {
          // though check timestamp of message
          var sameDay = date.isSameDate(messageDate, new Date(), "day");
          var sameMonth = date.isSameDate(messageDate, new Date(), "month");
        }

        var diff = date.getDateDiff(new Date(), messageDate, "days");

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
              label = date.formatDate(messageDate, "DD.MM.YYYY");
          }
        }
        return label;
      }
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
          "Dezember"
        ]
      });
    },

    preventDefault(e) {
      e.preventDefault();
    },

    focusTextInput() {
      setTimeout(_ => {
        this.$refs.messageInput.$el.focus();
      });
    },

    mentionPassenger(p) {
      this.messageText += p + " ";
      this.showPassengersToBeMentioned = false;
      this.focusTextInput();
      var a = this.messageText;
      this.messageText = "";
      setTimeout(_ => (this.messageText = a), 10);
      this.scrollToEnd(50);
    },

    sendAudio(blob) {
      this.sendMessage(2, blob);
    },

    async sendMessage(type, blob) {
      this.recording = false;
      this.showQuickMessages = false;
      var msgObj = {
        type: 0, // 1 means raw text, 2 means audio, 3 will mean image when implemented in future
        liftId: this.lift.id
      };
      switch (type) {
        case 1: // only text
          msgObj.content = this.messageText;
          msgObj.type = 1;
          break;
        case 2: // audio
          msgObj.type = 2;
          await new Promise((res, rej) => {
            var reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = _ => {
              msgObj.content = reader.result;

              res();
            };
          });
          break;
      }

      this.$store.dispatch("auth/sendMessage", msgObj);
      this.scrollToEnd(100); // smooth scrolling to end, so that user can see newly generated message as well

      this.messageText = "";
    },

    async loadMedia(uuid) {
      sendApiRequest(
        SQL_LOAD_MESSAGE_MEDIA,
        {
          uuid: uuid
        },
        media => {
          this.medias[uuid] = media;
        },
        err => {
          alert("Error at fetching media: " + err);
        }
      );
    },

    viewUserFromFbId(fbId) {
      window.location.href = "/#/benutzerinfo?userFbId=" + fbId;
    },

    customCopyToClipboard(obj) {
      // copied from 30secondsofcode
      var toBeCopied;

      if (typeof obj == "string") toBeCopied = obj;
      else {
        toBeCopied = JSON.stringify({
          text: obj.content,
          timestamp: obj.timestamp,
          sentByName: this.getNameFromId(obj.sentBy)
        });
      }
      copyToClipboard(toBeCopied)
        .then(_ => {
          /*  this.$q.notify({
            message: "Inhalt wurde kopiert",
            color: "white",
          }); */
        })
        .catch(e => alert("Fehler beim Kopieren: " + e));
    },
    async reloadMessages(done) {
      await this.$store.dispatch("auth/reloadChatLifts", {
        res: done,
        rej: _ => {
          alert("Fehler");
        }
      });
    }
  },

  mounted() {}
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
