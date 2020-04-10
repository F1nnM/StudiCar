<template>
  <div class="q-pa-md" style="max-width: 350px">
    <p class="text-h6 text-center bordered">Mitfahrgelegenheiten</p>
    <hr />
    <q-list>
      <chat_item
        v-for="item in chats"
        :key="item.id"
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
        time: 'vor 3 Min',
        last: {
          user: 'Janet',
          message: 'Hier könnte Ihre Werbung stehen, und das ist einfacher Platzhalter Text'
        }
      },
      {
        id: 3,
        title: 'Zweites Lorem ipsum',
        time: 'vor 7 Min',
        last: {
          user: 'Janet',
          message: 'Hier könnte Ihre Werbung stehen, und das ist einfacher Platzhalter Text'
        }
      },
      {
        id: 2,
        title: 'Zweites Lorem ipsum',
        time: 'vor 4 Min',
        last: {
          user: 'Janet',
          message: 'Hier könnte Ihre Werbung stehen, und das ist einfacher Platzhalter Text'
        }
      },
      {
        id: 4,
        title: 'Zweites Lorem ipsum',
        time: 'vor 6 Min',
        last: {
          user: 'Janet',
          message: 'Hier könnte Ihre Werbung stehen, und das ist einfacher Platzhalter Text'
        }
      },
      {
        id: 5,
        title: 'Zweites Lorem ipsum',
        time: 'vor 13 Min',
        last: {
          user: 'Janet',
          message: 'Hier könnte Ihre Werbung stehen, und das ist einfacher Platzhalter Text'
        }
      },
      {
        id: 5,
        title: 'Zweites Lorem ipsum',
        time: 'vor 13 Min',
        last: {
          user: 'Janet',
          message: 'Hier könnte Ihre Werbung stehen, und das ist einfacher Platzhalter Text'
        }
      },
      {
        id: 5,
        title: 'Zweites Lorem ipsum',
        time: 'vor 13 Min',
        last: {
          user: 'Janet',
          message: 'Hier könnte Ihre Werbung stehen, und das ist einfacher Platzhalter Text'
        }
      },
      {
        id: 5,
        title: 'Zweites Lorem ipsum',
        time: 'vor 13 Min',
        last: {
          user: 'Janet',
          message: 'Hier könnte Ihre Werbung stehen, und das ist einfacher Platzhalter Text'
        }
      },
      {
        id: 5,
        title: 'Zweites Lorem ipsum',
        time: 'vor 13 Min',
        last: {
          user: 'Janet',
          message: 'Hier könnte Ihre Werbung stehen, und das ist einfacher Platzhalter Text'
        }
      },
      {
        id: 5,
        title: 'Zweites Lorem ipsum',
        time: 'vor 13 Min',
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
    }
  },

  beforeDestroy () {
    clearTimeout(this.timer)
  }
}
</script>