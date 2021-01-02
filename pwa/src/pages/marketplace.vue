<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md">
      <div class="absolute-top-right q-mt-xl q-mr-xl q-pt-md">
        <q-btn dense flat color="primary" @click="$refs.select.showPopup()" icon="sort">
          <q-icon size="xs" :name="sort.icon" />
        </q-btn>
      </div>

      <div :key="offerIndexToRefresh">
        <q-select
          v-model="sort"
          ref="select"
          options-selected-class="border-right border-right-green"
          rounded
          transition-show="jump-up"
          transition-hide="jump-down"
          outlined
          map-options
          class="hidden"
          :style="'border-radius: ' + (sort ? 0 : 100) + 'px'"
          label="Angebote sortieren"
          :options="sortOptions"
        >
          <template v-slot:prepend>
            <q-icon name="sort" />
          </template>
          <template v-if="sort" v-slot:append>
            <q-icon name="cancel" @click.stop="sort = null" class="cursor-pointer" />
          </template>
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps" v-on="scope.itemEvents" :disable="scope.opt.disabled">
              <q-item-section avatar>
                <q-icon :name="scope.opt.icon" />
              </q-item-section>
              <q-item-section>
                <q-item-label v-html="scope.opt.label" />
                <q-item-label caption>{{ scope.opt.caption }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <!-- </q-menu> -->
        <LiftOffer
          class="q-mb-sm"
          v-for="lift in getSortedOffers"
          :key="lift.index"
          v-bind:lift="lift"
          @request="triggerLiftRequest"
        />
      </div>
      <div
        class="text-caption"
        v-if="!(getSortedOffers.length || filter.length)"
      >Im Moment gibt es für dich gerade keine Angebote. Schau einfach später nochmal vorbei.</div>
      <!-- above case for neither offers nor filter applied -->
      <div
        class="text-caption"
        v-else-if="!getSortedOffers.length && filter.length"
      >Es gibt keine Angebote, die deinen Filterkriterien entsprechen.</div>
      <!-- above case for offers all not matching selected filter settings -->
    </div>
    <QrLiftDisplay @request="triggerLiftRequest" />
  </div>
</template>

<script>
import { sendApiRequest } from "../ApiAccess";
import LiftOffer from "../components/LiftOffer";
import QrLiftDisplay from "components/QrLiftDisplay";

export default {
  components: { LiftOffer, QrLiftDisplay },
  data() {
    return {
      openEditSort: false,
      sort: {
        label: "nach Sitzen (Standard)",
        icon: "person",
        value: "seats"
      },
      offerIndexToRefresh: 1
    };
  },

  /* updated() {
    this.recomputeView();
  },

  created() {
    this.recomputeView();
  }, */

  watch: {
    /* $route(to) {
      this.recomputeView();
    } */
  },

  computed: {
    allOffers() {
      return this.$store.getters["auth/user"].marketplaceOffers;
    },
    title() {
      var greeting = this.$store.state.greeting;
      var name = this.$store.getters["auth/user"].name.split(" ")[0];
      return greeting + ", " + name;
    },

    sortOptions() {
      return [
        {
          label: "niedrigste Entfernung",
          caption: "Sortiert aufsteigend nach Luftlinie",
          icon: "location_on",
          value: "distance",
          disabled: true
        },
        {
          label: "wenigste Sitze belegt",
          caption: "Sortiert nach freien Plätzen",
          value: "seats",
          icon: "person"
        },
        {
          label: "Toleranz",
          caption: "Sortiert nach der Toleranz des Fahrers",
          value: "prefs",
          icon: "insert_emoticon"
        },
        {
          label: "Zeit",
          caption: "Sortiert nach Zeit der Fahrt",
          value: "timeDiff",
          icon: "departure_board"
        },
        {
          label: "Geringste Zeit zum Unterricht",
          caption: "Möglichst geringe Wartezeit bis Beginn der Veranstaltung",
          value: "time",
          icon: "timer",
          disabled: true
        }
      ];
    },

    getSortedOffers() {
      var offers = JSON.parse(JSON.stringify(this.allOffers));

      // here comes the sorting code

      if (this.sort) {
        switch (this.sort.value) {
          case "distance":
            offers.sort((a, b) => {
              return a.distance - b.distance;
            });
            break;
          case "seats":
            offers.sort((a, b) => {
              if (a.seatsOccupied == b.seatsOccupied)
                return b.seatsOffered - a.seatsOffered;
              // when same seats, then descending to avaiable seats
              else return a.seatsOccupied - b.seatsOccupied;
            });
            break;
          case "prefs":
            var prefScores = [];
            var userPrefs = this.$store.getters["auth/user"].prefs;
            offers.forEach(lift => {
              let offerscore = 0;
              Object.keys(lift.driver.prefs).forEach(prefName => {
                // get the prefs by themself
                let liftPref = lift.driver.prefs[prefName];
                let userPref = userPrefs[prefName];

                // convert it to calculatable value
                liftPref =
                  liftPref == "GREEN" ? 3 : liftPref == "YELLOW" ? 2 : 1;

                //userPref = userPref == 'GREEN' ? 3 : userPref == 'YELLOW' ? 2 : 1

                offerscore += liftPref; // - userPref) // the better pref of the lift related to pref of user, the better the score

                // AT MOMENT NOT USED: when user's Pref higher than liftPref, it is negative and so the average result of all pref comparisons in this lift is worse
              });

              prefScores.push(offerscore); // when saving like this, the index of the value is the same as the lift id, because outer loop goes through offers
            });
            // now we have an array containing our stores, and have to sort our offers depending on the score they got

            offers.sort((a, b) => {
              // here we get a and b as lift to be compared. The ids are the indices of prefArray

              return prefScores[a.id - 1] - prefScores[b.id - 1];
            });
            offers.reverse();

            break;
          case "time":
            // API not implemented yet
            break;
          case "timeDiff":
            offers.sort((a, b) => {
              var aTime =
                  a.date +
                  " " +
                  (a.departAt != "00:00:00" ? a.departAt : a.arriveBy),
                bTime =
                  b.date +
                  " " +
                  (b.departAt != "00:00:00" ? b.departAt : b.arriveBy);

              return new Date(aTime).getTime() - new Date(bTime).getTime();
            });
        }
      }

      return offers;
    },

    genderName() {
      switch (this.$store.getters["auth/user"].gender) {
        case "M":
          return "Jungs";
          break;
        case "W":
          return "Mädels";
          break;
        case "D":
          return "Diversen";
        case "X":
          return "noch nicht eingestellt";
          break;
        default:
          return "Fehlermenschen";
      }
    }
  },

  methods: {
    async refreshContent(res, rej) {
      // check whether new LiftOffers can be loaded
      this.$store.dispatch("auth/reloadMarketplaceOffers", {
        res: res,
        rej: rej
      });
    },

    hide() {
      this.qrLiftData = "";
    },

    recomputeView() {
      var locArr = window.location.href.split("?qrLiftData=");
      if (locArr.length > 1 && this.qrLiftData != "") {
        this.qrLiftData = locArr[1];
        console.warn("changed to " + locArr[1]);
      }
    },

    triggerLiftRequest(liftId) {
      this.$store.dispatch("auth/requestToLift", liftId);
      this.offerIndexToRefresh++; // to re-render component, wasn't working otherwise
    }
  },

  mounted() {
    this.$store.commit("setPage", {
      name: this.title,
      navTitle: "Marktplatz"
    });
    /*  this.recomputeView(); */
  }
};
</script>