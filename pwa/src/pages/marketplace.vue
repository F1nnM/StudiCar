<template>
  <div class="q-pa-md">
    <TitleButton>
      <q-btn dense flat @click="openSortFilterDialog('sort')" icon="sort">
        <q-icon size="xs" :name="sort.icon" />
      </q-btn>
      <span class="q-mx-xs">|</span>
      <q-btn color="primary" dense flat @click="openSortFilterDialog('filter')">
        <!-- filter icon, didn't work the normal way -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          enable-background="new 0 0 24 24"
          viewBox="0 0 24 24"
          fill="black"
          width="18px"
          height="18px"
        >
          <g>
            <path d="M0,0h24 M24,24H0" fill="none" />
            <path
              d="M4.25,5.61C6.27,8.2,10,13,10,13v6c0,0.55,0.45,1,1,1h2c0.55,0,1-0.45,1-1v-6c0,0,3.72-4.8,5.74-7.39 C20.25,4.95,19.78,4,18.95,4H5.04C4.21,4,3.74,4.95,4.25,5.61z"
            />
            <path d="M0,0h24v24H0V0z" fill="none" />
          </g>
        </svg>
        <span style="margin-left: 2px" v-html="filtersActive" v-if="filtersActive" />
      </q-btn>
    </TitleButton>
    <div class="q-gutter-y-md">
      <div :key="offerIndexToRefresh">
        <q-dialog
          position="right"
          v-model="sortFilterDialog.open"
          transition-show="jump-left"
          transition-hide="jump-right"
        >
          <q-card>
            <div class="row justify-between">
              <q-item-label header>{{ sortFilterDialog.tab == 'sort' ? 'Sortieren' : 'Filtern' }}</q-item-label>
              <q-tabs
                v-model="sortFilterDialog.tab"
                narrow-indicator
                dense
                class="bg-white text-dark"
              >
                <q-tab name="sort" icon="sort" />
                <q-tab name="filter">
                  <q-icon size="sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      enable-background="new 0 0 24 24"
                      viewBox="0 0 24 24"
                      fill="black"
                      width="18px"
                      height="18px"
                    >
                      <g>
                        <path d="M0,0h24 M24,24H0" fill="none" />
                        <path
                          d="M4.25,5.61C6.27,8.2,10,13,10,13v6c0,0.55,0.45,1,1,1h2c0.55,0,1-0.45,1-1v-6c0,0,3.72-4.8,5.74-7.39 C20.25,4.95,19.78,4,18.95,4H5.04C4.21,4,3.74,4.95,4.25,5.61z"
                        />
                        <path d="M0,0h24v24H0V0z" fill="none" />
                      </g>
                    </svg>
                  </q-icon>
                </q-tab>
              </q-tabs>
            </div>
            <q-tab-panels
              v-model="sortFilterDialog.tab"
              animated
              transition-next="jump-left"
              transition-prev="jump-right"
            >
              <q-tab-panel name="sort">
                <q-list>
                  <q-item
                    v-for="option in sortOptions"
                    :key="option.val"
                    :disable="option.disabled"
                    tag="label"
                  >
                    <q-item-section avatar outlined>
                      <q-radio
                        @input="sortFilterDialog.open = false"
                        class="hidden"
                        v-model="sort"
                        :disable="option.disabled"
                        :val="option"
                      ></q-radio>
                      <q-btn
                        :outline="sort.val == option.val"
                        :flat="sort.val != option.val"
                        :color="sort.val == option.val ? 'primary' : 'dark'"
                        round
                        @click="keepDialogOpen('sort', option)"
                        dense
                      >
                        <q-icon :name="option.icon" color="dark" />
                      </q-btn>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label v-html="option.label" />
                      <q-item-label caption>{{ option.caption }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-tab-panel>

              <q-tab-panel name="filter">
                <q-list>
                  <q-item class="q-mb-sm">
                    <q-item-section avatar>
                      <q-btn-toggle
                        v-model="filter.friends"
                        no-caps
                        rounded
                        unelevated
                        outline
                        dense
                        toggle-color="primary"
                        color="white"
                        text-color="dark"
                        :options="[
          {icon: 'sentiment_satisfied_alt', value: 0},
          {value: 1, slot: 'groups'},
          {icon: 'group', value: 2}
        ]"
                      >
                        <template v-slot:groups>
                          <q-icon>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              enable-background="new 0 0 24 24"
                              viewBox="0 0 24 24"
                              :fill="filter.friends == 1 ? 'primary' : 'black'"
                              width="18px"
                              height="18px"
                            >
                              <rect fill="none" height="24" width="24" />
                              <g>
                                <path
                                  d="M12,12.75c1.63,0,3.07,0.39,4.24,0.9c1.08,0.48,1.76,1.56,1.76,2.73L18,18H6l0-1.61c0-1.18,0.68-2.26,1.76-2.73 C8.93,13.14,10.37,12.75,12,12.75z M4,13c1.1,0,2-0.9,2-2c0-1.1-0.9-2-2-2s-2,0.9-2,2C2,12.1,2.9,13,4,13z M5.13,14.1 C4.76,14.04,4.39,14,4,14c-0.99,0-1.93,0.21-2.78,0.58C0.48,14.9,0,15.62,0,16.43V18l4.5,0v-1.61C4.5,15.56,4.73,14.78,5.13,14.1z M20,13c1.1,0,2-0.9,2-2c0-1.1-0.9-2-2-2s-2,0.9-2,2C18,12.1,18.9,13,20,13z M24,16.43c0-0.81-0.48-1.53-1.22-1.85 C21.93,14.21,20.99,14,20,14c-0.39,0-0.76,0.04-1.13,0.1c0.4,0.68,0.63,1.46,0.63,2.29V18l4.5,0V16.43z M12,6c1.66,0,3,1.34,3,3 c0,1.66-1.34,3-3,3s-3-1.34-3-3C9,7.34,10.34,6,12,6z"
                                />
                              </g>
                            </svg>
                          </q-icon>
                        </template>
                      </q-btn-toggle>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Angebote von Nutzern filtern</q-item-label>
                      <q-item-label caption>
                        <span v-if="filter.friends == 2">nur Angebote von Freunden werden angezeigt</span>
                        <span
                          v-else-if="filter.friends == 1"
                        >nur Angebote von Freunden und deren Freunden werden angezeigt</span>
                        <span v-else-if="!filter.friends">Angebote von jedem Nutzer werden angezeigt</span>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item class="q-mb-sm">
                    <q-item-section avatar>
                      <q-btn-toggle
                        v-model="filter.dest"
                        no-caps
                        rounded
                        unelevated
                        outline
                        dense
                        toggle-color="primary"
                        color="white"
                        text-color="dark"
                        :options="[
          {icon: 'home', value: 'home'},
          {icon: 'sync_alt', value: 0},
          {icon: 'school', value: 'school'}
        ]"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Fahrtziel filtern</q-item-label>
                      <q-item-label caption>
                        <span
                          v-if="filter.dest == 'home'"
                        >nur Fahrten in Richtung deiner Standardadresse werden angezeigt</span>
                        <span
                          v-else-if="filter.dest == 'school'"
                        >nur Fahrten in Richtung DH werden angezeigt</span>
                        <span v-else>es werden alle Fahrten angezeigt</span>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item tag="label">
                    <q-item-section avatar>
                      <q-toggle v-model="filter.prefs" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Meine Präferenzen berücksichtigen</q-item-label>
                      <q-item-label caption>
                        <span v-if="filter.prefs">Im Moment werden deine Präferenzen berücksichtigt</span>
                        <span v-else>Im Moment werden deine Präferenzen nicht beachtet</span>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-tab-panel>
            </q-tab-panels>
          </q-card>
        </q-dialog>
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
import TitleButton from "components/TitleButtonAnchor";

