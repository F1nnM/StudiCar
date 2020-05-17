<template>
  <div class="q-pa-md">
    <extHR color="red" size="xl" borderRadius="50%" />

    <p v-for="n in 20" :key="n">Lorem</p>
  </div>
</template>

<script>


import { scroll } from 'quasar'
import extHR from 'components/extended_hr'

export default {
  components: {
    extHR
  },
  data() {
    return {
      show: false,
      titleSize: null,
      code: false,
      result: null
    };
  },
  methods: {
    
  },

  mounted(){
      this.$store.commit('setPage', 'Spielwiese')
  }
}
</script>