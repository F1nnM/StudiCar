<template>
  <div>
    <div v-if="!viewedUser">
      <q-splitter v-model="splitterPos.current" style="height: 60vh;">
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
      <q-skeleton type="text" width="70%" height="2em" class="text-h3" />
    </div>
    <div v-else>
      <q-splitter v-model="splitterPos.current" disable>
        <template v-slot:before>
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
            <q-list class="shadow-2 rounded-borders" style="width: 100%;">
              <br />
              <q-item>
                <q-item-section>
                  <p class="text-h5 overflow q-pt-xs custom-underline c-u-4 c-u-md c-u-l">
                    {{ viewedUser.name.split(' ')[0] }}
                    <!-- <q-btn
                      dense
                      size="md"
                      
                      flat
                      no-ripple
                      :icon="friended ? 'favorite' : 'favorite_border'"
                      color="primary"
                    />-->
                  </p>
                </q-item-section>
              </q-item>
              <q-item-label header class="q-pt-xs q-pb-xs text-uppercase text-caption">Dabei seit</q-item-label>
              <q-item>{{ since }}</q-item>
              <q-btn @click="friended = !friended" dense flat size="md" color="dark" no-caps>
                <q-icon
                  size="sm"
                  dense
                  no-ripple
                  :color="friended ? 'red' : 'grey-7'"
                  :name="friended ? 'favorite' : 'favorite_border'"
                />
                <span class="q-ml-xs">Als Freund{{ call }} markier{{ friended ? 't' : 'en' }}</span>
              </q-btn>
            </q-list>
          </q-slide-transition>
        </template>
      </q-splitter>
      <br />
      <q-card class="q-pa-xs">
        <div class="row">
          <div class="col-6">
            <div class="q-mb-xs">
              <q-item-label header class="q-pt-xs q-pb-md text-uppercase text-caption">
                Präferenzen
                <q-btn
                  dense
                  flat
                  color="grey-7"
                  size="sm"
                  @click="prefInfo = !prefInfo"
                  icon="info"
                />
              </q-item-label>
              <div class="row justify-evenly">
                <div
                  class="text-center col-6 q-mb-sm"
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
                >
                  <q-icon :name="pref.icon" :color="betterPrefColor(pref.val)" size="sm" />
                </div>
              </div>

              <div
                class="row full-width q-pb-xs q-pl-md"
                v-for="pref in [{
              name: 'talk',
              label: 'Redseligkeit',
              icon: 'record_voice_over'
            },
            {
              name: 'talkMorning',
              label: '... am Morgen',
              icon: 'alarm'
            },
            {
              name: 'smoking',
              label: 'Rauchen',
              icon: 'smoking_rooms'
            },
            {
              name: 'music',
              label: 'Musik',
               icon: 'music_note'
            }]"
                :key="pref.name"
              >
                <div class="col-9">{{ pref.label }}</div>
                <div :class="'col-3 text-left text-' + betterPrefColor(pref.name)">●</div>
                <q-slide-transition>
                  <small class="col-12 text-caption text-grey-7" v-if="prefInfo">
                    <!-- <q-icon :name="pref.icon" :color="betterPrefColor(pref.name)" size="sm" /> -->
                    {{ prefsDocu[pref.name][betterPrefColor(pref.name)] }}
                    <br />
                  </small>
                </q-slide-transition>
              </div>
            </div>
          </div>
          <div class="col-6">
            <q-list>
              <q-item-label
                header
                class="q-pt-sm q-pb-md text-uppercase text-caption"
              >Fahrtenstatistik</q-item-label>
              <q-item-label>Historie</q-item-label>
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
    </div>
  </div>
</template>

<script>
import { date } from "quasar";
import ColoredMeter from "components/ColoredMeter";
import {
  sendApiRequest,
  SQL_GET_USER_DATA,
  GET_USER_PROFILE_PIC,
  buildGetRequestUrl,
} from "../ApiAccess";
export default {
  components: {
    ColoredMeter,
  },
  data() {
    return {
      prefInfo: false,
      bigImage: false,
      splitterPos: {
        current: 0,
        normal: 46,
        big: 98,
      },
      viewedUser: {},
      imageUrl: "",
      friended: false,
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
          "Dezember",
        ],
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
    },
  },

  watch: {},

  methods: {
    betterPrefColor(prefName) {
      var color = this.viewedUser.prefs[prefName].toLowerCase();
      if (color == "yellow") return "orange";
      else return color;
    },

    makeImageBig(e) {
      if (e.position.top < 100) this.splitterPos.current = this.splitterPos.big;
    },
  },

  mounted() {
    let loc = document.location.href;
    let otherFbId = loc.split("?slId=")[1];

    buildGetRequestUrl(GET_USER_PROFILE_PIC, { fbid: otherFbId }, (url) => {
      this.imageUrl = url;
      this.splitterPos.current = this.splitterPos.normal;
    });

    sendApiRequest(
      SQL_GET_USER_DATA,
      {
        fbid: otherFbId,
        secretFbId: "/°", // I hope nobody will ever have this secretFbId, cause then our server is gonna crash
      },
      (userData) => {
        this.viewedUser = userData; // actually wanted to store both imageUrl and userData in one object,
        // but had troubles with v-if
      },
      (error) => {
        throw error;
      }
    );

    this.$store.commit("setPage", "");
  },
};
</script>

<style scoped lang="scss">
.other-user-image {
  // the octagon
  -webkit-clip-path: polygon(
    20% 0%,
    80% 0%,
    100% 20%,
    100% 80%,
    80% 100%,
    20% 100%,
    0% 80%,
    0% 20%
  );
  clip-path: polygon(
    20% 0%,
    80% 0%,
    100% 20%,
    100% 80%,
    80% 100%,
    20% 100%,
    0% 80%,
    0% 20%
  );
}
</style>