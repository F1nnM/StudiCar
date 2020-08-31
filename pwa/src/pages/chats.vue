<template>
  <div class="q-pa-md">
    <LiftPopup @close="liftOpen = false" :open="liftOpen" :messages="messagesToBeShown" />
    <q-list>
      <chatItem
        v-for="(item, index) in lastMessages"
        :key="item.timestamp"
        :message="item"
        :firstItem="index == 0"
        @openLift="openTheLift"
        @shortLiftInfo="openShortLiftInfo"
      />
    </q-list>
    <q-dialog v-model="shortLiftInfo" full-width square position="bottom">
      <q-card>
        <q-card-section>
          <div>
            <q-toolbar>
              <q-toolbar-title>
                <p>Würzburg -> Ansbach</p>
              </q-toolbar-title>
            </q-toolbar>
            <p class="q-px-sm">
              <q-icon name="directions_car" size="xs" />VW Golf
              <span class="q-pl-md">
                {{lift.stops.length - 1}} / {{lift.seats}}
                <q-icon name="airline_seat_recline_normal" size="sm" />
              </span>
            </p>
            <q-timeline layout="comfortable" side="right" color="primary">
              <q-timeline-entry
                v-for="(s, index) in lift.stops"
                :key="s.id"
                :title="s.adress.city"
                :subtitle="s.name"
                side="left"
                :icon="getTimelineIcon(index, s.beginsAtSchool)"
              >
                <div>{{s.adress.street}}</div>
              </q-timeline-entry>
            </q-timeline>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>

import chatItem from 'components/ChatItem'
import LiftPopup from 'components/LiftPopup'

export default {
  components: {
    chatItem,
    LiftPopup
  },

  data () {
    return {
      liftOpen: false,
      liftOpenId: lifts[0].id, // just set to id of first item to avoid error messages when no lift has been selected yet to show short info of lift
      messagesToBeShown: {
        list: []
      },
      allMessages: this.$store.getters['auth/user'].messages,
      shortLiftInfo: false,
      lifts: [{
        id: 9,
        beginsAtSchool: true,
        driverName: 'Günther',
        seats: 5,
        stops: [{
          name: 'Alicia',
          id: 61654,
          adress: {
            street: 'Hauserstraße 7',
            city: 'Hansestadt'
          }
        },
        {
          name: 'Peter',
          id: 654,
          adress: {
            street: 'Hauserstraße 7',
            city: 'Hansestadt'
          }
        },
        {
          name: 'Bob',
          id: 665,
          adress: {
            street: 'Hauserstraße 7',
            city: 'Hansestadt'
          }
        }
        ]
      }]
    }
  },

  computed: {
    lastMessages () {
      var lastOfThem = []
      var all = this.allMessages
      for (let liftId in all) {
        all[liftId].sort((a, b) => {
          return new Date(a.timestamp) - new Date(b.timestamp) // make sure that is sorted ascending by timestamp
        })
        var length = all[liftId].length
        lastOfThem.push(all[liftId][length - 1])
      }
      lastOfThem.sort((a, b) => {
        return new Date(b.timestamp) - new Date(a.timestamp) // newest message is on top of list
      })
      return lastOfThem
    },
    lift () {
      var item = this.lifts
      
      //.find(l => l.id == this.liftOpenId)
      if (!item) {
      
        return null
      }
      else return item
    }
  },

  mounted () {
    this.$store.commit('setPage', 'Mitfahrgelegenheiten')
    this.$store.commit('setPageTrans', 'slide')
  },

  methods: {
    onLeft ({ reset }) {
      //alert("SWIPED LEFT")

      this.finalize(reset)
    },

    onRight ({ reset }) {
      //alert("SWIPED RIGHT")

      this.finalize(reset)
    },

    openTheLift (liftId) {
      this.liftOpen = true

      this.messagesToBeShown = {
        list: this.sortMessages(liftId, false) // last item in array will be displayed on top of page, so we have to sort descending
      }

    },

    openShortLiftInfo (liftId) {
      this.shortLiftInfo = true
      
    },

    sortMessages (liftId, ascending) {
      var list = this.allMessages[liftId]
      list.sort((a, b) => {
        return new Date(b.timestamp) - new Date(a.timestamp)
      })
      return list
    },

    getTimelineIcon (index, beginsAtSchool) {
      if (index == 0) return beginsAtSchool ? 'school' : 'home'
      else if (index == this.lift.stops.length - 1) return !beginsAtSchool ? 'school' : 'home'
      return ''
    },

    pagetrans_zoom () {
      this.$emit('pagetrans_zoom')
    },

    pagetrans_slide () {
      this.$emit('pagetrans_slide')
    },

    long_tab ({ e }) {
      alert("LONG")
    },

    finalize (reset) {
      this.timer = setTimeout(() => {
        reset()
      }, 50)
    },

  },

  beforeDestroy () {
    clearTimeout(this.timer)
  }
}
</script>