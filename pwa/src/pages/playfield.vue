<template>
  <div class="q-pa-md">
    <drawerImage timeText="Willkommen" />

    <p v-for="n in 20" :key="n">Lorem</p>
  </div>
</template>

<script>


import { scroll } from 'quasar'
import drawerImage from 'components/drawerWelcomeImage'

export default {
  components: {
    drawerImage
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