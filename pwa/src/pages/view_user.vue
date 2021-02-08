<template>
  <div>
    <div v-if="!viewedUser">
      <!-- <q-splitter v-model="splitterPos.current" style="height: 60vh;">
        <template v-slot:before>
          <q-skeleton square type="QAvatar" class="other-user-image" width="100%" height="50%" />

          <q-skeleton class="q-mb-md" v-for="n in 5" :key="n" type="text" height="1.5em;" />
        </template>
        <template v-slot:after>
          <q-skeleton type="text" class="text-h4 q-mb-md" />
          <q-skeleton type="text" width="50%" class="text-h3 q-mb-md" />
          <q-skeleton type="text" width="50%" class="text-h3 q-mb-md" />
          <q-skeleton type="text" class="text-h4 q-mb-md" />
          <q-skeleton type="text" width="50%" class="text-h3 q-mb-md" />
        </template>
      </q-splitter>
      <q-skeleton type="text" width="30%" class="text-h4" />
      <q-skeleton type="text" width="70%" height="2em" class="text-h3" />-->
      <div style="height: 40vh" class="text-center column justify-center">
        <p>
          <q-circular-progress
            show-value
            :indeterminate="!notFound"
            size="15vw"
            :thickness="0.05"
            :value="100"
            :color="notFound ? 'negative' : 'primary'"
            class="q-ma-md full-width"
          >
            <q-icon :name="notFound ? 'error' : 'person_outline'" color="dark" size="md" />
          </q-circular-progress>
          <span v-if="!notFound" class="text-subtitle1">Profil wird geladen</span>
          <span v-else class="text-subtitle1">Nutzer nicht gefunden</span>
        </p>
      </div>
    </div>
    <div v-else>
      <q-splitter v-model="splitterPos.current" disable>
        <template v-slot:before class="relative-position">
          <!-- <q-btn
            class="absolute-position absolute-left absolute-top z-top "
            icon="keyboard_arrow_left"
            size="lg"
            dense
            flat
          />-->
          <div class="q-px-md q-py-sm">
            <q-card>
              <q-img
                clickable
                v-touch-hold:600.mouse="makeImageBig"
                @click="splitterPos.current = splitterPos.normal"
                spinner-color="primary"
                :src="imageUrl"
                class="other-user-image"
              >
                <template v-slot:loading class="text-center relative">
                  <div class="absolute-center">Bild wird geladen...</div>
                </template>
                <template v-slot:error>
                  <div
                    class="absolute-full flex flex-center text-caption"
                  >Bild konnte nicht geladen werden</div>
                </template>
              </q-img>
            </q-card>
          </div>
        </template>
        <template v-slot:after v-if="splitterPos.current <= 70">
          <q-slide-transition>
            <q-list class="rounded-borders" style="width: 100%;">
              <q-item class="q-my-md">
                <q-item-section>
                  <span
                    class="text-h5 overflow q-pt-xs custom-underline c-u-3 c-u-md c-u-l"
                  >{{ viewedUser.name.split(' ')[0] }}</span>
                </q-item-section>
                <q-item-section avatar class="q-mr-md">
                  <q-btn icon="close" dense flat @click="$router.go(-1)">
                    <q-tooltip
                      anchor="top middle"
                      :content-class="`bg-white text-dark`"
                      content-style="border: 1px solid darkgrey"
                      self="bottom middle"
                      :offset="[10, 10]"
                    >zur vorherigen Seite</q-tooltip>
                  </q-btn>
                </q-item-section>
              </q-item>
              <q-item-label header class="q-pt-xs q-pb-xs">
                <span class="text-uppercase text-caption">Dabei seit</span>
              </q-item-label>
              <q-item>{{ since }}</q-item>
              <!-- <q-item dense clickable @click="toggleFriend">
                <q-item-section avatar>
                  <q-icon
                    :name="friendIcon"
                    size="sm"
                    :class="friended.in && !friended.out ? 'mirror-horiz' : ''"
                    :color="!(friended.in || friended.out) ? 'grey-7' : 'dark'"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Platzhalter</q-item-label>
                  <q-item-label caption>Hilfetext</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn icon="info_outline" @click="showFriendGuide = true" flat dense />
                </q-item-section>
              </q-item>-->
            </q-list>
          </q-slide-transition>
        </template>
      </q-splitter>

      <q-tabs
        v-model="viewTab"
        dense
        align="justify"
        indicator-color="primary"
        class="bg-white text-grey-7"
        :breakpoint="0"
      >
        <q-tab name="data" icon="info_outline" />
        <q-tab name="social" icon="people_outline" />
      </q-tabs>
      <q-tab-panels
        v-model="viewTab"
        animated
        swipeable
        transition-next="slide-left"
        transition-prev="slide-right"
        class="q-pa-none"
      >
        <q-tab-panel name="data" class="q-pa-none">
          <q-card class="q-ma-xs q-mt-md shadow-2">
            <div class="row">
              <div class="col-6">
                <div class="q-mb-xs">
                  <q-item-label header caption class="q-pt-xs q-pb-xs text-uppercase">
                    Präferenzen
                    <!-- <q-btn
                  dense
                  flat
                  color="grey-7"
                  size="sm"
                  @click="prefInfo = !prefInfo"
                  icon="info"
                    />-->
                  </q-item-label>
                  <q-item-label caption class="q-pl-md q-pt-xs q-pb-md">Tippe lang für Info</q-item-label>
                  <div class="text-center q-mt-sm q-px-md row justify-around">
                    <q-btn
                      v-for="(pref) in [{
