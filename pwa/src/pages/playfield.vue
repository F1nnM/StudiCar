<template>
  <div class="q-pa-md">
    <p v-for="n in 20" :key="n">Lorem</p>
  </div>
</template>

<script>


import { scroll } from 'quasar'


export default {
  components: {
    
  },
  data() {
    return {
      show: false,
      titleSize: null,
      code: false,
      result: null
    };
  },
  computed: {
    

  },

  mounted(){
      this.$store.commit('setPage', 'Spielwiese')
  }
}
</script>