import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'

import { dom } from 'quasar'
import { date } from 'quasar'
const { ready } = dom

Vue.use(VueRouter)

Vue.prototype.pageTrans = 'slide'

Vue.prototype.chatOpen = false

Vue.prototype.global = {
  systemInfo: {
    greeting: ((new Date).getHours() < 8 ? 'Guten Morgen' : ((new Date).getHours() > 18 ? 'Guten Abend' : 'Willkommen')),
    usersOnline: 21,
    usersAll: 226,
    about: {
      general: 'https://mi.com',
      privacy: 'lökbj',
      lawful: buildInfo('lawful')
    }
  },
  user: {
    name: 'Johannes',
    createdAt: new Date(2020, 2).getTime(),
    liftsAll: 17,
    avgLifts: 5,
    settings: {
      liftMaxDistance: 10
    },
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

Vue.prototype.user = {
  name: 'Johannes',

}

Vue.prototype.preferences = {
  talkativeness: {
    red: 'Ich hab während der Fahrt gern meine Ruhe',
    yellow: 'Wenn ich gerade dazu in der Stimmung bin, unterhalte ich mich nebenher gern ein bisschen',
    green: 'Unterhaltung mit meinen Mitfahrern ist mir sehr wichtig'
  },
  talkAtMorning: {
    red: 'Am Morgen will ich am liebsten meine Ruhe haben',
    yellow: 'Das kommt auf meine Laune an',
    green: 'Ich unterhalte mich auch in der Früh gern mit den anderen'
  },
  smoking: {
    red: 'Ich kann Rauchen im Auto überhaupt nicht ausstehen',
    yellow: 'Ich bin eigentlich gegen Rauchen im Auto, könnte mich aber zur Not damit abfinden',
    green: 'Ich hab nichts gegen Rauchen im Auto'
  },
  music: {
    red: 'Ich hör beim Autofahren nur ungern Musik',
    yellow: 'Kommt auf die Musik an',
    green: 'Ich hör im Auto sehr gern Musik und bin auch offen für Neues'
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

function buildInfo (type) {
  switch (type) {
    case 'general': return 'Zur Nutzung deines Accounts musst du einen Benutzernamen und ein Passwort vergeben. Wie das gespeichert und verarbeitet wird, kannst du gleich beim Datenschutz lesen. Der Benutzername ist ein Schlüssel im System.Solltest du ihn nicht mehr wissen, kannst du nicht mehr auf deinen Account zugreifen.Merke ihn dir daher gut oder schreib ihn dir am besten irgendwo auf. Dein Passwort benötigst du, um dich in der App anzumelden.Solltest du es vergessen haben, kannst du in den Einstellungen dein Passwort zurücksetzen lassen, allerdings senden wir dir dein neues, automatisch generiertes Passwort per Mail zu, du musst deine Mailadresse also im Voraus in der App eingegeben haben. Sollte dies nicht der Fall sein, wirst du dir leider einen neuen Account erstellen müssen.'
      break
    case 'privacy': return 'Hier steht dann das Zeug vom Datenschutz'
      break
    case 'lawful': return 'Hier steht dann das ganze rechtliche Zeug'
      break
  }

}