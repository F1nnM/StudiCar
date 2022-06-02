<template>
  <div class="q-pa-md">
    <TitleButton>
      <q-btn
        dense
        flat
        @click="openSortFilterDialog('sort')"
        icon="sort"
        :disable="!hasUserAddresses"
      >
        <q-icon size="xs" :name="sort.icon" />
      </q-btn>
      <span class="q-mx-xs">|</span>
      <q-btn
        color="primary"
        dense
        flat
        @click="openSortFilterDialog('filter')"
        :disable="!hasUserAddresses"
      >
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
        <span
          style="margin-left: 2px"
          v-html="filtersActive"
          v-if="filtersActive"
        />
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
              <q-item-label header>
                {{ sortFilterDialog.tab == 'sort' ? 'Sortieren' : 'Filtern' }}
                <small class="q-ml-sm" v-if="sortFilterDialog.tab == 'filter'"
                  >-
                  {{ filteredOffersLength + '/' + allOffers.length }} Angebot{{
                    allOffers.length != 1 ? 'en' : ''
                  }}
                  übrig -</small
                >
              </q-item-label>
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
              transition-next="slide-left"
              transition-prev="slide-right"
              swipeable
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
                        :disable="option.disabled"
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
                        disable
                        v-model="filter.friends"
                        no-caps
                        rounded
                        unelevated
                        outline
                        dense
                        toggle-color="primary"
                        color="white"
                        text-color="grey-5"
                        :options="[
                          { icon: 'sentiment_satisfied_alt', value: 0 },
                          { value: 1, slot: 'groups' },
                          { icon: 'group', value: 2 },
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
                        <span v-if="filter.friends == 2"
                          >nur Angebote von Freunden werden angezeigt</span
                        >
                        <span v-else-if="filter.friends == 1"
                          >nur Angebote von Freunden und deren Freunden werden
                          angezeigt</span
                        >
                        <span v-else-if="!filter.friends"
                          >Angebote von jedem Nutzer werden angezeigt</span
                        >
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
                        text-color="grey-5"
                        :options="[
                          { icon: 'home', value: 'home' },
                          { icon: 'sync_alt', value: 0 },
                          { icon: 'school', value: 'school' },
                        ]"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Fahrtziel filtern</q-item-label>
                      <q-item-label caption>
                        <span v-if="filter.dest == 'home'"
                          >nur Fahrten in Richtung deiner Adressen werden
                          angezeigt</span
                        >
                        <span v-else-if="filter.dest == 'school'"
                          >nur Fahrten in Richtung DH werden angezeigt</span
                        >
                        <span v-else>es werden alle Fahrten angezeigt</span>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item tag="label">
                    <q-item-section avatar>
                      <q-toggle v-model="filter.prefs" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label
                        >Meine Präferenzen berücksichtigen</q-item-label
                      >
                      <q-item-label caption>
                        <span v-if="filter.prefs"
                          >Im Moment werden deine Präferenzen
                          berücksichtigt</span
                        >
                        <span v-else
                          >Im Moment werden deine Präferenzen nicht
                          beachtet</span
                        >
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <!-- the below lines had some red markers, this is likely because the typeof operator isn't be recognized properly, and eslint removed brackets if set -->
                  <q-item
                    tag="label"
                    :disable="typeof defaultHomeCity != 'string'"
                  >
                    <q-item-section avatar>
                      <q-toggle
                        v-model="filter.defaultHome"
                        :disable="typeof defaultHomeCity != 'string'"
                      />
                    </q-item-section>
                    <q-item-section v-if="defaultHomeCity != null">
                      <q-item-label
                        >Nur Fahrten {{ filterDefaultHomePreposition }}
                        {{ defaultHomeCity }} anzeigen</q-item-label
                      >
                      <q-item-label caption>
                        <span v-if="filter.defaultHome"
                          >Im Moment werden nur Fahrten
                          {{ filterDefaultHomePreposition }}
                          {{ defaultHomeCity }} angezeigt</span
                        >
                        <span v-else
                          >Im Moment werden Fahrten zu all deinen Adressen
                          angezeigt</span
                        >
                      </q-item-label>
                    </q-item-section>
                    <q-item-section v-else>
                      <q-item-label
                        >nur Fahrten mit der Stadt meiner Standardadresse
                        anzeigen</q-item-label
                      >
                      <q-item-label caption class="text-negative"
                        >Diese Option ist deaktiviert, weil du im Profil noch
                        keine Standardadresse eingestellt hast</q-item-label
                      >
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-tab-panel>
            </q-tab-panels>
          </q-card>
        </q-dialog>
        <div v-if="hasUserAddresses">
          <LiftOffer
            class="q-mb-sm"
            v-for="lift in getSortedOffers"
            :key="lift.index"
            v-bind:lift="lift"
            @request="triggerLiftRequest"
          />
        </div>
        <div v-else class="relative-position">
          <q-item class="bg-white q-mt-xl shadow-2 rounded-borders">
            <q-item-section avatar>
              <q-icon name="report_problem" color="negative" size="sm" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Noch keine Adressen verfügbar</q-item-label>
              <q-item-label caption
                >In deinem Profil sind noch keine Adressen hinterlegt, StudiCar
                kann dir also noch keine passenden Angebote
                anzeigen.</q-item-label
              >
            </q-item-section>
          </q-item>

          <!--  <div style="filter: blur(6px)" class="no-pointer-events">
            <LiftOffer
              class="q-mb-sm"
              v-for="lift in loremOffers"
              :key="lift.index"
              v-bind:lift="lift"
            />
          </div>-->
        </div>
      </div>
      <div
        class="text-caption"
        v-if="!(getSortedOffers.length || filter.length)"
      >
        Im Moment gibt es für dich keine neuen Angebote. Schau einfach später
        nochmal vorbei.
      </div>
      <!-- above case for neither offers nor filter applied -->
      <div
        class="text-caption"
        v-else-if="!getSortedOffers.length && filter.length"
      >
        Es gibt keine Angebote, die deinen Filterkriterien entsprechen.
      </div>
      <!-- above case for offers all not matching selected filter settings -->
    </div>
    <QrLiftDisplay @request="triggerLiftRequest" />
  </div>
