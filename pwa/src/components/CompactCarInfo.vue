<template>
  <div>
    <q-item class="q-pr-none full-width">
      <q-item-section avatar class="q-pa-sm">
        <svg
          height="28px"
          width="28px"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          :fill="carColor"
          stroke="black"
        >
          <!--  <path d="M0 0h24v24H0z" fill="none" /> -->
          <!-- <path
            d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"
          /> -->
          <!-- <path d="M0 0h24v24H0z" fill="none" /> -->
  <path
    :fill="carColor"
    d="
    M18.92 5.01C18.72 4.42 18.16 4 17.5 4h-11c-.66
     0-1.21.42-1.42 1.01L3 11v8c0 .55.45 1 1 
     1h1c.55 0 1-0.45 1-1v-1h12v1c0 .55.45 1 1
      1h1c0 0 1-.45 1-1v-8l-2.08-5.99zM6.5 15c-.83
       0-1.5-.67-1.5-1.5S5.67
        12 6.5 12s1.5.67 
       1.5 1.5S7.33 15 6.5 15zm11 0c-.83 
       0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67
        1.5 1.5-.67 1.5-1.5 1.5zM5 10l1.5-4.5h11L19 10H5z"
  />
  <g fill="black" stroke="none">
    <path
      fill="black"
      stroke="none"
      d="M 3 18 
      Q 2.8 20.1 4.5 20.1
      Q 6.2 20.1 5.9 18"
    />
    <path
      fill="black"
      stroke="none"
      d="M 18 18 
      Q 17.8 20.1 19.5 20.1
      Q 21.2 20.1 20.9 18"
    />
  </g>
        </svg>
      </q-item-section>
      <q-item-section>
        <q-item-label>
          <span class="text-bold q-mr-xs">{{ car.brand }}</span>
        </q-item-label>
        <q-item-label>
          <span>{{ car.model }}</span>
        </q-item-label>
        <q-item-label caption>
          <div class="row" v-if="compactView">
            <!-- <q-chip color="black" text-color="white" size="sm">{{ car.type }}</q-chip> -->
            <q-chip icon="event_seat" size="sm">{{ car.seats || car.allSeats }}</q-chip>
          </div>
          <span v-else>{{ car.licensePlate }}</span>
        </q-item-label>
      </q-item-section>
      <q-item-section side top v-if="!compactView">
        <div class="row justify-between">
          <q-chip icon="event_seat" size="sm">{{ car.seats || car.allSeats }} verfügbar</q-chip>
        </div>
      </q-item-section>
      <q-item-section side>
        <q-btn
          v-if="expandable"
          @click="showDetails = !showDetails"
          dense
          flat
          :icon="`keyboard_arrow_${showDetails ? 'up' : 'down'}`"
        />
      </q-item-section>
    </q-item>
    <q-slide-transition>
      <div v-if="showDetails">
        <q-item class="q-mb-xs">
          <q-item-section avatar></q-item-section>
          <q-item-section>
            <q-item-label caption>
              <span>Bauj. {{ car.year || car.built }}</span>
            </q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label v-if="showDetails" caption>
              <q-chip color="black" text-color="white" size="sm">{{ car.type }}</q-chip>
            </q-item-label>
          </q-item-section>
        </q-item>
      </div>
    </q-slide-transition>
  </div>
</template>

<script>
export default {
  components: {},
  name: "CompactCarInfo",
  props: {
    car: {
      type: Object,
      required: true
    },
    expandable: Boolean,
    compactView: Boolean
  },
  data() {
    return {
      showDetails: false
    };
  },
  computed: {
    carColor() {
      var c = this.car.color;
      if (!c.includes("#")) return "#" + c;
      else return c;
    }
  }
};
</script>
