<template>
  <div class="q-pa-md">
    <p class="text-h6 text-center bordered">Mitfahrgelegenheiten</p>
    <hr />
    <q-list>
      <chat_item
        v-for="item in sortChats()"
        :key="item.time"
        :lift="item"
        v-on:pagetrans_zoom="$emit('pagetrans_zoom')"
        v-on:pagetrans_slide="$emit('pagetrans_slide')"
        v-on:pagetrans_y="$emit('pagetrans_y', $event)"
      />
    </q-list>
  </div>
</template>

<script>

import chat_item from 'components/chat_item'

export default {
  components: {
    chat_item
  },

  data(){
    return{
      
    }
  },

  methods: {
    onLeft ({ reset }) {
      //alert("SWIPED LEFT")
      
      this.finalize(reset)
    },
    
    onRight ({ reset }) {
      //alert("SWIPED RIGHT")
      
      this.finalize(reset)
    },

    pagetrans_zoom(){
      this.$emit('pagetrans_zoom')
    },

    pagetrans_slide(){
      this.$emit('pagetrans_slide')
    },

    long_tab({e}){
      alert("LONG")
    },

    finalize (reset) {
      this.timer = setTimeout(() => {
        reset()
      }, 50)
    },

    sortChats() {
      function compare(a, b) {
        if (a.time < b.time)
          return -1;
        if (a.time > b.time)
          return 1;
        return 0;
      }

      return this.global.user.chats.sort(compare).reverse();
    }
  },

  beforeDestroy () {
    clearTimeout(this.timer)
  }
}
</script>