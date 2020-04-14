<template>
  <div class="q-pa-md" style="max-width: 350px">
    <p class="text-h6 text-center bordered">Mitfahrgelegenheiten</p>
    <hr />
    <q-list>
      <chat_item
        v-for="item in sort_chats()"
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
      chats:[{
        id: 1,
        title: 'Lorem ipsum dolor',
        time: 1586101000127,
        last: {
          user: 'Janet',
          message: 'Hier könnte Ihre Werbung stehen, und das ist einfacher Platzhalter Text'
        }
      },
      {
        id: 3,
        title: 'Zweites Lorem ipsum',
        time: 1586201000127,
        last: {
          user: 'Janet',
          message: 'Hier könnte Ihre Werbung stehen, und das ist einfacher Platzhalter Text'
        }
      },
      {
        id: 2,
        title: 'Zweites Lorem ipsum',
        time: 1586301000127,
        last: {
          user: 'Janet',
          message: 'Hier könnte Ihre Werbung stehen, und das ist einfacher Platzhalter Text'
        }
      },
      {
        id: 4,
        title: 'Zweites Lorem ipsum',
        time: 1586400000127,
        last: {
          user: 'Janet',
          message: 'Hier könnte Ihre Werbung stehen, und das ist einfacher Platzhalter Text'
        }
      },
      {
        id: 5,
        title: 'Zweites Lorem ipsum',
        time: 1586401000127,
        last: {
          user: 'Janet',
          message: 'Hier könnte Ihre Werbung stehen, und das ist einfacher Platzhalter Text'
        }
      },
      {
        id: 5,
        title: 'Zweites Lorem ipsum',
        time: 1586501000127,
        last: {
          user: 'Janet',
          message: 'Hier könnte Ihre Werbung stehen, und das ist einfacher Platzhalter Text'
        }
      },
      {
        id: 5,
        title: 'Zweites Lorem ipsum',
        time: 1586601000127,
        last: {
          user: 'Janet',
          message: 'Hier könnte Ihre Werbung stehen, und das ist einfacher Platzhalter Text'
        }
      },
      {
        id: 5,
        title: 'Zweites Lorem ipsum',
        time: 1586701000127,
        last: {
          user: 'Janet',
          message: 'Hier könnte Ihre Werbung stehen, und das ist einfacher Platzhalter Text'
        }
      },
      {
        id: 5,
        title: 'Zweites Lorem ipsum',
        time: 1000701000127,
        last: {
          user: 'Ältestes',
          message: 'Hier könnte Ihre Werbung stehen, und das ist einfacher Platzhalter Text'
        }
      },
      {
        id: 5,
        title: 'Zweites Lorem ipsum',
        time: 1586701400127,
        last: {
          user: 'Neuestes',
          message: 'Hier könnte Ihre Werbung stehen, und das ist einfacher Platzhalter Text'
        }
      },
      {
        id: 5,
        title: 'Zweites Lorem ipsum',
        time: 1586701300127,
        last: {
          user: 'Janet',
          message: 'Hier könnte Ihre Werbung stehen, und das ist einfacher Platzhalter Text'
        }
      }]
    }
  },

  methods: {
    onLeft ({ reset }) {
      alert("SWIPED LEFT")
      
      this.finalize(reset)
    },

    pagetrans_zoom(){
      this.$emit('pagetrans_zoom')
    },

    pagetrans_slide(){
      this.$emit('pagetrans_slide')
    },

    onRight ({ reset }) {
      alert("SWIPED RIGHT")
      
      this.finalize(reset)
    },

    long_tab({e}){
      alert("LONG")
    },

    finalize (reset) {
      this.timer = setTimeout(() => {
        reset()
      }, 1000)
    },

    sort_chats() {
      function compare(a, b) {
        if (a.time < b.time)
          return -1;
        if (a.time > b.time)
          return 1;
        return 0;
      }

      return this.chats.sort(compare).reverse();
    }
  },

  beforeDestroy () {
    clearTimeout(this.timer)
  }
}
</script>