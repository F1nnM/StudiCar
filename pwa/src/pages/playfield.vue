<template>
  <div class="q-pa-md">
    <vue-record-audio @result="onResult" />
    <p>
      Audio:
      <audio controls :src="result"></audio>
    </p>

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
      result: null
    };
  },
  methods: {
    onResult (data) {
      
      console.warn('The blob data:', data);
      console.warn('Downloadable audio', window.URL.createObjectURL(data));
      this.result = window.URL.createObjectURL(data)
    }
  },

  mounted(){
      this.$store.commit('setPage', 'Spielwiese')
  }
}
</script>