</template>

<script setup>
import { useAppStore } from 'src/stores/app';
import { useUserStore } from 'src/stores/user';
import { onMounted } from 'vue';

const userStore = useUserStore();
const appStore = useAppStore();

let openEditSort = false;
let sort = {
  label: 'nach Sitzen (Standard)',
  icon: 'person',
  val: 'seats',
};
let offerIndexToRefresh = 1;
let filter = {
  friends: 0,
  prefs: true,
  dest: 0,
  defaultHome: false,
};
let sortFilterDialog = {
  open: false,
  tab: 'sort',
};

const allOffers = computed(() => {
  return userStore.user.marketplaceOffers;
});

const title = computed(() => {
  var greeting = appStore.greeting;
  var name = userStore.user.name.split(' ')[0];
  return 'Hi, ' + name; // first had greeting like in DrawerWelcomeImage, but took up too much space
});

const filterDefaultHomePreposition = computed(() => {
  if (!filter.dest) return 'ab/nach';
  else {
    if (filter.dest == 'home') return 'nach';
    else return 'ab';
  }
});

const defaultHomeCity = computed(() => {
  var defaultAddress = userStore.user.addresses.find(
    (a) => a.isDefault && a.id > 3
  );
  if (defaultAddress) return defaultAddress.city;
  else return null;
});

const hasUserAddresses = computed(() => {
  var all = userStore.user.addresses.filter((ad) => ad.id > 3);
  return all.length > 0;
});

const userPrefs = computed(() => {
  return userStore.user.prefs;
});

