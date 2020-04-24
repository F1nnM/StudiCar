<template>
  <div class="q-pa-md">
    <!-- <q-scroll-observer @scroll="scrollHandler" /> -->
    <br />
    <br />
    <div
      :class="'text-h' + titleSize + ' custom-underline c-u-l c-u-2 c-u-md'"
      id="title"
    >Name {{titleSize}}</div>
    <br />

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
      titleSize: null
    };
  },
  methods: {
    scrollHandler(info){
      this.titleSize = info.position < 50 ? (Math.ceil(info.position / 10) + 1) : 5
    }
  },
  mounted () {
   
    }
};
</script>