<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md">
      <p>Der Marktplatz ist so etwas wie das Schwarze Brett von StudiCar. Hier siehst du alle aktuellen Mitfahrgelegenheiten, aufsteigend nach Entfernung geordnet.</p>
      <LiftOffer v-for="lift in lifts" :key="lift.index" v-bind:lift="lift">{{lift.city}}</LiftOffer>
    </div>
  </div>
</template>

<script>
import LiftOffer from '../components/LiftOffer';
export default {
  components: {LiftOffer},
  data() {
    return {
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
    }
  },

  mounted () {
    this.$store.commit('setPage', this.title)
    this.$store.commit('setPageTrans', 'slide')
  }
};
</script>