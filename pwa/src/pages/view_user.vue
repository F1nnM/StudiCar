<template>
  <div>
    <q-slide-animation>
      <div v-show="!loaded">
        <q-splitter v-model="splitter" style="height: 60vh;">
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
    </q-slide-animation>

    <q-slide-animation>
      <div v-show="loaded">
        <q-splitter v-model="splitter">
          <template v-slot:before>
            <div class="q-px-md q-py-sm">
              <q-card>
                <q-img spinner-color="primary" :src="viewedUser.imageUrl" class="other-user-image">
                  <template v-slot:loading class="text-center relative">
                    <div class="absolute-center">Bild wird geladen...</div>
                  </template>
                  <template v-slot:error>
                    <div
                      class="absolute-full flex flex-center text-white"
                    >Bild kann leider nicht geladen werden. Bitte überprüfe deine Internetverbindung.</div>
                  </template>
                </q-img>
              </q-card>
            </div>
            <div class="q-mx-md q-mb-xs">
              <q-card>
                <q-card-section>
                  <p class="text-uppercase text-caption q-mt-none q-mb-xs">
                    Präferenzen im Auto
                    <q-btn clickable @click="prefInfo = !prefInfo" flat icon="info" />
                  </p>
                  <q-dialog v-model="prefInfo" position="right">
                    <q-card style="width: 80vw;" class="q-pa-xs">
                      <q-splitter v-model="splitterModel">
                        <template v-slot:before>
                          <q-tabs
                            v-model="prefInfoTab"
                            vertical
                            class="text-primary"
                            style="min-height: 50vh;"
                          >
                            <q-tab name="talkativeness" icon="record_voice_over" />
                            <q-tab name="talkAtMorning" icon="alarm" />
                            <q-tab name="smoking" icon="smoking_rooms" />
                            <q-tab name="music" icon="music_note" />
                          </q-tabs>
                        </template>
                        <template v-slot:after>
                          <q-tab-panels
                            v-model="prefInfoTab"
                            swipeable
                            animated
                            vertical
                            transition-prev="jump-down"
                            transition-next="jump-up"
                          >
                            <q-tab-panel name="talkativeness">
                              <div class="text-h6 q-mb-md">Redseligkeit</div>
                              <div class="row">
                                <div class="col-1">
                                  <span class="text-red">●</span>
                                </div>
                                <div class="col-11 q-pb-sm">{{prefsDocu.talk.red}}</div>
                                <div class="col-1">
                                  <span class="text-orange">●</span>
                                </div>
                                <div class="col-11 q-pb-sm">{{prefsDocu.talk.yellow}}</div>
                                <div class="col-1">
                                  <span class="text-green">●</span>
                                </div>
                                <div class="col-11">{{prefsDocu.talk.green}}</div>
                              </div>
                            </q-tab-panel>

                            <q-tab-panel name="talkAtMorning">
                              <div class="text-h6 q-mb-md">...am Morgen</div>
                              <div class="row">
                                <div class="col-1">
                                  <span class="text-red">●</span>
                                </div>
                                <div class="col-11 q-pb-sm">{{prefsDocu.talkMorning.red}}</div>
                                <div class="col-1">
                                  <span class="text-orange">●</span>
                                </div>
                                <div class="col-11 q-pb-sm">{{prefsDocu.talkMorning.yellow}}</div>
                                <div class="col-1">
                                  <span class="text-green">●</span>
                                </div>
                                <div class="col-11">{{prefsDocu.talkMorning.green}}</div>
                              </div>
                            </q-tab-panel>

                            <q-tab-panel name="smoking">
                              <div class="text-h6 q-mb-md">Rauchen im Auto</div>
                              <div class="row">
                                <div class="col-1">
                                  <span class="text-red">●</span>
                                </div>
                                <div class="col-11 q-pb-sm">{{prefsDocu.smoking.red}}</div>
                                <div class="col-1">
                                  <span class="text-orange">●</span>
                                </div>
                                <div class="col-11 q-pb-sm">{{prefsDocu.smoking.yellow}}</div>
                                <div class="col-1">
                                  <span class="text-green">●</span>
                                </div>
                                <div class="col-11">{{prefsDocu.smoking.green}}</div>
                              </div>
                            </q-tab-panel>

                            <q-tab-panel name="music">
                              <div class="text-h6 q-mb-md">Musik im Auto</div>
                              <div class="row">
                                <div class="col-1">
                                  <span class="text-red">●</span>
                                </div>
                                <div class="col-11 q-pb-sm">{{prefsDocu.music.red}}</div>
                                <div class="col-1">
                                  <span class="text-orange">●</span>
                                </div>
                                <div class="col-11 q-pb-sm">{{prefsDocu.music.yellow}}</div>
                                <div class="col-1">
                                  <span class="text-green">●</span>
                                </div>
                                <div class="col-11">{{prefsDocu.music.green}}</div>
                              </div>
                            </q-tab-panel>
                          </q-tab-panels>
                        </template>
                      </q-splitter>
                    </q-card>
                  </q-dialog>

                  <div class="row full-width">
                    <div class="col-10" v-show="!prefInfo">
                      <div v-for="item in viewedUser.preferences" :key="item.name">{{item.name}}</div>
                    </div>
                    <div class="col-2">
                      <div
                        v-for="item in viewedUser.preferences"
                        :key="item.name"
                        :class="'text-' + (item.value == 'YELLOW' ? 'ORANGE' : item.value).toLowerCase()"
                      >●</div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </template>
          <template v-slot:after>
            <q-list class="shadow-2 rounded-borders" style="width: 100%;">
              <br />
              <br />
              <q-item>
                <q-item-section>
                  <p
                    class="text-h5 overflow q-pt-xs custom-underline c-u-2 c-u-md c-u-l"
                  >{{viewedUser.name}}</p>
                </q-item-section>
              </q-item>

              <q-item-label header class="q-pt-xs text-uppercase">Fahrten</q-item-label>
              <q-item>angeboten: {{viewedUser.lifts.offered}}</q-item>
              <q-item>gesamt: {{viewedUser.lifts.all}}</q-item>
              <!-- <q-item>durchschnittlich: {{viewedUser.lifts.average}}/W</q-item> -->

              <q-item-label header class="q-pt-xs text-uppercase">Dabei seit</q-item-label>
              <q-item>{{viewedUser.createdAt}}</q-item>
            </q-list>
          </template>
        </q-splitter>

        <q-separator />
        <div class="full-width q-pa-md">
          <p>ÜBER MICH</p>
          <div class="padding">
            <div v-if="viewedUser.bio">{{viewedUser.bio}}</div>
            <div v-else class="text-weight-light">Noch keine Beschreibung hinterlegt</div>
          </div>
        </div>
      </div>
    </q-slide-animation>
  </div>
