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
    path: '/chats',
    component: () =>
      import('pages/chats.vue')
  },
  {
    path: '/lift',
    component: () =>
      import('pages/lift.vue')
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
    path: '/willkommen',
    component: () =>
      import('pages/welcome.vue')
  },
  {
    path: '/profil',
    component: () =>
      import('pages/profile.vue')
  },
  {
    path: '/einstellungen',
    component: () =>
      import('pages/settings.vue')
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

export default routes