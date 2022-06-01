import { boot } from 'quasar/wrappers'
import { useUserStore } from 'src/stores/user'

export default boot(({ router, store }) => {
  router.beforeEach(async (to, from, next) => {
    // Check to see if the route has the meta field "authRequired" set to true
    const authRequired = to.matched.some(route => route.meta.requiresAuth)

    const userStore = useUserStore(store)

    if (authRequired) {
      console.log(userStore.loggedIn)
      if (userStore.loggedIn) {
        // User is already signed in. Continue on.
       next()
      } else {
        // Not signed in. Redirect to login page.
        next({
          name: 'signIn'
        })
      }
    } else {
      // Doesn't require authentication. Just continue on.
      next()

    }
  })
})