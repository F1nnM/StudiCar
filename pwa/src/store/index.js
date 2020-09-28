import Vue from 'vue'
import Vuex from 'vuex'

import auth from './auth'

Vue.use(Vuex)

function getGreeting () {
  var h = new Date().getHours()
  if (h < 9) return 'Guten Morgen'
  else if (h >= 18) return 'Guten Abend'
  else return 'Willkommen'
}

const store = new Vuex.Store({
  modules: {
    auth
  },
  computed: {


    buildInfo (type) {
      switch (type) {
        case 'general': return 'Zur Nutzung deines Accounts musst du einen Benutzernamen und ein Passwort vergeben. Wie das gespeichert und verarbeitet wird, kannst du gleich beim Datenschutz lesen. Der Benutzername ist ein Schlüssel im System.Solltest du ihn nicht mehr wissen, kannst du nicht mehr auf deinen Account zugreifen.Merke ihn dir daher gut oder schreib ihn dir am besten irgendwo auf. Dein Passwort benötigst du, um dich in der App anzumelden.Solltest du es vergessen haben, kannst du in den Einstellungen dein Passwort zurücksetzen lassen, allerdings senden wir dir dein neues, automatisch generiertes Passwort per Mail zu, du musst deine Mailadresse also im Voraus in der App eingegeben haben. Sollte dies nicht der Fall sein, wirst du dir leider einen neuen Account erstellen müssen.'
        case 'privacy': return 'Hier steht dann das Zeug vom Datenschutz'
        case 'lawful': return 'Hier steht dann das ganze rechtliche Zeug'
      }
    }
  },
  mutations: {
    setPageTrans (state, _trans) {
      state.pageTrans = _trans
    },

    setPage (state, _pageName) {
      state.pageName = _pageName
    }
  },
  actions: {
    dataSaver ({ commit }, payload) {

    }
  },
  strict: process.env.DEV,
  state: {
    dataSaver: false,
    greeting: getGreeting(),
    pageTrans: 'slide',
    transer: 'slide',
    pageName: 'Willkommen', // needed for scroll-relative Header
    testValue: 10,
    scroll: 0,
    message: 'Hello',
    systemInfo: {
      usersAll: 226,
      about: {}
    },
    prefsDocu: { // legend for preferences, needed for info at registration profiles
      talk: {
        red: 'Ich hab während der Fahrt gern meine Ruhe',
        yellow: 'Wenn ich gerade dazu in der Stimmung bin, unterhalte ich mich nebenher gern ein bisschen',
        green: 'Unterhaltung mit meinen Mitfahrern ist mir sehr wichtig'
      },
      talkMorning: {
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
  }
})

export default store