val: 'talk', icon: 'record_voice_over'
                    },
                    {
val: 'talkMorning', icon: 'alarm'
                    },
                    {
val: 'smoking', icon: 'smoking_rooms'
                    },
                    {
val: 'music', icon: 'music_note'
                    }]"
                      :key="pref.val"
                      outline
                      dense
                      class="q-pa-xs col-5 q-mb-lg"
                      :icon="pref.icon"
                      :color="betterPrefColor(pref.val)"
                      size="sm"
                    >
                      <!-- <q-badge transparent color="white">
                    <q-icon name="help_outline" color="dark" size="xs" />
                      </q-badge>-->
                      <q-tooltip
                        anchor="top middle"
                        :content-class="`bg-white text-dark`"
                        :content-style="'border-bottom: 1px solid ' + betterPrefColor(pref.val)"
                        self="bottom middle"
                        :offset="[10, 10]"
                      >{{ prefsDocu[pref.val][viewedUser.prefs[pref.val].toLowerCase()]}}</q-tooltip>
                    </q-btn>
                  </div>
                </div>
              </div>
              <div class="col-6">
                <q-list>
                  <q-item-label
                    header
                    class="q-pt-sm q-pb-md text-uppercase text-caption"
                  >Fahrtenstatistik</q-item-label>
                  <q-item-label>Früher</q-item-label>
                  <q-expansion-item class="q-pa-none">
                    <template v-slot:header>
                      <q-item class="q-pa-none">
                        <q-item-section>
                          <q-avatar
                            color="white"
                            class="text-weight-light"
                            text-color="dark"
                          >{{ viewedUser.stats.liftsAll }}</q-avatar>
                        </q-item-section>
                        <q-item-section avatar>
                          <q-circular-progress
                            show-value
                            font-size="16px"
                            class="text-primary q-ma-sm"
                            :value="Math.round(viewedUser.stats.liftsOffered / viewedUser.stats.liftsAll * 100)"
                            size="xl"
                            :thickness="0.05"
                            color="primary"
                            track-color="grey-3"
                          >
                            <q-icon name="emoji_people" color="dark" />
                            {{ viewedUser.stats.liftsOffered }}
                          </q-circular-progress>
                        </q-item-section>
                      </q-item>
                    </template>
                    <q-card>
                      <q-card-section>
                        <p class="text-caption">Angebotsbilanz:</p>
                        <ColoredMeter
                          v-model="meterModelBefore"
                          width="30vw"
                          :minInput="0"
                          :maxInput="1"
                        >
                          <p
                            class="text-h6 text-weight-light q-pt-md"
                          >{{ viewedUser.stats.liftsOffered }} / {{ viewedUser.stats.liftsAll }}</p>
                        </ColoredMeter>
                        <br />
                        <q-separator />
                      </q-card-section>
                    </q-card>
                  </q-expansion-item>

                  <q-item-label>Aktuell</q-item-label>
                  <q-expansion-item class="q-pa-none">
                    <template v-slot:header>
                      <q-item class="q-pa-none">
                        <q-item-section>
                          <q-avatar
                            color="white"
                            class="text-weight-light"
                            text-color="dark"
                          >{{ viewedUser.stats.liftCount }}</q-avatar>
                        </q-item-section>
                        <q-item-section avatar>
                          <q-circular-progress
                            show-value
                            font-size="16px"
                            class="text-primary q-ma-sm"
                            :value="Math.round(viewedUser.stats.driverCount / viewedUser.stats.liftCount * 100)"
                            size="xl"
                            :thickness="0.05"
                            color="primary"
                            track-color="grey-3"
                          >
                            <q-icon name="emoji_people" color="dark" />
                            {{ viewedUser.stats.driverCount }}
                          </q-circular-progress>
                        </q-item-section>
                      </q-item>
                    </template>
                    <q-card>
                      <q-card-section>
                        <p class="text-caption">Angebotsbilanz:</p>
                        <ColoredMeter
                          v-model="meterModelCurrent"
                          width="30vw"
                          :minInput="0"
                          :maxInput="1"
                        >
                          <p
                            class="text-h6 text-weight-light q-pt-md"
                          >{{ viewedUser.stats.driverCount }} / {{ viewedUser.stats.liftCount }}</p>
                        </ColoredMeter>
                        <br />
                        <q-separator />
                      </q-card-section>
                    </q-card>
                  </q-expansion-item>
                </q-list>
              </div>
            </div>
          </q-card>
          <div class="full-width q-pa-md">
            <p class="text-uppercase text-caption">Kurzbeschreibung</p>
            <div class="padding">
              <div v-if="viewedUser.bio">{{ viewedUser.bio }}</div>
              <div v-else class="text-weight-light text-grey-7">Noch keine Beschreibung hinterlegt</div>
            </div>
          </div>
        </q-tab-panel>
        <q-tab-panel name="social">
          <p>Hier kommen dann die Freunde</p>
          <q-btn
            dense
            flat
            :icon="friendIcon"
            size="md"
            @click="toggleFriend"
            :class="!friended.in && friended.out ? 'mirror-horiz' : ''"
            :color="!(friended.in || friended.out) ? 'grey-7' : 'dark'"
          />
        </q-tab-panel>
      </q-tab-panels>
    </div>
    <q-dialog v-model="showFriendGuide">
      <q-card>
        <q-toolbar>
          <q-toolbar-title>Freundschaften</q-toolbar-title>
          <q-btn flat dense v-close-popup icon="close" />
        </q-toolbar>
        <q-card-section>
          Zustände des Freundschaftssystems in StudiCar:
          <q-list>
            <div
              v-for="s in [{
              icon: 'half',
              title: 'Angefragt',
              text: `Einer von euch beiden will eine Freundschaft eingehen. Die ausgefüllte Hälfte des Herzes zeigt an, wer. Das abgebildete Herz zeigt z.B. an, dass der andere Nutzer die von dir gestellte Anfrage noch nicht bestätigt hat.`
            }]"
              :key="s.icon"
            >
              <q-item-label header>{{ s.title }}</q-item-label>
              <q-item>
                <q-item-section avatar>
                  <q-icon :name="hearts[s.icon]" size="md" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ s.text }}</q-item-label>
                  <!-- <q-item-label caption>{{ s.text }}</q-item-label> -->
                </q-item-section>
              </q-item>
            </div>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { date, colors } from "quasar";
