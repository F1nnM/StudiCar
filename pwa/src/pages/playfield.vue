<template>
  <div class="q-pa-md">
    <q-toggle v-model="code" label="Code" />
    <qrGenerator :show="code" input="wG3cG4M7NFMJzJYcreFjLrJC9Q23" />

    <p v-for="n in 20" :key="n">Lorem</p>
  </div>
</template>

<script>

import qrGenerator from 'components/qrGenerator'

import { scroll } from 'quasar'

export default {
  components: {
    qrGenerator
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