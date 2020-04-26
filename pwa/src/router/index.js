import Vue from 'vue'
import VueRouter from 'vue-router'
import VueRecord from '@codekraft-studio/vue-record'

import routes from './routes'

import { dom } from 'quasar'
import { date } from 'quasar'
const { ready } = dom

Vue.use(VueRouter)

Vue.use(VueRecord)


Vue.prototype.global = {
  user: {
    createdAt: new Date(2020, 2).getTime(),
    liftsAll: 17,
    avgLifts: 5,
    chats: [{
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
}



/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function (/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  return Router
}