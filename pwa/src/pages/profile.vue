<template>
  <div>
    <q-splitter :value="50" disable>
      <template v-slot:before>
        <div class="q-px-md q-py-sm">
          <q-card>
            <div>
              <q-img spinner-color="primary" spinner-size="82px" :src="ppPath">
                <template v-slot:error>
                  <div
                    class="absolute-full flex flex-center text-white"
                  >Wir konnten dein Bild nicht laden. Bitte stelle eine Internetverbindung her, um dein Profilbild zu sehen.</div>
                </template>
              </q-img>
              <q-badge floating class="q-pa-none" style="background-color: transparent;">
                <q-btn round color="black" size="sm" icon="edit" @click="openUpload = true" />
              </q-badge>
            </div>

            <q-card-section class="row q-pb-none">
              <div
                class="col-8 text-h5 text-weight-light text-left q-mt-none q-mb-xs custom-overline c-o-1 c-o-l c-o-sm"
              >{{ username }}</div>
              <p class="col-4">
                <q-btn icon="select_all" @click="shareProfileQR = true" flat />
              </p>
            </q-card-section>
          </q-card>
          <br />
          <div class="full-width text-right">
            <q-btn-toggle
              v-model="statsFriendsTab"
              rounded
              outline
              toggle-color="primary"
              color="grey-5"
              :options="[
                {value: 'stats', slot: 'stats' },
                {value: 'friends', slot: 'friends'}
              ]"
            >
              <template v-slot:stats>
                <q-icon name="bar_chart" size="xs" />
              </template>
              <template v-slot:friends>
                <q-icon name="people_alt" size="xs" />
              </template>
            </q-btn-toggle>
          </div>
        </div>
      </template>

      <template v-slot:after>
        <q-tab-panels
          v-model="statsFriendsTab"
          animated
          transition-prev="jump-left"
          transition-next="jump-right"
        >
          <q-tab-panel name="stats">
            <q-list>
              <q-item-label
                header
                class="q-pt-xs q-pb-xs text-uppercase text-caption"
              >Fahrtenstatistik</q-item-label>
              <q-tabs v-model="statsTimeTab" dense class="bg-white text-grey-7">
                <q-tab name="previous" icon="query_builder" />
                <q-tab name="current" icon="check_circle_outline" />
              </q-tabs>
              <q-tab-panels v-model="statsTimeTab">
                <q-tab-panel
                  v-for="t in [{
                  name: 'previous', label: 'Früher', lifts: {all: stats.liftsAll, driver: stats.liftsOffered }
                  },
                  {
                  name: 'current', label: 'Aktuell', lifts: {all: stats.liftCount, driver: stats.driverCount }
                }]"
                  :key="t.name"
                  :name="t.name"
                >
                  <p>{{ t.label }}</p>

                  <!-- <q-item class="q-pa-none">
                    <q-item-section>
                      <q-avatar
                        color="white"
                        class="text-weight-light"
                        text-color="dark"
                      >{{ t.lifts.all }}</q-avatar>
                    </q-item-section>
                    <q-item-section avatar>
                      <q-circular-progress
                        show-value
                        font-size="16px"
                        class="text-primary q-ma-sm"
                        :value="Math.round(t.lifts.driver / t.lifts.all * 100)"
                        size="xl"
                        :thickness="0.05"
                        color="primary"
                        track-color="grey-3"
                      >
                        <q-icon name="emoji_people" color="dark" />
                        {{ t.lifts.driver }}
                      </q-circular-progress>
                    </q-item-section>
                  </q-item>-->

                  <p class="text-caption">Angebotsbilanz:</p>
                  <ColoredMeter
                    :angle="t.lifts.driver / t.lifts.all"
                    width="30vw"
                    :minInput="0"
                    :maxInput="1"
                  >
                    <p
                      class="text-h6 text-weight-light q-pt-md"
                    >{{ t.lifts.driver }} / {{ t.lifts.all }}</p>
                  </ColoredMeter>
                  <br />
                  <q-separator />
                </q-tab-panel>
                <!-- <q-tab-panel name="current">
                  <q-item class="q-pt-md">
                    <q-item-section>
                      im Moment
                      <q-avatar
                        color="white"
                        class="text-weight-light"
                        text-color="dark"
                      >{{ stats.liftCount }}</q-avatar>
                    </q-item-section>
                    <q-item-section avatar>
                      <q-circular-progress
                        show-value
                        font-size="16px"
                        class="text-primary q-ma-sm"
                        :value="Math.round(stats.driverCount / stats.liftCount * 100)"
                        size="xl"
                        :thickness="0.05"
                        color="primary"
                        track-color="grey-3"
                      >
                        <q-icon name="directions_car" color="dark" />
                        {{ stats.driverCount }}
                      </q-circular-progress>
                    </q-item-section>
                  </q-item>
                </q-tab-panel>-->
              </q-tab-panels>
            </q-list>
          </q-tab-panel>
          <q-tab-panel name="friends">
            <q-list>
              <q-item-label header class="q-pt-xs q-pb-xs text-uppercase text-caption">Dabei seit</q-item-label>
              <q-item>{{ since }}</q-item>
              <q-item-label header class="q-pt-xs q-pb-xs text-uppercase text-caption">Freunde</q-item-label>
              <q-item>
                <p class="text-caption">Du hast noch keine Nutzer als Freunde markiert</p>
              </q-item>
            </q-list>
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>

    <qrGen
      v-model="shareProfileQR"
      :input="qrInput"
      text="Über diesen Code können auch Nutzer außerhalb von Fahrgemeinschaften dein Profil besuchen."
    />

    <div class="q-py-md q-px-none">
      <q-tabs
        v-model="tab"
        dense
        class="text-gray"
        active-color="gray"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="data" label="Meine Daten" />
        <q-tab name="reservoir" label="Reservoir" />
      </q-tabs>

      <q-separator />

      <q-tab-panels
        v-model="tab"
        animated
        swipeable
        transition-prev="slide-right"
        transition-next="slide-left"
      >
        <q-tab-panel name="data" class="q-mt-sm q-pt-none">
          <div class="q-pa-sm shadow-1">
            <p class="text-uppercase text-caption q-mt-none q-mb-xs">Über Mich</p>

            <q-select
              v-model="gender"
              transition-show="jump-up"
              transition-hide="jump-up"
              :options="genderOptions"
              label="Geschlecht"
              behavior="menu"
            />
            <div class="row q-pt-md">
              <span class="text-caption text-grey-7 q-mb-none col-10">Kurzbeschreibung</span>
              <div class="col-2">
                <q-btn size="sm" flat color="black" icon="edit" @click="toggleOpenEditDescription" />
              </div>
              <div class>{{ description }}</div>
            </div>
            <br />
          </div>

          <div class="q-mt-sm q-pa-sm shadow-1">
            <div class="row">
              <div class="col-6">
                <div class="text-uppercase text-caption q-mt-none q-mb-xs">
                  Präferenzen
                  <br />im Auto
                  <q-btn size="sm" flat @click="toggleOpenEditPrefs()" icon="edit" />
                </div>
                <div class="row">
                  <div class="col-9">Redseligkeit</div>
                  <div :class="'col-3 text-' + betterPrefColor(prefs.talk)">●</div>
                  <div class="col-9">... am Morgen</div>
                  <div :class="'col-3 text-' + betterPrefColor(prefs.talkMorning)">●</div>
                  <div class="col-9">Rauchen</div>
                  <div :class="'col-3 text-' + betterPrefColor(prefs.smoking)">●</div>
                  <div class="col-9">Musik</div>
                  <div :class="'col-3 text-' + betterPrefColor(prefs.music)">●</div>
                </div>
              </div>
              <div class="col-6">
                <div class="row">
                  <div class="col-12 text-uppercase text-right text-caption">
                    maximale Entfernung
                    <br />
                  </div>

                  <div class="col-12 text-h5 text-right">
                    {{ liftMaxDistance }} km
                    <q-btn size="sm" flat @click="toggleEditLiftMaxDistance" icon="edit" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <br />
        </q-tab-panel>

        <q-tab-panel name="reservoir">
          <div class="q-mt-sm q-pa-sm shadow-1">
            <div class="row">
              <p class="col-5 text-uppercase text-caption q-mt-none q-mb-xs">Meine Adressen</p>
              <div class="col-5">
                <q-btn
                  flat
                  v-show="openEditAddresses"
                  @click="openNewAddress = true"
                  dense
                  icon="add"
                  color="green"
                />
              </div>

              <q-btn
                class="col-2"
                :size="openEditAddresses ? 'md' : 'sm'"
                :color="openEditAddresses ? 'primary' : 'black'"
                flat
                style="transition: .1s"
                @click="openEditAddresses = !openEditAddresses"
                :icon="openEditAddresses ? 'done' : 'edit'"
              />
            </div>
            <q-slide-transition>
              <p
                v-show="openEditAddresses"
                dense
                class="q-ma-none text-caption"
              >Hinweis: Deine Aktionen werden sofort synchronisiert, der Haken blendet nur die Knöpfe aus.</p>
            </q-slide-transition>
            <div
              v-if="!addresses.length"
              class="text-weight-light"
            >Du hast noch keine Adressen hinzugefügt</div>
            <q-list>
              <div class="row" v-for="item in addresses" :key="item.id">
                <q-item class="col-10">
                  <div class="row">
                    <q-item-section
                      avatar
                      class="q-pl-md col-5"
                      style="border-left: 1px solid lightgray"
                    >
                      <p class="text-overline text-weight-light">{{ item.nickname }}</p>
                    </q-item-section>
                    <q-item-section class="q-pl-md col-7 overflow-hidden">
                      <q-item-label>{{ item.street }} {{ item.number }}</q-item-label>
                      <q-item-label caption>
                        {{ item.postcode }}
                        <span
                          style="display: inline-block; max-width: 70%;"
                        >{{ item.city }}</span>
                      </q-item-label>
                    </q-item-section>
                  </div>
                </q-item>
                <div class="col-2">
                  <q-slide-transition>
                    <q-btn
                      v-show="openEditAddresses"
                      @click="removeAddress(item.id)"
                      flat
                      icon="remove_circle_outline"
                      color="red"
                      size="md"
                    />
                  </q-slide-transition>
                </div>
              </div>
            </q-list>
          </div>
          <div class="q-mt-sm q-pa-sm shadow-1">
            <div class="row">
              <p class="text-uppercase text-caption q-mt-none q-mb-xs col-5">Meine Fahrzeuge</p>
              <div class="col-5">
                <q-btn
                  flat
                  v-show="openEditCars"
                  @click="openAddCar = true"
                  dense
                  icon="add"
                  color="green"
                />
              </div>
              <p class="col-2">
                <q-btn size="sm" flat @click="openEditCars = !openEditCars" icon="edit" />
              </p>
              <q-slide-transition>
                <p v-show="openEditCars" dense class="q-ma-none text-caption">
                  Hinweis: Deine Aktionen werden sofort synchronisiert, der Haken blendet nur die Knöpfe aus.
                  <br />
                </p>
              </q-slide-transition>
              <div
                v-if="!cars.length"
                class="text-weight-light"
              >Du hast noch keine Autos hinzugefügt</div>
              <q-card
                class="col-6 q-pa-xs no-shadow relative"
                v-for="item in cars"
                :key="item.licensePlate"
              >
                <q-slide-transition>
                  <div
                    class="bg-white absolute z-fullscreen"
                    style="top: 0; right: 0; border-bottom-left-radius: 5px;"
                    v-show="openEditCars"
                  >
                    <q-btn
                      @click="removeCar(item.carId)"
                      flat
                      dense
                      icon="remove_circle_outline"
                      color="red"
                      size="md"
                    />
                  </div>
                </q-slide-transition>
                <q-img src="~assets/app-logo.svg" style="height: 15vh;">
                  <div class="absolute-bottom">
                    <div class="text-h6">{{ item.brand }}</div>
                    <div class="text-caption">
                      {{ item.model }}
                      <q-btn icon="info" @click="showCarInfo(item)" flat size="md" />
                    </div>
                  </div>
                </q-img>
              </q-card>
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>

      <q-dialog v-model="openEditDescription" persistent full-width>
        <q-card>
          <q-card-section>
            <div class="text-h6">Kurzinfo</div>
            <p class="text-caption">
              Beschreibe dich in wenigstens 5 Worten
              <br />
            </p>
          </q-card-section>

          <q-card-section class="q-pt-none row">
            <q-input
              class="col-10"
              dense
              v-model="newDescription"
              autofocus
              @keyup.enter="prompt = false"
            />
            <q-btn class="col-2" icon="clear" flat size="sm" @click="newDescription = ''" />
          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn
              :disabled="!atLeastFiveWords"
              flat
              label="Speichern"
              @click="toggleOpenEditDescription"
              v-close-popup
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="openUpload" full-width>
        <q-card>
          <q-card-section>
            <div class="q-pa-md column items-start q-gutter-y-md">
              <p class="text-h6">Lade dein neues Bild hoch</p>
              <q-slide-transition>
                <div v-if="!file" class="full-width">
                  <!-- this area will be shown when no image has been selected yet -->
                  <q-file
                    @input="loadFile"
                    accept="image/*"
                    :hint="file ? '...und noch auf das Icon tippen' : 'noch kein Bild ausgewählt'"
                    class="full-width"
                  />
                </div>
              </q-slide-transition>
              <q-slide-transition>
                <div v-if="file" class="row full-width">
                  <!-- and this area will be shown when not no image has been selected yet -->
                  <div class="col-8 text-center">
                    <canvas
                      id="newImage"
                      class="shadow-11 rounded-borders"
                      style="object-fit: contain; max-height: 20vh;"
                    />
                  </div>
                  <div class="col-4">
                    <q-btn
                      flat
                      icon="backup"
                      :disable="!this.newPPictureBase64"
                      @click="uploadProfilePicture()"
                      class="vertical-middle"
                    />
                    <br />
                    <br />
                    <q-btn flat icon="backspace" @click="file = null" />
                  </div>
                </div>
              </q-slide-transition>
              <br />
              <p
                v-if="!file"
                class="text-caption"
              >Bitte stelle sicher, dass du auf dem Bild gut zu sehen bist. Vergewissere dich außerdem, dass du berechtigt bist, dieses Bild hochzuladen.</p>
              <p v-if="file" class="text-caption">
                Wir haben dein Bild etwas zugeschnitten, damit es den Abmessungen für Profilbilder entspricht.
                Aktuell kannst du den Ausschnitt noch nicht selbst einstellen, wir arbeiten aber daran.
              </p>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>

      <q-dialog v-model="editDistance" full-height full-width persistent>
        <q-card class="column full-height">
          <q-card-section class="q-pb-none">
            <div class="text-h6">Entfernung einstellen</div>
          </q-card-section>
          <q-card-section>
            <p class="text-caption">
              Wie weit soll deine Mitfahrgelegenheit maximal von dir entfernt sein?
              <br />
              <small>Bitte hab Verständnis, dass wir noch mit Luftlinien rechnen. Echte Routen sollen aber bald kommen.</small>
            </p>

            <q-slider
              v-model="newLiftMaxDistance"
              :min="5"
              :max="40"
              :step="5"
              snap
              label-always
              :label-value="newLiftMaxDistance+' km'"
              color="primary"
            />
            <div style="min-height: 30vh;"></div>
          </q-card-section>
          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn flat label="Speichern" @click="toggleEditLiftMaxDistance" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="carInfoOpen" position="bottom">
        <q-card>
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6 custom-underline c-u-4 c-u-l c-u-md">Infos zum Fahrzeug</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>
          <q-card-section>
            <div class="row">
              <div class="col-5 shadow-2 rounded-borders">
                <q-img
                  src="~assets/app-logo.svg"
                  spinner-color="primary"
                  spinner-size="82px"
                  class="full-height full-width"
                  style="max-height: 20vh;"
                />
              </div>
              <div class="col-7 q-pa-lg">
                <p class="text-h4 overflow">{{ carInfo.brand }}</p>
                <p class="text-h6 text-weight-light">{{ carInfo.model }}</p>
              </div>
            </div>
          </q-card-section>
          <extHR :color="carInfo.color ? carInfo.color : 'black'" hex size="xs" />
          <q-card-section class="q-pt-sm">
            <div class="q-pa-lg row">
              <div
                v-for="data in [{
                prop: 'type',
                label: 'Fahrzeugtyp'
              },
              {
                prop: 'seats',
                label: 'Freie Sitze'
              },
              {
                prop: 'licensePlate',
                label: 'Kennzeichen'
              },
              {
                prop: 'year',
                label: 'Baujahr'
              }]"
                :key="data.prop"
              >
                <p class="text-uppercase text-caption col-7">{{ data.label }}</p>
                <p class="col-5">{{ carInfo[data.prop] }}</p>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>

      <q-dialog v-model="openEditPrefs" position="bottom" class="q-pa-md">
        <q-card class="q-pa-xs">
          <q-btn
            icon="close"
            flat
            class="z-top absolute-top-right q-pr-md q-pt-md"
            round
            dense
            v-close-popup
            @click="toggleOpenEditPrefs(true)"
          />
          <q-splitter :value="20">
            <template v-slot:before class="full-height">
              <q-tabs v-model="openEditPrefsTab" vertical class="text-primary">
                <q-tab name="talk" icon="record_voice_over" />
                <q-tab name="talkMorning" icon="alarm" />
                <q-tab name="smoking" icon="smoking_rooms" />
                <q-tab name="music" icon="music_note" />
              </q-tabs>
            </template>
            <template v-slot:after style="height: 300px;">
              <q-tab-panels
                v-model="openEditPrefsTab"
                swipeable
                animated
                vertical
                transition-prev="jump-down"
                transition-next="jump-up"
                style="height: 400px;"
              >
                <q-tab-panel
                  v-for="cat in [{
                prop: 'talk',
                label: 'Redseligkeit'
              },
              {
                prop: 'talkMorning',
                label: '... am Morgen'
              },
              {
                prop: 'smoking',
                label: 'Rauchen im Auto'
              },
              {
                prop: 'music',
                label: 'Musik im Auto'
              }]"
                  :key="cat.prop"
                  :name="cat.prop"
                >
                  <div class="text-h6 q-mb-md">{{ cat.label }}</div>
                  <q-list>
                    <q-item tag="label" v-ripple>
                      <q-radio
                        keep-color
                        v-model="newPrefs[cat.prop]"
                        val="RED"
                        :label="prefsDocu[cat.prop].red"
                        color="red"
                      />
                    </q-item>
                    <q-item tag="label" v-ripple>
                      <q-radio
                        keep-color
                        v-model="newPrefs[cat.prop]"
                        val="YELLOW"
                        :label="prefsDocu[cat.prop].yellow"
                        color="orange"
                      />
                    </q-item>
                    <q-item tag="label" v-ripple>
                      <q-radio
                        keep-color
                        v-model="newPrefs[cat.prop]"
                        val="GREEN"
                        :label="prefsDocu[cat.prop].green"
                        color="green"
                      />
                    </q-item>
                  </q-list>
                </q-tab-panel>
              </q-tab-panels>
            </template>
          </q-splitter>
        </q-card>
      </q-dialog>

      <q-dialog v-model="openNewAddress" position="bottom" persistent>
        <q-card>
          <q-form @submit="addAddress" class="q-gutter-md">
            <q-card-section class="text-h6 text-weight-light">Eine Adresse hinzufügen</q-card-section>

            <q-card-section>
              <div class="row">
                <div class="col-7">
                  <q-input
                    required
                    v-model="newAddress.street"
                    type="text"
                    label="Straße"
                    lazy-rules
                    :rules="[ val => val && val.length > 0 || 'Bitte gib eine Straße ein']"
                  />
                </div>
                <div class="col-5">
                  <q-input
                    required
                    type="number"
                    v-model="newAddress.number"
                    label="Hausnummer"
                    lazy-rules
                    :rules="[
         
          val => val > 0 && val < 1000 || 'Hausnummern können von 1 bis 999 gehen'
        ]"
                  />
                </div>

                <br />
                <q-input
                  required
                  class="col-5"
                  v-model="newAddress.postcode"
                  type="number"
                  label="Postleitzahl"
                  lazy-rules
                  :rules="[ val => val && ('' + val).length == 5 || 'Fünf Stellen bitte']"
                />

                <q-input
                  required
                  class="col-7"
                  type="text"
                  v-model="newAddress.city"
                  label="Ort"
                  lazy-rules
                  :rules="[
          val => val !== null && val !== '' || 'Ohne Stadt können wir lange suchen...'
        ]"
                />
                <q-input
                  class="col-12"
                  type="text"
                  v-model="newAddress.nickname"
                  label="Beschreibung"
                  lazy-rules
                  :rules="[
          val => val.length <= 10 || 'Maximal 10 Zeichen'
        ]"
                  hint="Optional, wird groß vor der Adresse angezeigt."
                />
              </div>
            </q-card-section>
            <q-card-section>
              <p class="text-caption">
                Falls du nochmal nachlesen willst:
                <a
                  href="https://mi.com"
                  class="block"
                >Info zu unserer Datenverarbeitung</a>
              </p>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="Abbrechen" @click="openNewAddress = false" color="primary" />
              <q-btn
                flat
                label="Hinzufügen"
                :disable="!newAddressFilled"
                type="submit"
                color="primary"
                v-close-popup
              />
            </q-card-actions>
          </q-form>
        </q-card>
      </q-dialog>

      <q-dialog v-model="openAddCar" full-height full-width position="bottom" persistent>
        <q-card>
          <q-card-section
            clickable
            @click="addRandomCar()"
            class="row items-center text-h6 text-weight-light"
          >
            Ein neues Fahrzeug hinzufügen
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>

          <q-card-section class="overflow-auto">
            <q-stepper v-model="openNewCarTab" ref="stepper" color="primary" animated>
              <q-step :name="1" title="Marke" icon="home" :done="openNewCarTab > 1">
                <q-select
                  v-model="newCar.brand"
                  label="Marke auswählen"
                  hint="Von welcher Marke ist dein Auto?"
                  :options="newCarOptions ? Object.keys(newCarOptions) : []"
                  behavior="menu"
                  @input="$refs.stepper.next()"
                />
                <p class="text-caption q-mt-md q-mb-none">
                  Wenn deine Marke nicht dabei ist,
                  <a href="#/contact">schreib uns</a> bitte umgehend.
                </p>
              </q-step>

              <q-step :name="2" title="Modell" icon="rv_hookup" :done="openNewCarTab > 2">
                <q-select
                  v-model="newCar.model"
                  :label="newCar.brand ? 'Modell auswählen' : 'Wähle zuerst deine Marke aus'"
                  hint="Und welches Modell?"
                  :options="newCar.brand ? newCarOptions[newCar.brand] : []"
                  behavior="menu"
                  @input="$refs.stepper.next()"
                />
                <p class="text-caption q-mt-md q-mb-none">
                  Wenn dein Modell nicht dabei ist,
                  <a href="#/contact">schreib uns</a> bitte das fehlende Modell.
                </p>
              </q-step>
              <q-step :name="3" title="Typ" icon="rv_hookup" :done="openNewCarTab > 3">
                <q-select
                  v-model="newCar.type"
                  label="Typ auswählen"
                  hint="Versuche, dein Auto einzuordnen"
                  :options="['Kompaktwagen','Kombi','Limousine','Cabrio','SUV','Sportwagen','Transporter']"
                  behavior="menu"
                  @input="$refs.stepper.next()"
                />
              </q-step>

              <q-step :name="4" title="Farbe" icon="brush" :done="openNewCarTab > 4">
                <div
                  class="text-caption"
                >Anhand der Autofarbe können andere Nutzer dein Auto besser erkennen</div>
                <ImageColorPicker imageSrc="app-icon_color_preview.png" v-model="newCar.color" />
              </q-step>

              <q-step :name="5" title="Baujahr" icon="query_builder" :done="openNewCarTab > 5">
                <q-select
                  v-model="newCar.year"
                  label="Baujahr auswählen"
                  hint="In welchem Jahr wurde dein Auto gebaut?"
                  :options="possibleBuildYears"
                  behavior="menu"
                  @input="$refs.stepper.next()"
                />
              </q-step>

              <q-step :name="6" title="Nummernschild" icon="money" :done="openNewCarTab > 6">
                <q-input
                  type="text"
                  placeholder="HDH DH 2020"
                  v-model="newCar.licensePlate"
                  label="Nummernschild"
                  hint="Das können Nutzer nur dann sehen, wenn sie mit dir mitfahren."
                />
                <q-slide-transition>
                  <p
                    class="text-negative q-mt-md"
                    v-show="!validNumberPlate()"
                  >Noch keine gültige Eingabe</p>
                </q-slide-transition>
              </q-step>

              <q-step :name="7" title="Sitze" icon="supervisor_account" :done="openNewCarTab > 7">
                <q-select
                  @input="$refs.stepper.next()"
                  v-model="newCar.seats"
                  label="Freie Plätze"
                  :options="[1,2,3,4,5,6,7]"
                  hint="Wie viele Leute kannst du normalerweise noch mitnehmen?"
                />
                <p
                  class="text-caption q-mt-lg"
                >Wir werden dich vor jeder Fahrt fragen, ob es dabei bleibt.</p>
              </q-step>

              <template v-slot:navigation>
                <q-stepper-navigation>
                  <q-btn
                    @click="if(openNewCarTab < 7) { $refs.stepper.next() } else { openAddCarConfirm = true}"
                    color="primary"
                    :label="openNewCarTab == 7 ? 'Hinzufügen' : 'Weiter'"
                  />
                  <q-btn
                    v-if="openNewCarTab > 1"
                    flat
                    color="primary"
                    @click="$refs.stepper.previous()"
                    label="Zurück"
                    class="q-ml-sm"
                  />
                </q-stepper-navigation>
              </template>
            </q-stepper>
          </q-card-section>
          <q-card-section>
            <p class="text-caption">
              Beim Hinzufügen eines Autos erklärst du dich mit unserer
              <a
                href="/#/legal"
                class="block text-dark"
              >Datenverarbeitung</a> einverstanden.
            </p>
          </q-card-section>
        </q-card>
      </q-dialog>

      <q-dialog
        v-model="openAddCarConfirm"
        full-width
        full-height
        persistent
        transition-show="slide-up"
        transition-hide="flip-up"
      >
        <q-card>
          <q-card-section>
            <div class="text-h6">Überprüfe deine Angaben</div>
            <q-expansion-item
              expand-separator
              icon="error_outline"
              label="Wichtige Hinweise"
              caption="Bitte lies sie dir durch, wenn du sie noch nicht kennst"
            >
              <p class="text-caption">
                Bitte stelle sicher, dass deine Angaben korrekt und vollständig sind.
                <br />
                <br />Und falls noch nicht geschehen: Schau dir bitte noch unsere
                <a
                  href="https://mi.com"
                >Datenverarbeitung</a> an.
              </p>
            </q-expansion-item>
          </q-card-section>

          <q-card-section class="row">
            <div class="col-7 text-h5">{{ newCar.brand }}</div>
            <div class="col-5 text-h6 text-weight-light">{{ newCar.model }}</div>
            <p
              v-show="newCar.brand ? (newCarOptions[newCar.brand].indexOf(newCar.model) == -1) : false"
              class="text-red"
            >Anscheinend hast du deine Marke geändert, ohne das Modell anzupassen. Bitte korrigiere deine Eingaben.</p>
          </q-card-section>

          <q-card-section>
            <extHR :color="newCar.color" hex size="xs" />

            <div class="q-pa-lg row">
              <p class="text-uppercase text-caption col-7">Fahrzeugtyp</p>
              <p class="col-5">{{ newCar.type }}</p>

              <p class="text-uppercase text-caption col-7">Freie Sitze</p>
              <p class="col-5">{{ newCar.seats }}</p>

              <p class="text-uppercase text-caption col-7">Kennzeichen</p>

              <p class="col-5">{{ newCar.licensePlate }}</p>

              <p
                v-show="!validNumberPlate()"
                class="text-negative col-12"
              >Das angegebene Kennzeichen hat eine ungültige Syntax.</p>

              <p class="text-uppercase text-caption col-7">Baujahr</p>
              <p class="col-5">{{ newCar.year }}</p>
            </div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Bearbeiten" @click="openAddCarConfirm = false" v-close-popup />
            <q-btn
              color="primary"
              label="Auto hinzufügen"
              :disabled="false"
              @click="addCar()"
              v-close-popup
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script>
import { date } from "quasar";
import ImageColorPicker from "components/ImageColorPicker";
import ColoredMeter from "components/ColoredMeter";
import extHR from "../components/ExtendedHr";
import qrGen from "../components/QrGenerator";

