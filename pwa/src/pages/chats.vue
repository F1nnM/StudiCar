<template>
  <div class="q-pa-md">
    <q-list>
      <chat_item
        v-for="(item, index) in chats"
        :key="item.time"
        :lift="item"
        :firstItem="index == 0"
        @openLift="openTheLift"
      />
    </q-list>
    <LiftPopup @close="liftOpen = false" :open="liftOpen" :liftProp="liftToBeShown" />
  </div>
</template>

<script>

import chat_item from 'components/chat_item'
import LiftPopup from 'components/LiftPopup'

export default {
  components: {
    chat_item,
    LiftPopup
  },

  data(){
    return{
      chats: this.$store.state.chats,
      liftOpen: false,
      liftToBeShown: null
    }
  },

  computed: {
    
  },

  mounted(){
    this.$store.commit('setPage', 'Mitfahrgelegenheiten')
    if(this.$store.state.pageTrans != 'collapse'){ // only when not coming from a lift, set pageTrans to slide
      this.$store.commit('setPageTrans', 'slide')
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

    openTheLift(event){
      this.liftOpen = true
      this.liftToBeShown = event
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

      return this.global.chats.sort(compare).reverse();
    }
  },

  beforeDestroy () {
    clearTimeout(this.timer)
  }
}
</script>