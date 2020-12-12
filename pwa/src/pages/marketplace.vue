<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md">
      <div class="absolute-top-right q-mt-xl q-mr-xl q-pt-md">
        <q-btn
          dense
          class="col-3"
          flat
          color="primary"
          :icon="openEditSort ? 'done' : 'filter_list'"
          @click="openEditSort = !openEditSort"
        />
      </div>

      <q-slide-transition>
        <div
          v-show="openEditSort"
          class="q-ma-none"
          :style="'transition: .1s; border-bottom: 1px solid ' + (openEditSort ? 'gray' : 'white')"
        >
          <q-select
            v-model="sort"
            options-selected-class="border-right border-right-green"
            rounded
            transition-show="jump-up"
            transition-hide="jump-down"
            outlined
            map-options
            :class="sort ? '' : 'shadow-3'"
            :style="'border-radius: ' + (sort ? 0 : 100) + 'px'"
            label="Sortierung"
            :options="sortOptions"
          >
            <template v-slot:prepend>
              <q-icon name="sort" />
            </template>
            <template v-if="sort" v-slot:append>
              <q-icon name="cancel" @click.stop="sort = null" class="cursor-pointer" />
            </template>
            <template v-slot:option="scope">
              <q-item
                v-bind="scope.itemProps"
                v-on="scope.itemEvents"
                :disable="scope.opt.disabled"
              >
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
          <br />
          <q-select
            v-model="filter"
            rounded
            transition-show="jump-up"
            transition-hide="jump-down"
            :class="filter.length ? '' : 'shadow-3'"
            :style="'border-radius: ' + (filter.length ? 0 : 100) + 'px'"
            outlined
            map-options
            multiple
            label="Filter"
            :options="filterOptions"
          >
            <template v-slot:prepend>
              <q-icon name="filter_list" />
            </template>
            <template v-if="filter.length" v-slot:append>
              <q-icon name="cancel" @click.stop="filter = []" class="cursor-pointer" />
            </template>
            <!-- <template v-if="filter" v-slot:append>
              <q-icon name="cancel" @click.stop="filter = []" class="cursor-pointer" />
            </template>-->
            <template v-slot:option="scope">
              <q-item
                v-bind="scope.itemProps"
                v-on="scope.itemEvents"
                :disable="scope.opt.disabled"
              >
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
          <br />
        </div>
      </q-slide-transition>

      <div :key="offerIndexToRefresh">
        <!-- key is to re-render component -->
        <LiftOffer
          class="q-mb-sm"
          v-for="lift in getFilteredAndSortedOffers"
          :key="lift.index"
          v-bind:lift="lift"
          @request="triggerLiftRequest"
        />
      </div>
      <div
        class="text-caption"
        v-show="!(getFilteredAndSortedOffers.length || filter.length)"
      >Im Moment gibt es für dich gerade keine Angebote. Schau einfach später nochmal vorbei.</div>
      <!-- above case for neither offers nor filter applied -->
      <div
        class="text-caption"
        v-show="!getFilteredAndSortedOffers.length && filter.length"
      >Es gibt keine Angebote, die deinen Filterkriterien entsprechen.</div>
      <!-- above case for offers all not matching selected filter settings -->
    </div>
  </div>
</template>

<script>
import { sendApiRequest } from "../ApiAccess";
import LiftOffer from "../components/LiftOffer";
export default {
  components: { LiftOffer },
  data() {
    return {
      openEditSort: false,
      sort: { value: "distance", label: "niedrigste Entfernung" }, //default sorting order
      filter: [],
      filterOptions: [
        {
          label: "Nur noch nicht angefragte Angebote",
          caption:
            "Nur Fahrten anzeigen, bei denen du noch nicht um Mitnahme gebeten hast",
          value: "notRequested",
          icon: "device_unknown"
        },
        {
          label: "Meine Präferenzen streng berücksichtigen",
          caption:
            "Nur Fahrten mit absolut denselben (!) Präferenzen werden angezeigt",
          value: "prefs",
          icon: "face"
        }
        // here an additional option will be dynamically generated in mounted()
      ],
      offerIndexToRefresh: 1
    };
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
          value: "distance"
        },
        {
          label: "wenigste Sitze belegt",
          caption: "Sortiert nach wenigsten Sitzen",
          value: "seats",
          icon: "airline_seat_recline_normal"
        },
        {
          label: "Toleranz",
          caption: "Sortiert nach Präferenzen, alle gleichwertig",
          value: "prefs",
          icon: "insert_emoticon"
        },
        {
          label: "Zeit",
          caption: "Sortiert aufsteigend nach Zeit der Fahrt",
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

    getFilteredAndSortedOffers() {
      var offers = JSON.parse(JSON.stringify(this.allOffers));

      // filter code
      if (this.filter.length) {
        this.filter.forEach(item => {
          item = item.value;
          switch (item) {
            case "notRequested":
              offers = offers.filter(offer => !offer.requested);
              break;
            case "gender":
              offers.filter(offer => {
                return true; // API not implemented yet
              });
              break;
            case "prefs":
              var userPrefs = this.$store.getters["auth/user"].prefs;
              offers = offers.filter(offer => {
                var prefValues = Object.keys(offer.driver.prefs);
                var atLeastOneDifferent = prefValues.some(pref => {
                  if (userPrefs[pref] != offer.driver.prefs[pref]) return true;
                });

                return !atLeastOneDifferent; // when at least one different, remove that element
              });

              break;
          }
        });
      }

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
              return a.seatsOccupied - b.seatsOccupied;
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
              var aTime = a.departAt ? a.departAt : a.arriveBy,
                bTime = b.departAt ? b.departAt : b.arriveBy;
              return (
                new Date(aTime).getUTCMilliseconds() -
                new Date(bTime).getUTCMilliseconds()
              );
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

    /* this.filterOptions.push({
      label: "Nur reine " + this.genderName + "-Autos",
      value: "gender",
      caption:
        "Nur Autos anzeigen, bei denen nur " + this.genderName + " mitfahren",
      icon: "wc",
      disabled: true // genderCarsAvaiable ? this.$store.getters['auth/user'].gender == 'X'
    });
 */
    // this.filter.push(this.filterOptions[0]); // only show not yet requested offers by default
  }
};
</script>