<template>
  <div class="q-pa-md">
    <LiftPopup
      @close="liftOpen = false"
      :open="liftOpen"
      :messages="messagesToBeShown"
    />
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
    <q-dialog
      v-model="shortLiftInfo"
      full-width
      square
      persistent
      position="bottom"
    >
      <div class="row">
        <div class="col-8">
          <q-expansion-item>
            <template v-slot:header>
              <q-toolbar>
                <q-toolbar-title>Würzburg -> Ansbach</q-toolbar-title>
              </q-toolbar>
              <p>
                <q-icon
                  name="directions_car"
                  size="xs"
                />VW Golf
              </p>
            </template>
            <q-stepper
              v-model="shortLiftInfo"
              color="primary"
            >
              <q-step
                :name="1"
                title="Erste Stadt"
                caption="Straße soundso"
                icon="settings"
              ></q-step>
              <q-step
                :name="1"
                title="Erste Stadt"
                caption="Straße soundso"
                icon="settings"
              ></q-step>
            </q-stepper>
          </q-expansion-item>
          <div class="row">
            <div
              v-for="day in week"
              :key="day"
              class="col-1"
            >
              <p>{{day.name}}</p>
            </div>
          </div>

          <div class="row">
            <div
              v-for="day in week"
              :key="day"
              class="col-1"
            >
              <p>{{day.value}}</p>
            </div>
          </div>
        </div>
        <div class="col-4">
          <q-list
            bordered
            padding
          >
            <q-item-label header>Fahrer</q-item-label>
            <q-item
              clickable
              v-ripple
            >
              <q-item-section>
                <q-item-label>{{lift.driverName}}</q-item-label>
              </q-item-section>
            </q-item>
            <q-separator spaced />
            <q-item>
              <q-item-label header>
                <div class="row">
                  <div class="col-7">Mitfahrer</div>
                  <div class="col-5">
                    {{lift.passengers.length}} / {{lift.seats}}
                    <q-icon
                      name="airline_seat_recline_normal"
                      size="xs"
                    />
                  </div>
                </div>
              </q-item-label>
            </q-item>

            <q-item
              v-for="user in lift.passengers"
              :key="user.id"
            >
              <q-item-section>
                <q-item-label>user.name</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
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
      messagesToBeShown: {
        list: []
      },
      allMessages: this.$store.getters['auth/user'].messages,
      shortLiftInfo: false,
      lift: {
        driverName: 'Günther',
        seats: 5,
        passengers: [{
          name: 'Alicia',
          id: 61654
        },
        {
          name: 'Peter',
          id: 654
        },
        {
          name: 'Bob',
          id: 665
        }
        ]
      },
      week: [{
        name: 'M',
        value: 1
      },
      {
        name: 'D',
        value: 2
      },
      {
        name: 'M',
        value: 3
      },
      {
        name: 'D',
        value: 1
      },
      {
        name: 'F',
        value: 2
      },
      {
        name: 'S',
        value: 2
      },
      {
        name: 'S',
        value: 1
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