</template>

<script>

import { date } from 'quasar'
import { sendApiRequest, SQL_GET_USER_DATA, GET_USER_PROFILE_PIC, buildGetRequestUrl } from "../ApiAccess";
export default {

  data(){
    
    return{
      prefInfo: false,
      loaded: false,
      prefInfoTab: 'talkativeness',
      splitterModel: 20,
      splitter: 50,
      viewedUser: {
          name: 'Johannes',
          createdAt: date.formatDate(Date.now(), 'MMMM YYYY'),
          imageUrl: '~assets/loremimage.jpg',
          bio: 'Bin der Johannes und freu mich auf die Fahrt. Dieser Text ist absichtlich lang gehalten, um die Darstellung von so extrem langen Texten zu sehen.',
          lifts: {
              offered: 7,
              all: 19,
              average: 5
          },
          preferences: [{
              name: 'Redseligkeit', value: 'GREEN'
          },
          {
              name: ' ...am Morgen', value: 'YELLOW'
          },
          {
              name: 'Rauchen', value: 'RED'
          },
          {
              name: 'Musik', value: 'YELLOW'
          }]
      }
    }
  },

  computed: {
      prefsDocu(){
        return this.$store.state.prefsDocu
      }
  },

  mounted(){

    let loc = document.location.href
    let otherFbId = loc.split('?')[1]

    let imageUrl
    buildGetRequestUrl(
      GET_USER_PROFILE_PIC,
      { fbid: otherFbId },
      url => {
        imageUrl = url
      }
    )
    

    sendApiRequest(SQL_GET_USER_DATA,
    {
      fbid: otherFbId,
      secretFbId: 'lorem' // I hope nobody will ever have this secretFbId, cause then our server is gonna crash
    },
    data => {
      this.viewedUser = {
        name: data.name.split(' ')[0],
        createdAt: date.formatDate(data.stats.createdAt, 'MMMM YYYY'),
        bio: data.description,
        lifts: {
            offered: data.stats.liftsOffered,
            all: data.stats.driverCount,
            average: 5
        },
        imageUrl: imageUrl,
        preferences: [{
            name: 'Redseligkeit', value: data.prefs.talk
        },
        {
            name: ' ...am Morgen', value: data.prefs.talkMorning
        },
        {
            name: 'Rauchen', value: data.prefs.smoking
        },
        {
            name: 'Musik', value: data.prefs.music
        }]
      }
      this.loaded = true
    },
    error => {throw error})

    

    this.$store.commit('setPage', '')
    }
}
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