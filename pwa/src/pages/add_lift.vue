<template>
  <div class="q-pa-md">
    <p class="text-h6 text-center">Eine Fahrt anbieten</p>
    <q-stepper v-model="step" vertical class="overflow-scroll" color="primary" animated>
      <q-step :name="1" title="Wähle dein Ziel aus" icon="near_me" :done="step > 1">
        <p class="text-caption">Fährst du zur Hochschule oder nach Hause?</p>
        <q-list>
          <q-item tag="label">
            <q-item-section avatar>
              <q-radio v-model="lift.destination" val="school" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Zur Hochschule</q-item-label>
              <q-item-label caption>Du kannst dann noch auswählen, zu welchem Gebäude du fährst.</q-item-label>
            </q-item-section>
          </q-item>

          <q-item tag="label">
            <q-item-section avatar>
              <q-radio v-model="lift.destination" val="home" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Nach Hause</q-item-label>
              <q-item-label caption>Du kannst dann noch aus deinen Adressen auswählen.</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>

        <q-stepper-navigation>
          <q-btn @click="step++" color="primary" label="Weiter" />
        </q-stepper-navigation>
      </q-step>

      <q-step :name="2" title="Genaue Adresse auswählen" icon="location_on" :done="step > 2">
        <p class="text-caption">Wo fährst du genau hin?</p>
        <q-list>
          <p class="text-caption text-red" v-if="!getExactAddresses.length">
            <!-- when shown, school cannot be selected, because then length would not be 0 -->
            Du hast noch keine Adressen hinterlegt, aus denen du auswählen könntest.
          </p>
          <q-item tag="label" v-for="address in getExactAddresses" :key="address.id">
            <q-radio v-model="lift.destinationAddress" :val="address.id" />
            <q-item-section avatar>
              <q-avatar rounded>
                <img class="shadow-3 q-ma-none" src="~assets/school_images/1.jpg" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label>{{address.nickname}}</q-item-label>
              <q-item-label caption>{{address.street}} {{address.number}}</q-item-label>
              <q-item-label caption>{{address.city}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <q-stepper-navigation>
          <q-btn flat @click="step--" color="primary" label="Eins zurück" class="q-ml-sm" />
          <q-btn @click="step++" color="primary" label="Weiter" />
        </q-stepper-navigation>
      </q-step>

      <q-step :name="3" title="Auto auswählen" icon="emoji_transportation" :done="step > 3">
        <p class="text-caption">Mit welchem Auto fährst du?</p>
        <q-list>
          <p
            class="text-caption text-red"
            v-if="!userCars.length"
          >Du hast noch keine Fahrzeuge eingestellt, aus denen du auswählen könntest.</p>
          <q-item tag="label" v-for="car in userCars" :key="car.carId" class="q-pr-none">
            <q-radio v-model="lift.car" :val="car.carId" />
            <q-item-section avatar>
              <q-avatar rounded>
                <img class="shadow-3 q-ma-none" src="~assets/loremimage.jpg" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label>{{car.brand}} {{car.model}}</q-item-label>
              <extHR class="q-my-sm" :color="car.color" size="1px" />
              <q-item-label caption>
                {{car.licensePlate}} ({{car.seats}}
                <q-icon name="airline_seat_recline_normal" size="xs" />frei)
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <q-stepper-navigation>
          <q-btn flat @click="step--" color="primary" label="Eins Zurück" class="q-ml-sm" />
          <q-btn @click="step ++" color="primary" label="Weiter" />
        </q-stepper-navigation>
      </q-step>

      <q-step :name="4" title="Sitze bearbeiten" icon="person_add" :done="step > 4">
        <p
          class="text-caption"
        >Wie viele Leute nimmst du diesmal mit? (Hinweis: Wenn du hier 0 beibehältst, übernehmen wir {{getCarSeats}} Mitfahrer wie sonst auch)</p>
        <q-item>
          <q-item-section avatar>
            <q-icon
              :color="lift.newSeats ? 'primary' : 'grey-4'"
              name="airline_seat_recline_normal"
            />
          </q-item-section>
          <q-item-section>
            <q-slider
              markers
              thumb-path="M7.59 5.41c-.78-.78-.78-2.05 0-2.83.78-.78 2.05-.78 2.83 0 .78.78.78 2.05 0 2.83-.79.79-2.05.79-2.83 0zM6 16V7H4v9c0 2.76 2.24 5 5 5h6v-2H9c-1.66 0-3-1.34-3-3zm14 4.07L14.93 15H11.5v-3.68c1.4 1.15 3.6 2.16 5.5 2.16v-2.16c-1.66.02-3.61-.87-4.67-2.04l-1.4-1.55c-.19-.21-.43-.38-.69-.5-.29-.14-.62-.23-.96-.23h-.03C8.01 7 7 8.01 7 9.25V15c0 1.66 1.34 3 3 3h5.07l3.5 3.5L20 20.07z"
              v-model="lift.newSeats"
              :min="0"
              :max="9"
              :step="1"
              snap
              label
              label-always
            />
          </q-item-section>
        </q-item>

        <q-stepper-navigation>
          <q-btn color="primary" @click="step --" label="Zurück" flat />
          <q-btn @click="step ++" color="primary" label="Abschließen" class="q-ml-sm" />
        </q-stepper-navigation>
      </q-step>

      <q-step :name="5" title="Angaben überprüfen" icon="done">
        <p
          class="text-caption"
        >Bitte wirf nochmal einen Blick auf deine Angaben, bevor wir dein Angebot veröffentlichen.</p>
        <q-stepper-navigation>
          <q-btn color="primary" @click="step = 1" label="Bearbeiten" flat />
          <q-btn @click="addLift" color="primary" label="Freigeben" class="q-ml-sm" />
        </q-stepper-navigation>
      </q-step>
    </q-stepper>
  </div>
</template>

<script>

import extHR from 'components/extended_hr'

export default {

  components: {extHR},

  data() {
    return {
      lift: {
        destination: 'school', // default set to school, user selects first home/school, then exact address
        destinationAddress: 1,
        car: null,
        newSeats: 0 // just to avoid error when rendering slider
      },
      step: 1
    }
  },
  computed: {
    carOptions() {
      let cars = [];
      for(let car of this.$store.getters["auth/user"].cars) {
        cars.push(car.licensePlate+" - "+car.brand +" "+ car.model)
      }
      return cars;
    },

    userCars(){
      return this.$store.getters["auth/user"].cars
    },

    getCarSeats(){ // returns seats of selected car, so that user sees how many seats would be default
      let cars = this.$store.getters["auth/user"].cars
      let obj = cars.find(item => {
        return item.carId == this.lift.car
      })
      return obj ? obj.seats : 0 // fallback when no car has been selected yet
    },

    liftValue: {
      get(){
        return this.lift
      },
      set(value){
        this.lift = value
        this.step+=1
      }
    },

    getExactAddresses(){
      if(this.lift.destination == 'school'){
        return this.$store.getters["auth/user"].school_addresses
      }
      else if(this.lift.destination == 'home'){
        let a = this.$store.getters["auth/user"].addresses
        
        return a
      }
      return null
    }
  },

  methods: {
    addLift(){
      
    }
  },

  mounted() {
    this.$store.commit('setPage', '')
    this.$store.commit('setPageTrans', 'slide-up')
  }
}

</script>