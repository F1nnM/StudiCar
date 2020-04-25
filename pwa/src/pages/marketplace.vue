<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md">
      <p>Der Marktplatz ist so etwas wie das Schwarze Brett von StudiCar. Hier siehst du alle aktuellen Mitfahrgelegenheiten, aufsteigend nach Entfernung geordnet.</p>
      <p v-for="n in 20" :key="n">Lorem</p>
    </div>
  </div>
</template>

<script>
export default {


  data() {
    return {
      
    };
  },

  computed: {
    title(){
      var greeting = this.$store.state.greeting
      var name = this.$store.getters['auth/user'].name.split(' ')[0]
      return greeting + ', ' + name
    }
  },

  mounted () {
    this.$store.commit('setPage', this.title)
    this.$store.commit('setPageTrans', 'slide')
  }
};
</script>