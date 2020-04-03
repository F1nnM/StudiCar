const routes = [{
  path: '/',
  component: () =>
    import('layouts/MainLayout.vue'),
  children: [{
    path: '',
    component: () =>
      import('pages/marketplace.vue')
  },
  {
    path: '/anmeldung',
    component: () =>
      import('pages/signin.vue')
  },
  {
    path: '/registrierung',
    component: () =>
      import('pages/registration.vue')
  },
  {
    path: '/welcome',
    component: () =>
      import('pages/welcome.vue')
  }
  ]
}]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () =>
      import('pages/Error404.vue')
  })
}