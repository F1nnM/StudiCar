<template>
  <div class="q-pa-md">
    <p class="text-h6 text-center">Eine Fahrt anbieten</p>
  </div>
</template>

<script>

export default {
  

  data () {
    return {
      
    }
  },

  mounted(){
    this.$store.commit('setPage', '')
    this.$store.commit('setPageTrans', 'slide-up')
  }
}

</script>