import Firebase from 'firebase/app'
import 'firebase/auth'

export default ({ app, router, Vue, store }) => {
  router.beforeEach(async (to, from, next) => {
    // Check to see if the route has the meta field "authRequired" set to true
    let authRequired = to.matched.some(route => route.meta.requiresAuth)

    const byPass = true

    if (!process.env.DEV) byPass = false // bypass can only be used in development
    let isAuthenticated = await Firebase.auth().currentUser !== null

    if (authRequired && !byPass) {
      if (isAuthenticated) {
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
}