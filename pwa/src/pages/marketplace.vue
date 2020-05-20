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
            clearable
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
            <!-- <template v-if="sort" v-slot:append>
              <q-icon name="cancel" @click.stop="sort = ''" class="cursor-pointer" />
            </template>-->
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
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
            clearable
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
            <!-- <template v-if="filter" v-slot:append>
              <q-icon name="cancel" @click.stop="filter = []" class="cursor-pointer" />
            </template>-->
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                <q-item-section avatar>
                  <q-badge v-show="filter.includes(scope.opt.value)" label="!" class="text-red" />
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

      <!-- <p>Der Marktplatz ist so etwas wie das Schwarze Brett von StudiCar. Hier siehst du alle aktuellen Mitfahrgelegenheiten, aufsteigend nach Entfernung geordnet.</p> -->
      <LiftOffer v-for="lift in getLifts" :key="lift.index" v-bind:lift="lift">{{lift.city}}</LiftOffer>
    </div>
  </div>
</template>

<script>
import LiftOffer from '../components/LiftOffer';
export default {
  components: {LiftOffer},
  data() {
    return {
      showAllLifts: true,
      openEditSort: false,
      sort: '',
      sortOptions: [{
        label: 'niedrigste Entfernung',
        caption: 'Sortiert aufsteigend nach Luftlinie',
        icon: 'location_on',
        value: 'distance'
      },
      {
        label: 'wenigste Sitze belegt',
        caption: 'Sortiert nach wenigsten Sitzen',
        value: 'seats',
        icon: 'airline_seat_recline_normal'
      },
      {
        label: 'Ähnlichkeit der Präferenzen',
        caption: 'Die Präferenzen werden gleich gewertet',
        value: 'prefs',
        icon: 'insert_emoticon'
      },
      {
        label: 'Geringste Zeit zu meiner Vorlesung',
        caption: 'Möglichst geringe Wartezeit bis Beginn',
        value: 'time',
        icon: 'timer'
      }],
      filter: [],
      filterOptions: [{
        label: 'Nur noch nicht angefragte Angebote',
        caption: 'Nur Fahrten anzeigen, die du noch nicht angefragt hast',
        value: 'notAsked',
        icon: 'device_unknown'
      },
      {
        label: 'Meine Präferenzen streng berücksichtigen',
        caption: 'Nur Fahrten mit absolut denselben (!) Präferenzen werden angezeigt.',
        value: 'prefs',
        icon: 'face'
      },
      {
        label: 'Nur reine ' + (this.$store.getters['auth/user'].gender == 'M' ? 'Jungs' : 'Mädchen') + '-Autos',
        value: 'gender',
        icon: 'wc'
      }],
      lifts: [
        {
          id: 1,
          driver: {
            fbid: "QTs2vuk6O0RHjr8uDyLBwb9DZ5G3",
            name: "Finn",
            prefs: {
              talk: "GREEN",
              talkMorning: "RED",
              smoking: "RED",
              music: "YELLOW"
            }
          },
          day_pattern: null,
          next_drive: [new Date(), new Date()],
          postcode: 70182,
          city: "Stuttgart",
          distance: 20,
          seats_offered: 4,
          seats_occupied: 2
        },
        {
          id: 2,
          driver: {
            fbid: "QTs2vuk6O0RHjr8uDyLBwb9DZ5G3",
            name: "Finn",
            prefs: {
              talk: "GREEN",
              talkMorning: "RED",
              smoking: "RED",
              music: "YELLOW"
            }
          },
          day_pattern: null,
          next_drive: [new Date("2-2-2020"), new Date()],
          postcode: 70182,
          city: "Stuttgart",
          distance: 20,
          seats_offered: 3,
          seats_occupied: 1
        },
        {
          id: 3,
          driver: {
            fbid: "QTs2vuk6O0RHjr8uDyLBwb9DZ5G3",
            name: "Finn",
            prefs: {
              talk: "GREEN",
              talkMorning: "RED",
              smoking: "RED",
              music: "YELLOW"
            }
          },
          day_pattern: {
            Montag: [true, true],
            Dienstag: [false, true],
            Mittwoch: [true, false],
            Donnerstag: [true, true],
            Freitag: [false, true],
            Samstag: [false, false],
            Sonntag: [false, false]
          },
          next_drive: null,
          postcode: 70182,
          city: "Stuttgart",
          distance: 20,
          seats_offered: 2,
          seats_occupied: 0
        },
      ]
    };
  },

  computed: {
    title(){
      var greeting = this.$store.state.greeting
      var name = this.$store.getters['auth/user'].name.split(' ')[0]
      return greeting + ', ' + name
    },

    getLifts(){
      var lifts = this.lifts
      if(this.filter){
        this.filter.forEach(item => {
        switch(item){
          case 'notAsked':
            lifts.filter(lift => {
              return true // API not implemented yet
            })
          break
          case 'gender':
            lifts.filter(lift => {
              return true // API not implemented yet
            })
          break
          case 'prefs':
            var userPrefs = this.$store.getters["auth/user"].prefs
            lifts = lifts.filter(lift => {
              var prefValues = Object.keys(lift.prefs)
              debugger
              var atLeastOneDifferent = prefValues.some(pref => {
                
                if(userPrefs[pref] != lift.prefs[pref]) return true
              })
              return !atLeastOneDifferent // when at least one different, remove that element
            })
            break 
          }
        })
      }
      
      // here comes the sorting code

      return lifts
    }
  },

  methods: {
    
  },

  mounted () {
    this.$store.commit('setPage', this.title)
    this.$store.commit('setPageTrans', 'slide')
  }
};
</script>