export default {
  components: { LiftOffer, QrLiftDisplay, TitleButton },
  data() {
    return {
      openEditSort: false,
      sort: {
        label: "nach Sitzen (Standard)",
        icon: "person",
        val: "seats"
      },
      offerIndexToRefresh: 1,
      filter: {
        friends: 0,
        prefs: true,
        dest: 0
      },
      sortFilterDialog: {
        open: false,
        tab: "sort"
      }
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
          val: "distance",
          disabled: true
        },
        {
          label: "wenigste Sitze belegt",
          caption: "Sortiert nach freien Plätzen",
          val: "seats",
          icon: "person"
        },
        {
          label: "Toleranz",
          caption:
            "Sortiert nach der Toleranz bzw. den Präferenzen des Fahrers",
          val: "prefs",
          icon: "insert_emoticon"
        },
        {
          label: "Zeit",
          caption: "Sortiert nach Zeit der Fahrt",
          val: "timeDiff",
          icon: "departure_board"
        },
        {
          label: "Geringste Zeit zum Unterricht",
          caption: "Möglichst geringe Wartezeit bis Beginn der Veranstaltung",
          val: "time",
          icon: "timer",
          disabled: true
        }
      ];
    },

    filtersActive() {
      var active = 0;
      Object.values(this.filter).forEach(val => {
        if (val) active++;
      });
      return active;
    },

    getSortedOffers() {
      var offers = JSON.parse(JSON.stringify(this.allOffers));

      // here comes the sorting code

      if (this.sort) {
        switch (this.sort.val) {
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

    openSortFilterDialog(prop) {
      this.sortFilterDialog.open = true;
      this.sortFilterDialog.tab = prop;
    },

    keepDialogOpen(prop, val) {
      this.sortFilterDialog.open = true; // just to be sure
      this[prop] = val;
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