<template>
  <div class="q-pa-md">
    <p v-for="n in 20" :key="n">Lorem</p>
  </div>
</template>

<script>

export default {
  components: {
    
  },
  data() {
    return {
      
    };
  },
  methods: {
    
  },
  mounted () {
    
  },

  mounted(){
      this.$store.commit('setPage', 'Spielplatz')
  }
}
</script>