import Firebase from 'firebase/compat/app'
import 'firebase/compat/auth'

export default ({ app, router, Vue, store, urlPath }) => {
  router.beforeEach(async (to, from, next) => {
    // Check to see if the route has the meta field "authRequired" set to true
    let authRequired = to.matched.some(route => route.meta.requiresAuth)

    /* var current = router.history.current,
      areOptionsWanted = !!Object.keys(current.query).length
    console.warn(current) */
    var optionsWanted = window.location.href.includes('?') && !store.getters['getNextPage']
    if (optionsWanted) store.commit('setWantedPage', window.location.href)

    var byPass = false,
      enableLinkHandling = false


    if (!process.env.DEV) byPass = false // bypass can only be used in development
    let isAuthenticated = await Firebase.auth().currentUser !== null

    if (authRequired && !byPass) {
      if (isAuthenticated) {
        // User is already signed in. Continue on.

        if (enableLinkHandling) {

          var nextPage = store.getters['getNextPage']
          if (nextPage) {
            store.commit('resetWantedPage')
            next(nextPage)
          }
          else next()
        }
        else next()
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
}