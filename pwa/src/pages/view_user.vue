<template>
  <div>
    <q-splitter v-model="splitter">
      <template v-slot:before>
        <div class="q-px-md q-py-sm">
          <q-card>
            <q-img src="~assets/loremimage.jpg" class="other-user-image">
              <template v-slot:loading>
                <div class="text-subtitle1 text-white">Bild wird geladen...</div>
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
                            <div class="col-11 q-pb-sm">{{preferences.talkativeness.red}}</div>
                            <div class="col-1">
                              <span class="text-orange">●</span>
                            </div>
                            <div class="col-11 q-pb-sm">{{preferences.talkativeness.yellow}}</div>
                            <div class="col-1">
                              <span class="text-green">●</span>
                            </div>
                            <div class="col-11">{{preferences.talkativeness.green}}</div>
                          </div>
                        </q-tab-panel>

                        <q-tab-panel name="talkAtMorning">
                          <div class="text-h6 q-mb-md">...am Morgen</div>
                          <div class="row">
                            <div class="col-1">
                              <span class="text-red">●</span>
                            </div>
                            <div class="col-11 q-pb-sm">{{preferences.talkAtMorning.red}}</div>
                            <div class="col-1">
                              <span class="text-orange">●</span>
                            </div>
                            <div class="col-11 q-pb-sm">{{preferences.talkAtMorning.yellow}}</div>
                            <div class="col-1">
                              <span class="text-green">●</span>
                            </div>
                            <div class="col-11">{{preferences.talkAtMorning.green}}</div>
                          </div>
                        </q-tab-panel>

                        <q-tab-panel name="smoking">
                          <div class="text-h6 q-mb-md">Rauchen im Auto</div>
                          <div class="row">
                            <div class="col-1">
                              <span class="text-red">●</span>
                            </div>
                            <div class="col-11 q-pb-sm">{{preferences.smoking.red}}</div>
                            <div class="col-1">
                              <span class="text-orange">●</span>
                            </div>
                            <div class="col-11 q-pb-sm">{{preferences.smoking.yellow}}</div>
                            <div class="col-1">
                              <span class="text-green">●</span>
                            </div>
                            <div class="col-11">{{preferences.smoking.green}}</div>
                          </div>
                        </q-tab-panel>

                        <q-tab-panel name="music">
                          <div class="text-h6 q-mb-md">Musik im Auto</div>
                          <div class="row">
                            <div class="col-1">
                              <span class="text-red">●</span>
                            </div>
                            <div class="col-11 q-pb-sm">{{preferences.music.red}}</div>
                            <div class="col-1">
                              <span class="text-orange">●</span>
                            </div>
                            <div class="col-11 q-pb-sm">{{preferences.music.yellow}}</div>
                            <div class="col-1">
                              <span class="text-green">●</span>
                            </div>
                            <div class="col-11">{{preferences.music.green}}</div>
                          </div>
                        </q-tab-panel>
                      </q-tab-panels>
                    </template>
                  </q-splitter>
                </q-card>
              </q-dialog>
              <div v-for="item in viewedUser.preferences" :key="item.name" class="full-width">
                <span class="inline-block" style="width: 90%;">{{item.name}}</span>
                <span
                  :style="'color: ' + (item.value == 3 ? 'green' : item.value == 2 ? 'orange' : 'red')"
                >●</span>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </template>
      <template v-slot:after>
        <q-list class="shadow-2 rounded-borders" style="width: 100%;">
          <q-item>
            <q-item-section>
              <p
                class="text-h4 overflow q-pt-xs custom-underline c-u-2 c-u-md c-u-l"
              >{{viewedUser.name}}</p>
            </q-item-section>
          </q-item>

          <q-item-label header class="q-pt-xs">Fahrten</q-item-label>
          <q-item>angeboten: {{viewedUser.lifts.offered}}</q-item>
          <q-item>gesamt: {{viewedUser.lifts.all}}</q-item>
          <q-item>durchschnittlich: {{viewedUser.lifts.average}}/W</q-item>

          <q-item-label header class="q-pt-xs">Dabei seit</q-item-label>
          <q-item>{{viewedUser.createdAt}}</q-item>
        </q-list>
      </template>
    </q-splitter>

    <q-separator />
    <div class="full-width q-pa-md">
      <p>ÜBER MICH</p>
      <div class="padding">{{viewedUser.bio}}</div>
    </div>
  </div>
</template>

<script>

import { date } from 'quasar'
export default {


  data(){
    return{
      prefInfo: false,
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
                  name: 'Redseligkeit', value: 3
              },
              {
                  name: ' ...am Morgen', value: 2
              },
              {
                  name: 'Rauchen', value: 1
              },
              {
                  name: 'Musik', value: 3
              }]
          }
      }
    }
}
</script>