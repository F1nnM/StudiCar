<template>
  <div class="q-pa-md">
    <q-btn label="Feuer" @click="go()" />
    <p v-for="n in 20" :key="n">Lorem</p>
  </div>
</template>

<script>

import { scroll } from 'quasar'
import { sendApiRequest, SQL_TEST_ADD } from '../ApiAccess'


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
  methods: {
    go(){
      sendApiRequest(SQL_TEST_ADD, {
        data: 1
      }, data => {
        alert(data)
      }, err => {
        alert(err)
      })
    }
  },

  mounted(){
      this.$store.commit('setPage', 'Spielwiese')
  }
}
</script>