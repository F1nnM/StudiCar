import { uid } from 'quasar'

const routes = [{
  path: '/',
  component: () =>
    import('layouts/MainLayout.vue'),
  children: [{
    path: '',
    name: 'marketplace',
    component: () =>
      import('pages/marketplace.vue')
  },
  {
    path: '/chats',
    component: () =>
      import('pages/chats.vue')
  },
  {
    path: '/chats/lift',
    component: () =>
      import('pages/lift.vue')
  },
  {
    path: '/chats/lift/add',
    component: () =>
      import('pages/add_lift.vue')
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
  },
  {
    path: '/view-user',
    component: () =>
      import('pages/view_user.vue')
  },
  {
    path: '/scanner',
    component: () =>
      import('pages/scanner.vue')
  }
  ]
},
{
  path: '/spielwiese',
  component: () =>
    import('layouts/custom_layout.vue'),
  children: [{
    path: '',
    component: () =>
      import('pages/playground.vue')
  }]
},
{
  path: '/auth',
  component: () =>
    import('layouts/without_nav.vue'),
  children: [{
    path: '/auth/anmeldung',
    name: 'signIn',
    component: () =>
      import('pages/signin.vue')
  },
  {
    path: '/auth/registrierung',
    component: () =>
      import('pages/registration.vue')
  }]
}
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () =>
      import('pages/Error404.vue')
  })
}

export default routes
