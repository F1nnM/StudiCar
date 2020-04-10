import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'

import { dom } from 'quasar'
const { ready } = dom

// Execute a Function when DOM is ready:
ready(function () {
  try {
    document.getElementById("hallo").style.backgroundColor = "red";
  }
  catch (e) {

  }
})

Vue.use(VueRouter)

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

/*
{
  lift: {
    lift_id: int,
    created_by: uid1,
    created_at: utc_timestamp,
    users: [{
      uid: String
    }],
    car: {
      brand: String,
      model: String,
      color: String,
      number_plate: String,
      seats: int2
    }
    messages: [{
      sender: uid,
      timestamp: utc_timestamp,
      content: String
    }]
  }
}
*/