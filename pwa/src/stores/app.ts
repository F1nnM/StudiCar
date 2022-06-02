import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', {
  state: () => {
    return {
      dataSaver: false,
      greeting: (() => {
        const h = new Date().getHours();
        if (h < 9) return 'Guten Morgen';
        else if (h >= 18) return 'Guten Abend';
        else return 'Willkommen';
      })(),
      pageTrans: 'slide',
      pageName: 'Wilkommen',
      onlyInNav: false,
      navTitle: '',
      testValue: 10,
      legal: {},
      supportData: null,
      info: null,
      scroll: 0,
      nextPage: '',
      oldVersionRunning: false,
      settings: {
        askAgainWhenAppreciatingNewPassenger: true,
        enablePostillonNewsFeed: true,
      },
      prefsDocu: {
        talk: {
          red: 'Ich hab während der Fahrt gern meine Ruhe',
          yellow:
            'Wenn ich gerade dazu in der Stimmung bin, unterhalte ich mich nebenher gern ein bisschen',
          green: 'Unterhaltung mit meinen Mitfahrern ist mir sehr wichtig',
        },
        talkMorning: {
          red: 'Am Morgen will ich am liebsten meine Ruhe haben',
          yellow: 'Das kommt auf meine Laune an',
          green: 'Ich unterhalte mich auch in der Früh gern mit den anderen',
        },
        smoking: {
          red: 'Ich kann Rauchen im Auto überhaupt nicht ausstehen',
          yellow:
            'Ich bin eigentlich gegen Rauchen im Auto, könnte mich aber zur Not damit abfinden',
          green: 'Ich hab nichts gegen Rauchen im Auto',
        },
        music: {
          red: 'Ich hör beim Autofahren nur ungern Musik',
          yellow: 'Kommt auf die Musik an',
          green: 'Ich hör im Auto sehr gern Musik und bin auch offen für Neues',
        },
      },
      emojis: [
        [
          '😄',
          '😁',
          '😆',
          '😅',
          '🙂',
          '😊',
          '😇',
          '🙃',
          '😌',
          '😘',
          '😜',
          '🤓',
          '😎',
          '🤔',
          '😶',
          '😬',
        ], // arrays represent nameless categories
        ['👏🏼', '👍🏼', '👊🏼', '✌🏼', '👌🏼', '👋🏼', '☝', '👀'],
        ['❤', '🌍', '🔝', '❗', '🏁', '🌱', '🍀'],
      ],
      recentMessages: [
        {
          icon: 'thumb_up_alt',
          text: 'Ok, bis dann',
        },
        {
          icon: 'done',
          text: 'Geht klar',
        },
        {
          icon: 'update',
          text: 'Ich komm bisschen später',
        },
      ],
    };
  },

  getters: {
    getLegalViews(): string[] {
      return Object.keys(this.legal);
    },
  },

  actions: {
    setPage({
      name = '',
      onlyInNav = false,
      navTitle = '',
      transition = 'slide',
    }) {
      this.pageName = name;
      this.pageTrans = transition;
      this.onlyInNav = onlyInNav;
      this.navTitle = navTitle;
    },

    setSupportData(data: any) {
      this.supportData = data;
    },

    addToLegal(legal: object) {
      this.legal = {
        ...this.legal,
        ...legal,
      };
    },

    setInfo(info: any) {
      this.info = info;
    },

    setOldVersionRunning(running: boolean) {
      this.oldVersionRunning = running;
    },

    setAskAgainWhenAppreciatingNewPassenger(askAgain: boolean) {
      this.settings.askAgainWhenAppreciatingNewPassenger = askAgain;
    },

    setEnablePostillonNewsFeed(show: boolean) {
      this.settings.enablePostillonNewsFeed = show;
    },

    setWantedPage(payload: any) {
      this.nextPage = payload;
    },

    resetWantedPage() {
      this.nextPage = '';
    },

    setDataSaver(value: boolean) {
      this.dataSaver = value;
    },
  },
});
