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

      <!-- <p>Der Marktplatz ist so etwas wie das Schwarze Brett von StudiCar. Hier siehst du alle aktuellen Mitfahrgelegenheiten, aufsteigend nach Entfernung geordnet.</p> -->
      <LiftOffer v-for="lift in getLifts" :key="lift.index" v-bind:lift="lift">{{lift.city}}</LiftOffer>
      <div
        class="text-caption"
        v-show="!(getLifts.length || filter.length)"
      >Anscheinend gibt es für dich gerade keine Angebote. Schau einfach später nochmal vorbei.</div>
      <!-- above case for neither lifts nor filter applied -->
      <div
        class="text-caption"
        v-show="!getLifts.length && filter.length"
      >Anscheinend gibt es keine Angebote, die deinen Filterkriterien entsprechen.</div>
      <!-- above case for lifts all not matching selected filter settings -->
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
      sort: {value: 'distance', label: 'niedrigste Entfernung'}, //default sorting order
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
        label: 'Toleranz',
        caption: 'Sortiert nach Präferenzen, alle gleichwertig',
        value: 'prefs',
        icon: 'insert_emoticon'
      },
      {
        label: 'Geringste Zeit zum Unterricht',
        caption: 'Möglichst geringe Wartezeit bis Beginn der Veranstaltung',
        value: 'time',
        icon: 'timer',
        disabled: true
      }],
      filter: [],
      filterOptions: [{
        label: 'Nur noch nicht angefragte Angebote',
        caption: 'Nur Fahrten anzeigen, bei denen du noch nicht um Mitnahme gebeten hast',
        value: 'notAsked',
        icon: 'device_unknown',
        disabled: true
      },
      {
        label: 'Meine Präferenzen streng berücksichtigen',
        caption: 'Nur Fahrten mit absolut denselben (!) Präferenzen werden angezeigt.',
        value: 'prefs',
        icon: 'face'
      }
      // here an additional option will be generated in mounted() since we didn't make it to access computeds in here
      ],
      lifts: [
        {
          id: 1,
          driver: {
            fbid: "QTs2vuk6O0RHjr8uDyLBwb9DZ5G3",
            name: "Finn",
            prefs: {
              talk: "GREEN",
              talkMorning: "GREEN",
              smoking: "GREEN",
              music: "GREEN"
            }
          },
          day_pattern: null,
          next_drive: [new Date(), new Date()],
          postcode: 70182,
          city: "Stuttgart",
          distance: 35,
          seats_offered: 4,
          seats_occupied: 2
        },
        {
          id: 2,
          driver: {
            fbid: "QTs2vuk6O0RHjr8uDyLBwb9DZ5G3",
            name: "Finn",
            prefs: {
              talk: "RED",
              talkMorning: "RED",
              smoking: "RED",
              music: "RED"
            }
          },
          day_pattern: null,
          next_drive: [new Date("2-2-2020"), new Date()],
          postcode: 70182,
          city: "Stuttgart",
          distance: 30,
          seats_offered: 3,
          seats_occupied: 1
        },
        {
          id: 3,
          driver: {
            fbid: "QTs2vuk6O0RHjr8uDyLBwb9DZ5G3",
            name: "Finn",
            prefs: {
              talk: "YELLOW",
              talkMorning: "YELLOW",
              smoking: "YELLOW",
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
        {
          id: 4, // this offer always has preferences of visiting user, perfect for testing prefs filter
          driver: {
            fbid: "wG3cG4M7NFMJzJYcreFjLrJC9Q23",
            name: "Bernd",
            prefs: {
              talk: this.$store.getters["auth/user"].prefs.talk,
              talkMorning: this.$store.getters["auth/user"].prefs.talkMorning,
              smoking: this.$store.getters["auth/user"].prefs.smoking,
              music: this.$store.getters["auth/user"].prefs.music
            }
          },
          day_pattern: null,
          next_drive: [new Date("2-2-2020"), new Date()],
          postcode: 86653,
          city: "Daiting",
          distance: 15,
          seats_offered: 3,
          seats_occupied: 1
        }
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
      
      // filter code
      if(this.filter.length){
        
        this.filter.forEach(item => {
          item = item.value
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
              var prefValues = Object.keys(lift.driver.prefs)
              var atLeastOneDifferent = prefValues.some(pref => {
                
                if(userPrefs[pref] != lift.driver.prefs[pref]) return true
              })
              
              return !atLeastOneDifferent // when at least one different, remove that element
            })
            
            break 
          }
        })
      }
      
      // here comes the sorting code

      if(this.sort){
        switch(this.sort.value){
          case 'distance':
            lifts.sort((a, b) => {
              return a.distance - b.distance
            })
          break
          case 'seats':
            lifts.sort((a, b) => {
              return a.seats_occupied - b.seats_occupied
            })
          break
          case 'prefs':
            var prefScores = []
            var userPrefs = this.$store.getters["auth/user"].prefs
            lifts.forEach(lift => {
              let liftScore = 0
              Object.keys(lift.driver.prefs).forEach(prefName => {
                // get the prefs by themself
                let liftPref = lift.driver.prefs[prefName]
                let userPref = userPrefs[prefName]

                // convert it to calculatable value
                liftPref = liftPref == 'GREEN' ? 3 : liftPref == 'YELLOW' ? 2 : 1

                //userPref = userPref == 'GREEN' ? 3 : userPref == 'YELLOW' ? 2 : 1
                

                liftScore += liftPref // - userPref) // the better pref of the lift related to pref of user, the better the score
                
                // AT MOMENT NOT USED: when user's Pref higher than liftPref, it is negative and so the average result of all pref comparisons in this lift is worse

              })

              prefScores.push(liftScore) // when saving like this, the index of the value is the same as the lift id, because outer loop goes through lifts


            })

            // now we have an array containing our stores, and have to sort our lifts depending on the score they got
            
            lifts.sort((a, b) => {
              // here we get a and b as lift to be compared. The ids are the indices of prefArray

              return prefScores[a.id - 1] - prefScores[b.id - 1]
            })
            lifts.reverse()
            
          break
          case 'time':
            // API not implemented yet
          break
        }
      }
      

      return lifts
    }
  },

  methods: {
    genderName(){
      switch(this.$store.getters['auth/user'].gender){
        case 'M':
          return 'Jungs'
        break
        case 'W':
          return 'Mädchen'
        break
        case 'D':
          return 'Diversen'
        case 'X':
          return 'noch nicht eingestellt'
        break
        default:
          return 'Fehlermenschen'
      }
    }
  },

  mounted () {

    this.$store.commit('setPage', this.title)
    this.$store.commit('setPageTrans', 'slide')

    this.filterOptions.push({
      label: 'Nur reine ' + this.genderName() + '-Autos',
      value: 'gender',
      caption: 'Nur Autos anzeigen, bei denen nur ' + this.genderName() + ' mitfahren',
      icon: 'wc',
      disabled: true // genderCarsAvaiable ? this.$store.getters['auth/user'].gender == 'X'
    })
  }
};
</script>