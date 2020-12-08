<template>
  <q-card>
    <q-card-section>
      <div class="row">
        <div class="col-5 shadow-2 rounded-borders">
          <q-img
            src="~assets/app-logo.svg"
            spinner-color="primary"
            spinner-size="82px"
            class="full-height full-width"
            style="max-height: 20vh"
          />
        </div>
        <div class="col-7 q-pa-lg">
          <p class="text-h4 overflow">{{ car.brand }}</p>
          <p class="text-h6 text-weight-light">{{ car.model }}</p>
        </div>
      </div>
    </q-card-section>
    <ExtHr :color="car.color ? car.color : 'black'" hex size="xs" />
    <q-card-section class="q-pt-sm q-pa-lg">
      <div
        class="row"
        v-for="data in [
                  {
                    prop: 'type',
                    label: 'Fahrzeugtyp',
                  },
                  {
                    prop: 'seats',
                    label: 'Freie Sitze',
                  },
                  {
                    prop: 'licensePlate',
                    label: 'Kennzeichen',
                  },
                  {
                    prop: 'year',
                    label: 'Baujahr',
                  },
                ]"
        :key="data.prop"
      >
        <p class="text-uppercase text-caption col-7">{{ data.label }}</p>
        <p class="col-5">{{ car[data.prop] }}</p>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { date } from "quasar";
import ExtHr from "components/ExtendedHr";

export default {
  name: "CarInfo",
  components: {
    ExtHr
  },
  props: {
    car: Object
  },
  data() {
    return {};
  },
  computed: {},
  methods: {},
  mounted() {}
};
</script>

<style scoped>
</style>