const sortOptions = computed(() => {
  return [
    {
      label: 'niedrigste Entfernung',
      caption: 'Sortiert aufsteigend nach Luftlinie',
      icon: 'location_on',
      val: 'distance',
      disabled: true,
    },
    {
      label: 'wenigste Sitze belegt',
      caption: 'Sortiert nach freien Plätzen',
      val: 'seats',
      icon: 'person',
    },
    {
      label: 'Toleranz',
      caption: 'Sortiert nach der Toleranz bzw. den Präferenzen des Fahrers',
      val: 'prefs',
      icon: 'insert_emoticon',
    },
    {
      label: 'Zeit',
      caption: 'Sortiert nach Zeit der Fahrt',
      val: 'timeDiff',
      icon: 'departure_board',
      disabled: true,
    },
    {
      label: 'Geringste Zeit zum Unterricht',
      caption: 'Möglichst geringe Wartezeit bis Beginn der Veranstaltung',
      val: 'time',
      icon: 'timer',
      disabled: true,
    },
  ];
});

const loremOffers = computed(() => {
  var arr = [],
    loremOffer = {
      id: 99018780353225,
      liftId: 31,
      driver: {
        id: 'oRdhQyF8j5Mx9uwKNNMhICdkmy42',
        name: 'Julian',
        surname: 'Essl',
        prefs: {
          talk: 'RED',
          talkMorning: 'RED',
          smoking: 'RED',
          music: 'RED',
        },
      },
      departAt: '18:00:00',
      arriveBy: '00:00:00',
      destination: { name: 'Würfel', id: 1 },
      start: { name: 'Offingen', id: -1 },
      seatsOffered: 3,
      seatsOccupied: 0,
      repeatsOn: 0,
      date: '2021-02-24',
    };
  arr = [loremOffer, loremOffer, loremOffer, loremOffer, loremOffer]; // 5 should be enough
  return arr;
});

const filtersActive = computed(() => {
  var active = 0;
  Object.values(filter).forEach((val) => {
    if (val) active++;
  });
  return active;
});

const getSortedOffers = computed(() => {
  var offers = getFilteredOffers;

  // here comes the sorting code

  if (sort != {}) {
    switch (sort.val) {
      case 'distance':
        offers.value.sort((a, b) => {
          return a.distance - b.distance;
        });
        break;
      case 'seats':
        offers.value.sort((a, b) => {
          if (a.seatsOccupied == b.seatsOccupied)
            return b.seatsOffered - a.seatsOffered;
          // when same seats, then descending to avaiable seats
          else return a.seatsOccupied - b.seatsOccupied;
        });
        break;
      case 'prefs':
        var prefScores = [];
        var userPrefs = userStore.user.prefs;
        offers.forEach((lift) => {
          let offerscore = 0;
          Object.keys(lift.driver.prefs).forEach((prefName) => {
            // get the prefs by themself
            let liftPref = lift.driver.prefs[prefName];
            let userPref = userPrefs[prefName];

            // convert it to calculatable value
            liftPref = liftPref == 'GREEN' ? 3 : liftPref == 'YELLOW' ? 2 : 1;

            //userPref = userPref == 'GREEN' ? 3 : userPref == 'YELLOW' ? 2 : 1

            offerscore += liftPref; // - userPref) // the better pref of the lift related to pref of user, the better the score

            // AT MOMENT NOT USED: when user's Pref higher than liftPref, it is negative and so the average result of all pref comparisons in this lift is worse
          });

          prefScores.push(offerscore); // when saving like this, the index of the value is the same as the lift id, because outer loop goes through offers
        });
        // now we have an array containing our stores, and have to sort our offers depending on the score they got

        offers.value.sort((a, b) => {
          // here we get a and b as lift to be compared. The ids are the indices of prefArray

          return prefScores[a.id - 1] - prefScores[b.id - 1];
        });
        offers.reverse();

        break;
      case 'time':
        // API not implemented yet
        break;
      case 'timeDiff':
        offers.value.sort((a, b) => {
          var aTime =
              a.date +
              ' ' +
              (a.departAt != '00:00:00' ? a.departAt : a.arriveBy),
            bTime =
              b.date +
              ' ' +
              (b.departAt != '00:00:00' ? b.departAt : b.arriveBy);

          return new Date(aTime).getTime() - new Date(bTime).getTime();
        });
    }
  }

  return offers;
});

