<template>
  <div class="q-pa-md">
    <q-list>
      <ChatItem
        v-for="(m, index) in lastMessages"
        :key="m.timestamp"
        :message="m"
        :firstItem="index == 0"
        @left="alert"
        @right="alert"
        @open="openTheLift"
        @shortLiftInfo="openShortLiftInfo"
      />
    </q-list>
    <LiftPopup :open="liftOpen" :messages="messagesToBeShown" @close="liftOpen = false" />
    <q-dialog v-model="shortLiftPopup.isOpen" full-width square position="bottom">
      <q-card>
        <q-card-section>
          <div>
            <q-toolbar>
              <q-avatar>
                <div :style="`background-color: ${ shortLiftPopup.car.color }`" class="full-width">
                  <q-img src="~assets/app-icon_color_preview.png" />
                </div>
              </q-avatar>
              <q-toolbar-title>
                <p>
                  {{ shortLiftPopup.from }}
                  <span class="q-mx-md">&rsaquo;</span>
                  {{ shortLiftPopup.to }}
                </p>
              </q-toolbar-title>
            </q-toolbar>
            <div class="row">
              <div class="col-5">
                <div>
                  {{ shortLiftPopup.car.brand }} {{ shortLiftPopup.car.model }}
                  <span
                    class="q-pl-md"
                  >
                    {{ shortLiftPopup.car.occupiedSeats }} / {{ shortLiftPopup.car.allSeats }}
                    <q-icon
                      name="airline_seat_recline_normal"
                      :color="fullCar ? 'positive' : 'dark'"
                      size="xs"
                    />
                  </span>
                </div>
                <div>
                  <p class="text-caption">{{ shortLiftPopup.car.licensePlate }}</p>
                  <p>
                    <span>{{ shortLiftPopup.car.built }}er Baujahr</span>
                  </p>
                </div>
              </div>
              <div class="col-7">
                <q-item>
                  <q-item-section>
                    <q-item-label>
                      Ankunft
                      <span class="text-caption q-ml-xs">{{ shortLiftPopup.departAt }}</span>
                    </q-item-label>
                    <q-item-label>
                      Abfahrt
                      <span class="text-caption q-ml-xs">{{ shortLiftPopup.arriveBy }}</span>
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side class="text-subtitle1">{{ dateDiff }}</q-item-section>
                </q-item>
                <q-separator spaced inset="item" />
                <p>
                  {{ shortLiftPopup.driver }}
                  <q-icon name="drive_eta" class="q-ml-sm" size="xs" color="grey-6" />
                </p>
                <div class="row">
                  <span
                    v-for="p in shortLiftPopup.passengers"
                    :key="p"
                    class="q-px-sm col-4"
                  >{{ p }}</span>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import ChatItem from "components/ChatItem";
import LiftPopup from "components/LiftPopup";
import { date } from "quasar";

export default {
  components: {
    ChatItem,
    LiftPopup,
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
      alreadyTappedOnItem: false,
      shortLiftPopup: {
        isOpen: false,
        from: "Würzburg",
        to: "Ansbach",
        car: {
          brand: "VW",
          model: "Golf",
          color: "#FF00FF",
          occupiedSeats: 5,
          allSeats: 7,
          licensePlate: "HH-BJ-88",
          built: 2003,
        },
        date: new Date(),
        departAt: "10:30",
        arriveBy: "10:50",
        driver: "Bernd",
        passengers: ["Alicia", "Bob", "Peter", "Donald"],
      },
    };
  },

  computed: {
    lastMessages() {
      var lastOfThem = [];
      var all = this.allMessages;
      for (let liftId in all) {
        all[liftId].sort((a, b) => {
          return new Date(a.timestamp) - new Date(b.timestamp); // make sure that is sorted ascending by timestamp
        });
        var length = all[liftId].length;
        lastOfThem.push(all[liftId][length - 1]);
      }
      lastOfThem.sort((a, b) => {
        return new Date(b.timestamp) - new Date(a.timestamp); // newest message is on top of list
      });
      return lastOfThem;
    },
    lift() {
      var item = this.lifts;

      //.find(l => l.id == this.liftOpenId)
      if (!item) {
        return null;
      } else return item;
    },

    fullCar() {
      var car = this.shortLiftPopup.car;
      return car.occupiedSeats == car.allSeats;
    },

    dateDiff() {
      var now = new Date(),
        liftDate = this.shortLiftPopup.date,
        diff = date.getDateDiff(liftDate, now, "days");
      switch (diff) {
        case 0:
          return "Heute";
          break;
        case 1:
          return "Morgen";
          break;
        case 2:
          return "Übermorgen";
          break;
        default:
          return "Da ist noch hin";
      }
    },

    lifts() {
      return [
        {
          id: 9,
          beginsAtSchool: true,
          driverName: "Günther",
          seats: 5,
        },
      ];
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

    openTheLift(liftId) {
      var enableDoubleTap = false;

      if (!process.env.DEV) enableDoubleTap = false; // just to be sure
      if (!enableDoubleTap) {
        this.liftOpen = true;
        this.messagesToBeShown = this.allMessages[liftId];
      } else {
        if (this.alreadyTappedOnItem) this.shortLiftPopup.isOpen = true;
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