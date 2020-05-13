<template>
  <div class="q-pa-md">
    <p class="text-h6 text-center">Eine Fahrt anbieten</p>
    <q-form class="">
      <q-select :options="carOptions"/>
    </q-form>
  </div>
</template>

<script>

export default {


  data() {
    return {

    }
  },
  computed: {
    carOptions() {
      let cars = [];
      for(let car of this.$store.getters["auth/user"].cars) {
        cars.push(car.licensePlate+" - "+car.brand +" "+ car.model)
      }
      return cars;
    }
  },

  mounted() {
    this.$store.commit('setPage', '')
    this.$store.commit('setPageTrans', 'slide-up')
  }
}

</script>