const getFilteredOffers = computed(() => {
  let allOffers_ = JSON.parse(JSON.stringify(allOffers.value));
  let userPrefs = userStore.user.prefs;

  if (filter.defaultHome) {
    var city = defaultHomeCity,
      postcode = userStore.user.addresses.find((a) => a.isDefault);
  }

  allOffers_ = allOffers_.filter((offer) => {
    // prefs matching?
    if (filter.prefs) {
      if (!arePrefsMatching(offer.driver.prefs)) return false;
    }
    if (filter.dest) {
      var endsAtHome = offer.destination.id == -1;
      if (filter.dest == 'home') {
        if (!endsAtHome) return false;
      } else {
        // filter.dest is 'school'
        if (endsAtHome) return false;
      }
    }

    if (filter.defaultHome) {
      var focusedPoint = '';
      switch (filter.dest) {
        case 'home':
          focusedPoint = offer.destination.name; // when lift goes home, filtered can only by destination (city)
          break;
        case 'school':
          focusedPoint = offer.start.name;
          break;
        default:
          focusedPoint = offer.start.name + '|' + offer.destination.name;
      }
      return focusedPoint.includes(defaultHomeCity);
    }

    return true; // stay in results otherwise
  });
  return allOffers_;
});

const filteredOffersLength = computed(() => {
  return getFilteredOffers.length;
});

const genderName = computed(() => {
  switch (userStore.user.gender) {
    case 'M':
      return 'Jungs';
      break;
    case 'W':
      return 'Mädels';
      break;
    case 'D':
      return 'Diversen';
    case 'X':
      return 'noch nicht eingestellt';
      break;
    default:
      return 'Fehler!';
  }
});

async function refreshContent(res, rej) {
  // check whether new LiftOffers can be loaded
  if (hasUserAddresses) userStore.reloadMarketplaceOffers.then(res).catch(rej);
  else res(); // when no addresses there, just resolve the promise
}

function hide() {
  qrLiftData = '';
}

function openSortFilterDialog(prop) {
  sortFilterDialog.open = true;
  sortFilterDialog.tab = prop;
}

function keepDialogOpen(prop, val) {
  sortFilterDialog.open = true; // just to be sure
  this[prop] = val;
}

function recomputeView() {
  var locArr = window.location.href.split('?qrLiftData=');
  if (locArr.length > 1 && qrLiftData != '') {
    qrLiftData = locArr[1];
    console.warn('changed to ' + locArr[1]);
  }
}

function triggerLiftRequest(liftId) {
  userStore.requestToLift(liftId);
  offerIndexToRefresh++; // to re-render component, wasn't working otherwise
}

function arePrefsMatching(driverPrefsObj) {
  var liftPrefs = driverPrefsObj,
    matching = Object.keys(liftPrefs).every((pref) => {
      var liftPrefValue = prefToInt(liftPrefs[pref]),
        userPrefValue = prefToInt(userPrefs[pref]);

      return liftPrefValue >= userPrefValue;
      function prefToInt(val) {
        switch (val) {
          case 'GREEN':
            return 0;
          case 'YELLOW':
            return 1;
          case 'RED':
            return 2;
        }
      }
    });

  return matching;
}

onMounted(() => {
  appStore.setPage({
    name: title.value,
    navTitle: 'Marktplatz',
  });
  /*  recomputeView(); */
});
</script>
