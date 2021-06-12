const routes = [
  {
    path: "/",
    meta: { requiresAuth: true },
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "marketplace",
        component: () => import("pages/marketplace.vue")
      },
      {
        path: "/chats",
        component: () => import("pages/chats.vue")
      },
      {
        path: "/add-lift",
        component: () => import("pages/add_lift.vue")
      },
      {
        path: "/profil",
        component: () => import("pages/profile.vue")
      },
      {
        path: "/einstellungen",
        component: () => import("pages/settings.vue")
      },
      {
        path: "/benutzerinfo",
        component: () => import("pages/view_user.vue")
      },
      {
        path: "/das-team",
        component: () => import("pages/team.vue")
      },
      {
        path: "/friends",
        component: () => import("pages/friends.vue")
      }
    ]
  },
  {
    path: "/",
    meta: { requiresAuth: false }, // these pages has to be accessible even when user isn't signed in yet
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/rechtliches",
        component: () => import("pages/legal.vue")
      },
      {
        path: "/hilfe",
        component: () => import("pages/support.vue")
      },
      {
        path: "/contact",
        component: () => import("pages/contact.vue")
      },
      {
        path: "/hilfe/bearbeiten",
        component: () => import("pages/edit_faq.vue")
      }
    ]
  },
  {
    path: "/spielwiese",
    component: () => import("layouts/custom_layout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/playfield.vue")
      },
      {
        path: "/spielplatz",
        component: () => import("pages/playground.vue")
      },
      {
        path: "/spielhölle",
        component: () => import("pages/casino.vue")
      }
    ]
  },
  {
    path: "/auth",
    component: () => import("layouts/without_nav.vue"),
    children: [
      {
        path: "/auth/anmeldung",
        name: "signIn",
        component: () => import("pages/signin.vue")
      },
      {
        path: "/auth/registrierung",
        component: () => import("pages/registration.vue")
      }
    ]
  }
];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push({
    path: "*",
    component: () => import("pages/Error404.vue")
  });
}

export default routes;