import ColoredMeter from "components/ColoredMeter";
import { ionMdHeartHalf, ionMdHeart } from "@quasar/extras/ionicons-v4";
import {
  sendApiRequest,
  SQL_GET_USER_DATA,
  GET_USER_PROFILE_PIC,
  buildGetRequestUrl
} from "../ApiAccess";
const { lighten } = colors;
export default {
  components: {
    ColoredMeter
  },
  data() {
    return {
      prefInfo: false,
      bigImage: false,
      splitterPos: {
        current: 0,
        normal: 46,
        big: 98
      },
      viewTab: "data",
      viewedUser: null,
      imageUrl: "",
      friended: {
        in: true,
        out: false
      },
      showFriendGuide: false,
      hearts: {
        half: ionMdHeartHalf,
        entire: ionMdHeart,
        border: "favorite_border"
      },
      notFound: false
    };
  },

  computed: {
    meterModelBefore() {
      var a = this.viewedUser.stats;
      return a.liftsOffered / a.liftsAll;
    },

    meterModelCurrent() {
      var a = this.viewedUser.stats;
      return a.driverCount / a.liftCount;
    },

    prefsDocu() {
      return this.$store.state.prefsDocu;
    },

    friendIcon() {
      const f = this.friended;
      if (f.in && f.out) return ionMdHeart;
      else if (f.in || f.out) return ionMdHeartHalf;
      else return "favorite_border";
    },

    since() {
      return date.formatDate(this.viewedUser.stats.createdAt, "MMMM YYYY", {
        months: [
          "Januar",
          "Februar",
          "März",
          "April",
          "Mai",
          "Juni",
          "Juli",
          "August",
          "September",
          "Oktober",
          "November",
          "Dezember"
        ]
      });
    },

    call() {
      var gender = this.viewedUser.gender;
      switch (gender) {
        case "M":
          return "";
          break;
        case "W":
          return "in";
          break;
        default:
          return "/in";
          break;
      }
    }
  },

  watch: {},

  methods: {
    betterPrefColor(prefName) {
      var color = this.viewedUser.prefs[prefName].toLowerCase();
      if (color == "yellow") return "orange";
      else return color;
    },

    lightenColor(color) {
      var a = lighten(color, 80);
      return a;
    },

    makeImageBig(e) {
      if (e.position.top < 100) this.splitterPos.current = this.splitterPos.big;
    },

    toggleFriend() {
      if (this.friended.out) {
        this.$q
          .dialog({
            title: "Freundschaft beenden",
            message: `Willst du die Freundschaft mit ${
              this.viewedUser.name.split(" ")[0]
            } wirklich beenden?`,
            cancel: true,
            persistent: true
          })
          .onOk(() => {
            this.friended.out = false;
          });
      } else {
        // request code
        this.friended.out = true;
      }
    }
  },

  mounted() {
    let loc = document.location.href;
    let otherFbId = loc.split("?userFbId=")[1];

    buildGetRequestUrl(GET_USER_PROFILE_PIC, { fbid: otherFbId }, url => {
      this.imageUrl = url;
      this.splitterPos.current = this.splitterPos.normal;
    });

    sendApiRequest(
      SQL_GET_USER_DATA,
      {
        fbid: otherFbId,
        secretFbId: "/°" // I hope nobody will ever have this secretFbId, cause then our server is gonna crash
      },
      userData => {
        if (userData.status == 204) this.notFound = true;
        // profile not found
        else this.viewedUser = userData; // actually wanted to store both imageUrl and userData in one object,
        // but had troubles with v-if
      },
      error => {
        throw error;
      }
    );

    this.$store.commit("setPage", "");
  }
};
</script>

<style scoped lang="scss">
.mirror-horiz {
  transform: rotateY(180deg);
}

.other-user-image {
  // the octagon
  -webkit-clip-path: polygon(
    10% 0%,
    90% 0%,
    100% 10%,
    100% 90%,
    90% 100%,
    10% 100%,
    0% 90%,
    0% 10%
  );
  clip-path: polygon(
    10% 0%,
    90% 0%,
    100% 10%,
    100% 90%,
    90% 100%,
    10% 100%,
    0% 90%,
    0% 10%
  );
}
</style>