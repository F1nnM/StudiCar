<template>
  <q-card>
    <q-card-section>
      <div class="row">
        <div
          class="col-4 rounded-borders"
          :style="'box-shadow: -1px 0px 4px 2px' + car.color"
        >
          <q-img
            src="~assets/app-logo.svg"
            spinner-color="primary"
            spinner-size="82px"
            class="full-height full-width"
            style="max-height: 10vh; max-width: 10vh"
          />
        </div>
        <div class="col-8 q-pl-lg">
          <p class="text-h4 overflow">{{ car.brand }}</p>
          <p class="text-h6 text-weight-light">{{ car.model }}</p>
        </div>
      </div>
    </q-card-section>
    <ExtHr :color="car.color ? car.color : 'black'" hex size="xs" />
    <q-card-section class="q-pt-sm q-pa-lg">
      <div
        class="row q-"
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
        <div class="text-uppercase text-caption q-mb-sm col-7">
          {{ data.label }}
        </div>
        <div class="col-5">{{ car[data.prop] }}</div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
defineProps({
  car: Object
})
</script>

<style scoped></style>