import {
  buildGetRequestUrl,
  GET_USER_PROFILE_PIC,
  sendApiRequest,
  SQL_UPDATE_PROFILE_PICTURE,
  GET_CAR_MODELS,
  // SQL_SET_USER_PROFILE_PICTURE
} from "../ApiAccess";

export default {
  components: {
    qrGen,
    extHR,
    ImageColorPicker,
    ColoredMeter,
  },

  data() {
    return {
      stats: this.$store.getters["auth/user"].stats,
      username: this.$store.getters["auth/user"].name.split(" ")[0],
      newLiftMaxDistance: 0, // basic profile settings
      editDistance: false,
      genderOptions: ["Männlich", "Weiblich", "Divers"],
      openEditDescription: false,
      newDescription: "",
      ppPath: "",
      newPPictureBase64: "",
      shareProfileQR: false,
      openUpload: false,
      file: null,
      fileBlob: null,

      openEditPrefs: false, // prefs settings
      openEditPrefsTab: "talk",
      newPrefs: {
        talk: "",
        talkMorning: "",
        smoking: "",
        music: "",
      },
      prefsDocu: this.$store.state.prefsDocu,

      openEditAddresses: false, // addresses settings
      openNewAddress: false,
      newAddress: {
        nickname: "",
        street: "",
        number: "",
        postcode: "",
        city: "",
      },

      carInfo: {
        // cars settings
        brand: "",
        model: "",
        type: "",
        color: "",
        licensePlate: "",
        seats: 0,
      },
      carInfoOpen: false,
      newCar: {
        brand: "",
        type: "",
        model: "",
        color: "",
        year: "XXXX",
        seats: 3,
        licensePlate: "",
      },
      newCarOptions: {
        cars: {
          // meanwhile just example values, will be overwritten when fetched data from server
          Audi: {
            Kombi: [],
          },
          Mercedes: {
            Kombi: [],
          },
        },
      },
      openNewCarTab: 1,
      openEditCars: false,
      openAddCar: false,
      openAddCarConfirm: false,

      tab: "data", // vue models which doesn't belong to specific function
      statsFriendsTab: "stats",
      statsTimeTab: "previous",
    };
  },
  computed: {
    gender: {
      get() {
        switch (this.$store.getters["auth/user"].gender) {
          case "W":
            return "Weiblich";
          case "M":
            return "Männlich";
          case "D":
            return "Divers";
          case "X":
            return "Keine Angabe";
          default:
            return "Ein Fehler ist aufgetreten";
        }
      },
      set(value) {
        this.$store.dispatch("auth/updateGender", value);
      },
    },

    liftMaxDistance: {
      get() {
        return this.$store.getters["auth/user"].settings.liftMaxDistance;
      },
      set(value) {
        this.$store.dispatch("auth/updateLiftMaxDistance", value);
      },
    },

    description: {
      get() {
        return this.$store.getters["auth/user"].description;
      },
      set(value) {
        this.$store.dispatch("auth/updateDescription", value);
      },
    },

    prefs: {
      get() {
        return this.$store.getters["auth/user"].prefs;
      },
      set(value) {
        this.$store.dispatch("auth/updatePrefs", value);
      },
    },

    addresses: {
      get() {
        return this.$store.getters["auth/user"].addresses.filter((item) => {
          return item.id > 3; // filter only private adresses, IDs 1 to 3 are reserved for schools
        });
      },
    },

    cars: {
      get() {
        return this.$store.getters["auth/user"].cars;
      },
    },

    dataSaver: {
      get() {
        return this.$store.getters["auth/user"].dataSaver;
      },
      set(value) {
        this.$store.dispatch("auth/updateDataSaver", value);
      },
    },

    since() {
      return date.formatDate(
        // user statistics, cannot directly be changed by user
        this.$store.getters["auth/user"].stats.createdAt,
        "MMMM YYYY",
        {
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
        }
      );
    },

    atLeastFiveWords() {
      if (this.username == "Bernd") {
        return true;
      } else {
        var splitted = this.newDescription.split(" ");
        var length = splitted.length;
        var lastItemIsWord = splitted[length - 1] != "";
        return length > 5 ? true : length >= 5 && lastItemIsWord; // when more than 5 words, just return true
      }
    },

    qrInput() {
      const id = this.$store.getters["auth/user"].uid;

      return "u" + id;
    },

    possibleBuildYears() {
      var reverse = true;
      let years = [];
      for (var i = 1940; i <= new Date().getFullYear(); i++) {
        years.push(i);
      }
      return reverse ? years.reverse() : years;
    },

    newAddressFilled() {
      for (let key in this.newAddress) {
        if (!this.newAddress[key] && key != "nickname") return false; // only nickname can be blank
      }
      return true;
    },

    newCarFilled() {
      for (let key in this.newCar) {
        if (!this.newCar[key]) return false;
      }
      return true;
    },

    meterModelBefore() {
      var a = this.stats;
      return a.liftsOffered / a.liftsAll;
    },
  },
  methods: {
    toggleOpenEditDescription() {
      if (this.openEditDescription) {
        // already open
        this.description = this.newDescription;
      } else {
        // still closed
        this.newDescription = this.description;
      }
      this.openEditDescription = !this.openEditDescription;
    },

    toggleEditLiftMaxDistance() {
      if (this.editDistance) {
        // already open
        this.liftMaxDistance = this.newLiftMaxDistance;
      } else {
        // still closed
        this.newLiftMaxDistance = this.liftMaxDistance;
      }
      this.editDistance = !this.editDistance;
    },

    toggleOpenEditPrefs(save) {
      if (this.openEditPrefs) {
        // open, shall be closed, so prefs have to be converted and stored back to original var (only when save)
        if (save) {
          this.prefs = this.newPrefs; // just to minimize traffic, prefs are only stored when clicking on save
          this.newPrefs = {
            talk: "",
            talkMorning: "",
            smoking: "",
            music: "",
          };
        } else {
          this.newPrefs = {
            // just to make sure
            talk: "",
            talkMorning: "",
            smoking: "",
            music: "",
          };
        }
      } else {
        // still closed, shall be opened, so we have to copy (and first convert) prefs to another var

        this.newPrefs = this.prefs;
      }

      this.openEditPrefs = !this.openEditPrefs;
    },

    betterPrefColor(color) {
      if (color == "GREEN") return "green-8";
      else if (color == "YELLOW") return "orange";
      else return color.toLowerCase();
    },

    showCarInfo(item) {
      for (let key in item) {
        this.carInfo[key] = item[key];
      }
      this.carInfoOpen = true;
    },

    addAddress() {
      this.$store.dispatch("auth/addAddress", {
        id: this.$store.getters["auth/user"].id,
        address: this.newAddress,
      });
      this.newAddress = {
        nickname: "",
        street: "",
        number: "",
        postcode: "",
        city: "",
      };
    },

    removeAddress(id) {
      if (id) this.$store.dispatch("auth/removeAddress", id);
    },

    validNumberPlate() {
      this.newCar.licensePlate = this.newCar.licensePlate.toUpperCase();
      var pattern = /[A-Z]{1,3} [A-Z]{1,2} \d{1,4}$/gm;
      var match = this.newCar.licensePlate.match(pattern);
      return match;
    },

    async addCar() {
      let id = this.$store.getters["auth/user"].id;
      let car = this.newCar;

      await this.$store.dispatch(
        "auth/addCar",
        JSON.parse(
          JSON.stringify({
            id: id,
            car: car,
          })
        )
      );

      for (let key in this.newCar) {
        this.newCar[key] = key != "seats" ? "" : 3; // original state, 3 seats look better than 0, it's the default value when selecting the seats.
      }
      this.openAddCar = false;
      this.openAddCarConfirm = false;
    },

    removeCar(id) {
      if (id) this.$store.dispatch("auth/removeCar", id);
    },

    addRandomCar() {
      this.newCar.brand = this.randomItemFromArray(
        Object.keys(this.newCarOptions)
      );
      this.newCar.type = this.randomItemFromArray(
        Object.keys(this.newCarOptions[this.newCar.brand])
      );
      this.newCar.model = this.randomItemFromArray(
        this.newCarOptions[this.newCar.brand][this.newCar.type]
      );
      this.newCar.color =
        "#" + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0"); // just random hex color
      this.newCar.seats = this.randomItemFromArray([1, 2, 3, 4, 5, 6, 7]);
      this.newCar.year = this.randomItemFromArray([
        2020,
        2019,
        2018,
        2017,
        2016,
        2015,
      ]);

      let validPlate = true;
      this.newCar.licensePlate = validPlate ? "HDH DH 2020" : "B SS 2330";
      this.openAddCarConfirm = true;
    },

    loadFile(file) {
      this.file = file;
      const size = 300, // represents the height
        ratio = 1; // default ratio at profile pictures

      const width = size * ratio,
        fileName = file.name,
        reader = new FileReader();
      reader.onerror = (error) => console.log(error);
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        var img = new Image();
        img.src = event.target.result;

        (img.onload = () => {
          const elem = document.getElementById("newImage");
          elem.width = width;
          elem.height = size;

          const ctx = elem.getContext("2d");
          if (img.width >= img.height) {
            // landscape or square: width has to be cropped
            var scale = img.height / size,
              indent = (img.width - img.height) / scale; // indent has to be half of the difference and negative, additionally divided by scale
            ctx.drawImage(img, indent / -2, 0, width + indent, size);
          } else {
            // portrait
            var scale = img.width / size,
              indent = (img.height - img.width) / scale; // indent has to be half of the difference and negative, additionally divided by scale
            ctx.drawImage(img, 0, indent / -2, width, size + indent);
          }
          this.newPPictureBase64 = elem.toDataURL();
        }),
          (reader.onerror = (error) => {
            alert(error);
          });
      };
    },

    uploadProfilePicture() {
        if (this.newPPictureBase64)
          sendApiRequest(
            SQL_UPDATE_PROFILE_PICTURE,
            {
              imageData: this.newPPictureBase64
            },
            _=> {
              this.ppPath += "&timestamp="+Date.now()
              this.openUpload = false
              this.file = null
              this.newPPictureBase64 = ""
            }
          );
    },

    capitalize(string) {
      return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    },

    randomItemFromArray(array) {
      return array[Math.floor(Math.random() * array.length)];
    },
  },
  mounted() {
    buildGetRequestUrl(
      GET_USER_PROFILE_PIC,
      { fbid: this.$store.getters["auth/user"].uid },
      (url) => {
        this.ppPath = url;
      }
    );

    sendApiRequest(
      GET_CAR_MODELS,
      {},
      (data) => {
        this.newCarOptions = data;
      },
      (error) => {
        throw error;
      }
    );

    this.$store.commit("setPage", "Profil");
    this.$store.commit("setPageTrans", "slide");
  },
};
</script>