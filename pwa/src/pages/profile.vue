<template>
  <div>
    <q-splitter :value="50">
      <template v-slot:before>
        <div class="q-px-md q-py-sm">
          <q-card>
            <div>
              <q-img spinner-color="primary" spinner-size="82px" :src="ppPath">
                <template v-slot:error>
                  <div
                    class="absolute-full flex flex-center text-white"
                  >Wir konnten dein Bild leider nicht laden. Bitte gehe online, um dein Profilbild zu sehen.</div>
                </template>
              </q-img>
              <q-badge floating class="q-pa-none" style="background-color: transparent;">
                <q-btn round color="black" size="sm" icon="edit" @click="openUpload = true" />
              </q-badge>
            </div>

            <q-card-section class="row">
              <div
                class="col-8 text-h5 text-weight-light text-left q-mt-none q-mb-xs custom-overline c-o-1 c-o-l c-o-sm"
              >
                {{username}}
                <q-btn dense icon="settings" flat size="sm">
                  <q-menu transition-show="jump-down" transition-hide="jump-up">
                    <q-list>
                      <q-item clickable disable>
                        <q-item-section>Mein Passwort ändern</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </div>
              <p class="col-4">
                <q-btn icon="select_all" @click="shareProfileQR = true" flat />
              </p>
            </q-card-section>
          </q-card>
        </div>
      </template>

      <template v-slot:after>
        <q-list class="shadow-2 rounded-borders">
          <q-item-label header class="q-pt-xs q-pb-xs text-uppercase text-caption">Statistik</q-item-label>
          <q-item>Fahrten angeboten: {{liftsOffered}}</q-item>
          <q-item>Fahrten gesamt: {{liftsAll}}</q-item>
          <q-item>Durchschnitt: {{liftAverage}}/W</q-item>

          <q-item-label header class="q-pt-xs q-pb-xs text-uppercase text-caption">Dabei seit</q-item-label>
          <q-item>{{since}}</q-item>
        </q-list>
      </template>
    </q-splitter>

    <qrGen @close="shareProfileQR = false" :show="shareProfileQR" :input="secureInput" />

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
              <p class="text-uppercase text-caption q-mb-none col-10">Kurzbeschreibung</p>
              <div class="col-2">
                <q-btn size="sm" flat color="black" icon="edit" @click="toggleOpenEditDescription" />
              </div>
              <div class="q-pa-sm">{{description}}</div>
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
                    {{liftMaxDistance}} km
                    <q-btn size="sm" flat @click="toggleEditLiftMaxDistance" icon="edit" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <br />
          <SignOutButton />
        </q-tab-panel>

        <q-tab-panel name="reservoir">
          <div class="q-mt-sm q-pa-sm shadow-1">
            <div class="row">
              <p class="col-5 text-uppercase text-caption q-mt-none q-mb-xs">Meine Addressen</p>
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
            >Du hast noch keine Addressen hinzugefügt</div>
            <q-list>
              <div class="row" v-for="item in addresses" :key="item.id">
                <q-item class="col-10">
                  <q-item-section class="q-pl-md" style="border-left: 1px solid lightgray">
                    <q-item-label>{{item.street}} {{item.number}}</q-item-label>
                    <q-item-label caption>{{item.postcode}} {{item.city}}</q-item-label>
                  </q-item-section>
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
                    <div class="text-h6">{{item.brand}}</div>
                    <div class="text-caption">
                      {{item.model}}
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
                      @click="updateProfilePicture(fileBlob)"
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
                Aktuell kannst du den Ausschnitt leider noch nicht selbst einstellen, wir arbeiten aber daran.
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
                <p class="text-h4 overflow">{{carInfo.brand}}</p>
                <p class="text-h6 text-weight-light">{{carInfo.model}}</p>
              </div>
            </div>
          </q-card-section>
          <extHR :color="carInfo.color ? carInfo.color : 'black'" size="xs" />
          <q-card-section class="q-pt-sm">
            <div class="q-pa-lg row">
              <p class="text-uppercase text-caption col-7">Fahrzeugtyp</p>
              <p class="col-5">{{carInfo.type}}</p>
              <p class="text-uppercase text-caption col-7">Freie Sitze</p>
              <p class="col-5">{{carInfo.seats}}</p>
              <p class="text-uppercase text-caption col-7">Kennzeichen</p>
              <p class="col-5">{{carInfo.licensePlate}}</p>
              <p class="text-uppercase text-caption col-7">Baujahr</p>
              <p class="col-5">{{carInfo.year}}</p>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>

      <q-dialog v-model="openEditPrefs" position="bottom" class="q-pa-md">
        <q-card class="q-pa-xs">
          <q-splitter :value="20">
            <template v-slot:before>
              <q-tabs
                v-model="openEditPrefsTab"
                vertical
                class="text-primary"
                style="min-height: 50vh;"
              >
                <q-tab name="talk" icon="record_voice_over" />
                <q-tab name="talkMorning" icon="alarm" />
                <q-tab name="smoking" icon="smoking_rooms" />
                <q-tab name="music" icon="music_note" />
              </q-tabs>
            </template>
            <template v-slot:after>
              <q-tab-panels
                v-model="openEditPrefsTab"
                swipeable
                animated
                vertical
                transition-prev="jump-down"
                transition-next="jump-up"
              >
                <q-tab-panel name="talk">
                  <div class="text-h6 q-mb-md">Redseligkeit</div>
                  <q-list>
                    <q-item tag="label" v-ripple>
                      <q-radio
                        keep-color
                        v-model="newPrefs.talk"
                        val="RED"
                        :label="prefsDocu.talk.red"
                        color="red"
                      />
                    </q-item>
                    <q-item tag="label" v-ripple>
                      <q-radio
                        keep-color
                        v-model="newPrefs.talk"
                        val="YELLOW"
                        :label="prefsDocu.talk.yellow"
                        color="orange"
                      />
                    </q-item>
                    <q-item tag="label" v-ripple>
                      <q-radio
                        keep-color
                        v-model="newPrefs.talk"
                        val="GREEN"
                        :label="prefsDocu.talk.green"
                        color="green"
                      />
                    </q-item>
                  </q-list>
                </q-tab-panel>

                <q-tab-panel name="talkMorning">
                  <div class="text-h6 q-mb-md">...am Morgen</div>
                  <q-list>
                    <q-item tag="label" v-ripple>
                      <q-radio
                        keep-color
                        v-model="newPrefs.talkMorning"
                        val="RED"
                        :label="prefsDocu.talkMorning.red"
                        color="red"
                      />
                    </q-item>
                    <q-item tag="label" v-ripple>
                      <q-radio
                        keep-color
                        v-model="newPrefs.talkMorning"
                        val="YELLOW"
                        :label="prefsDocu.talkMorning.yellow"
                        color="orange"
                      />
                    </q-item>
                    <q-item tag="label" v-ripple>
                      <q-radio
                        keep-color
                        v-model="newPrefs.talkMorning"
                        val="GREEN"
                        :label="prefsDocu.talkMorning.green"
                        color="green"
                      />
                    </q-item>
                  </q-list>
                </q-tab-panel>

                <q-tab-panel name="smoking">
                  <div class="text-h6 q-mb-md">Rauchen im Auto</div>
                  <q-list>
                    <q-item tag="label" v-ripple>
                      <q-radio
                        keep-color
                        v-model="newPrefs.smoking"
                        val="RED"
                        :label="prefsDocu.smoking.red"
                        color="red"
                      />
                    </q-item>
                    <q-item tag="label" v-ripple>
                      <q-radio
                        keep-color
                        v-model="newPrefs.smoking"
                        val="YELLOW"
                        :label="prefsDocu.smoking.yellow"
                        color="orange"
                      />
                    </q-item>
                    <q-item tag="label" v-ripple>
                      <q-radio
                        keep-color
                        v-model="newPrefs.smoking"
                        val="GREEN"
                        :label="prefsDocu.smoking.green"
                        color="green"
                      />
                    </q-item>
                  </q-list>
                </q-tab-panel>

                <q-tab-panel name="music">
                  <div class="text-h6 q-mb-md">Musik im Auto</div>
                  <q-list>
                    <q-item tag="label" v-ripple>
                      <q-radio
                        keep-color
                        v-model="newPrefs.music"
                        val="RED"
                        :label="prefsDocu.music.red"
                        color="red"
                      />
                    </q-item>
                    <q-item tag="label" v-ripple>
                      <q-radio
                        keep-color
                        v-model="newPrefs.music"
                        val="YELLOW"
                        :label="prefsDocu.music.yellow"
                        color="orange"
                      />
                    </q-item>
                    <q-item tag="label" v-ripple>
                      <q-radio
                        keep-color
                        v-model="newPrefs.music"
                        val="GREEN"
                        :label="prefsDocu.music.green"
                        color="green"
                      />
                    </q-item>
                  </q-list>
                </q-tab-panel>
              </q-tab-panels>
            </template>
          </q-splitter>
          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Abbrechen" @click="toggleOpenEditPrefs(false)" v-close-popup />
            <q-btn flat label="Speichern" @click="toggleOpenEditPrefs(true)" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="openNewAddress" position="bottom" persistent>
        <q-card>
          <q-form @submit="addAddress" class="q-gutter-md">
            <q-card-section class="text-h6 text-weight-light">Eine Addresse hinzufügen</q-card-section>

            <q-card-section>
              <div class="row">
                <div class="col-7">
                  <q-input
                    v-model="newAddress.street"
                    type="text"
                    label="Straße"
                    lazy-rules
                    :rules="[ val => val && val.length > 0 || 'Bitte gib eine Straße ein']"
                  />
                </div>
                <div class="col-5">
                  <q-input
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
                  class="col-5"
                  v-model="newAddress.postcode"
                  type="number"
                  label="Postleitzahl"
                  lazy-rules
                  :rules="[ val => val && ('' + val).length == 5 || 'Fünf Stellen bitte']"
                />

                <q-input
                  class="col-7"
                  type="text"
                  v-model="newAddress.city"
                  label="Stadt"
                  lazy-rules
                  :rules="[
          val => val !== null && val !== '' || 'Ohne Stadt können wir lange suchen...'
        ]"
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
            <q-stepper v-model="openNewCarTab" ref="stepper" color="primary" animated swipeable>
              <q-step :name="1" title="Marke" icon="home" :done="openNewCarTab > 1">
                <q-select
                  v-model="newCar.brand"
                  label="Marke auswählen"
                  hint="Von welcher Marke ist dein Auto?"
                  :options="newCarOptions.cars ? Object.keys(newCarOptions.cars) : []"
                  behavior="menu"
                  @input="$refs.stepper.next()"
                />
                <p
                  class="text-caption q-mt-md q-mb-none"
                >Wenn deine Marke nicht dabei ist, schreib uns bitte umgehend.</p>
              </q-step>

              <q-step :name="2" title="Typ" icon="rv_hookup" :done="openNewCarTab > 2">
                <q-select
                  v-model="newCar.type"
                  :label="newCar.brand ? 'Typ auswählen' : 'Wähle zuerst eine Marke aus'"
                  hint="Versuche, dein Auto einzuordnen"
                  :options="newCar.brand ? Object.keys(newCarOptions.cars[newCar.brand]) : []"
                  behavior="menu"
                  @input="$refs.stepper.next()"
                />
              </q-step>

              <q-step :name="3" title="Modell" icon="rv_hookup" :done="openNewCarTab > 3">
                <q-select
                  v-model="newCar.model"
                  :label="(newCar.brand && newCar.type) ? 'Modell auswählen' : 'Wähle zuerst Marke und Typ aus'"
                  hint="Und welches Modell?"
                  :options="(newCar.brand && newCar.type) ? newCarOptions.cars[newCar.brand][newCar.type] : []"
                  behavior="menu"
                  @input="$refs.stepper.next()"
                />
                <!-- <p
                  class="text-caption q-mt-md q-mb-none"
                >Wenn dein Modell nicht dabei ist, nimm bitte ein ähnliches und und schreib uns das fehlende Modell.</p>-->
              </q-step>

              <q-step :name="4" title="Farbe" icon="brush" :done="openNewCarTab > 4">
                <p class="text-caption">Wähle zuerst den Farbton und dann die Farbe</p>
                <q-splitter :value="50">
                  <template v-slot:before>
                    <q-list
                      style="max-height: 40vh;"
                      separator
                      class="full-height overflow-auto q-pr-sm"
                    >
                      <q-item
                        v-for="item in Object.keys(newCarOptions.colors)"
                        :key="item"
                        clickable
                        v-ripple
                        class="bg-white text-black q-ma-none"
                        :active="newCar.colorTone ? newCar.colorTone == item : false"
                        @click="newCar.colorTone = item"
                      >
                        <!-- <q-item-section avatar>
                            <q-icon name="inbox" />
                        </q-item-section>-->

                        <q-item-section>{{capitalize(item)}}</q-item-section>
                      </q-item>
                    </q-list>
                  </template>

                  <template v-slot:after>
                    <div v-if="newCar.colorTone">
                      <q-list style="max-height: 40vh;" class="full-height overflow-auto">
                        <q-item
                          v-for="item in Object.keys(newCarOptions.colors[newCar.colorTone])"
                          :key="item"
                          clickable
                          @click="newCar.color = item"
                          v-ripple
                          :class="'bg-' + newCarOptions.colors[newCar.colorTone][item] + ' text-' + (newCarOptions[0] == newCar.colorTone ? 'primary' : 'black')"
                        >
                          <!-- <q-item-section avatar>
                            <q-icon name="inbox" />
                          </q-item-section>-->

                          <q-item-section>{{capitalize(item)}}</q-item-section>
                        </q-item>
                      </q-list>
                    </div>

                    <div v-else class="flex flex-center">
                      <p class="text-caption">Bitte wähle einen Farbton aus</p>
                    </div>
                  </template>
                </q-splitter>
                <extHR
                  v-if="newCar.colorTone && newCar.color"
                  :color="newCarOptions.colors[newCar.colorTone][newCar.color]"
                  size="xs"
                ></extHR>
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
                  placeholder="A-bC-202"
                  v-model="newCar.licensePlate"
                  label="Nummernschild"
                  hint="Das können Nutzer nur dann sehen, wenn sie mit dir mitfahren."
                />
                <q-slide-transition>
                  <p
                    class="text-negative q-mt-md"
                    v-show="!checkValidNumberPlate()"
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
          <!-- <q-card-section>
            <p class="text-caption">
              Falls du nochmal nachlesen willst:
              <a
                href="https://mi.com"
                class="block"
              >Info zu unserer Datenverarbeitung</a>
            </p>
            
          </q-card-section>-->
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
                Unser Team überprüft außerdem jedes neue Modell in unserer Datenbank. Bei Verdacht auf Spam blockieren wir im Zweifelsfall den jeweiligen Benutzer.
                <br />Allen anderen aber danken wir, dass sie uns helfen, unsere Datenbank zu erweitern.
                <br />
                <br />Und falls noch nicht geschehen: Überflieg am besten noch kurz unsere
                <a
                  href="https://mi.com"
                >Datenverarbeitung</a>.
              </p>
            </q-expansion-item>
          </q-card-section>

          <q-card-section class="row">
            <div class="col-7 text-h5">{{newCar.brand}}</div>
            <div class="col-5 text-h6 text-weight-light">{{newCar.model}}</div>
          </q-card-section>

          <q-card-section>
            <extHR
              :color="newCar.color && newCar.colorTone ? newCarOptions.colors[newCar.colorTone][newCar.color] : 'black'"
              size="xs"
            />

            <div class="q-pa-lg row">
              <p class="text-uppercase text-caption col-7">Fahrzeugtyp</p>
              <p class="col-5">{{newCar.type}}</p>

              <p class="text-uppercase text-caption col-7">Freie Sitze</p>
              <p class="col-5">{{newCar.seats}}</p>

              <p class="text-uppercase text-caption col-7">Kennzeichen</p>

              <p
                :class="'col-5' + (checkValidNumberPlate() ? ' text-negative' : '')"
              >{{newCar.licensePlate}}</p>

              <p class="text-uppercase text-caption col-7">Baujahr</p>
              <p class="col-5">{{newCar.year}}</p>
            </div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Bearbeiten" @click="openAddCarConfirm = false" v-close-popup />
            <q-btn
              color="primary"
              label="Auto hinzufügen"
              :disabled=" false/* !(newCarFilled && checkValidNumberPlate()) */ "
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
import SignOutButton from "../components/SignOutButton";
import { buildGetRequestUrl, GET_USER_PROFILE_PIC, sendApiRequest, SQL_UPDATE_PROFILE_PICTURE, GET_CAR_MODELS } from "../ApiAccess";
import qrGen from '../components/qrGenerator'
import extHR from '../components/extended_hr'



export default {
  components: { SignOutButton,
  qrGen,
  extHR },

  data() {
    return {
      since: date.formatDate( // user statistics, cannot directly be changed by user
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
            "Dezember"
          ]
        }
      ),
      liftsOffered: this.$store.getters["auth/user"].stats.liftsOffered,
      liftsAll: this.$store.getters["auth/user"].stats.liftsAll,
      username:  this.$store.getters['auth/user'].name.split(' ')[0],
      liftAverage: 5,
      newLiftMaxDistance: 0, // basic profile settings
      editDistance: false,
      genderOptions: [
        "Männlich",
        "Weiblich",
        "Divers"
      ],
      openEditDescription: false,
      newDescription: '',
      ppPath: "",
      shareProfileQR: false,
      openUpload: false,
      file: null,
      fileBlob: null,

			openEditPrefs: false, // prefs settings
			openEditPrefsTab: 'talk',
			newPrefs: {
        talk: '',
        talkMorning: '',
        smoking: '',
        music: ''
      },
      prefsDocu: this.$store.state.prefsDocu,
      
			openEditAddresses: false, // addresses settings
			openNewAddress: false,
			newAddress: {
				street: '',
				number: '',
				postcode: '',
				city: ''
      },

      carInfo: { // cars settings
        brand: '',
        model: '',
        type: '',
        color: '',
        licensePlate: '',
        seats: 0
      },
      carInfoOpen: false,
      newCar: {
        brand: '',
        type: '',
        model: '',
        color: '',
        colorTone: '',
        year: 'XXXX',
        seats: 3,
        licensePlate: ''
      },
      newCarOptions: {
        cars: { // meanwhile just example values, will be overwritten when fetched data from server
          Audi: {
            Kombi: []
          },
          Mercedes: {
            Kombi: []
          }
        },
        colors: {
          rottöne: {
            rot: 'red'
          }
        }
      },
      openNewCarTab: 1,
      openEditCars: false,
      openAddCar: false,
      openAddCarConfirm: false,
      
      tab: 'data', // vue models which doesn't belong to specific function
    }
  },
  computed: {
    gender: {
      get() {
        switch (this.$store.getters["auth/user"].gender) {
          case "W":
            return "Weiblich"
          case "M":
            return "Männlich"
          case "D":
            return "Divers"
          default:
            return "Ein Fehler ist aufgetreten";
        }
      },
      set(value) {
        this.$store.dispatch("auth/updateGender", value)
      }
    },

    liftMaxDistance: {
      get(){
        return this.$store.getters["auth/user"].settings.liftMaxDistance
      },
      set(value){
        this.$store.dispatch("auth/updateLiftMaxDistance", value);
      }
    },

    description: {
      get(){
        return this.$store.getters["auth/user"].description
      },
      set(value){
        this.$store.dispatch("auth/updateDescription", value);
      }
		},

		prefs: {
			get(){
				return this.$store.getters["auth/user"].prefs
			},
			set(value){
				this.$store.dispatch("auth/updatePrefs", value);
			}
    },
    
		addresses: {
			get(){
				return this.$store.getters['auth/user'].addresses
			}
		},

		cars: {
			get(){
				return this.$store.getters['auth/user'].cars
			}
		},

    atLeastFiveWords(){
      if(this.username == 'Bernd'){
        return true
      }
      else{
        var splitted = this.newDescription.split(' ')
        var length = splitted.length
        var lastItemIsWord = splitted[length - 1] != ''
        return length > 5 ? true : (length >= 5) && lastItemIsWord // when more than 5 words, just return true
      }
		},

		secureInput(){
			let id = this.$store.getters['auth/user'].uid
			var alphabet = "qwertzuiopasdfghjklyxcvbnm1234567890"
      let letter
			do{
				letter = alphabet[Math.floor(Math.random() * alphabet.length)]
			}
			while(letter.charCodeAt(0) % 9 != 0) // 9 people working on the project
			return id + letter
    },
    
    getNewCarColorOptions(){
      return this.newCarOptions.colors.map(color => '<div style="border: 1px solid black; border-width: 1px 0;" class="text-transparent bg-' + color.toLowerCase() + '">.</div>')
    },

    possibleBuildYears(){
      var reverse = true
      let years = []
      for(var i=1940; i<=(new Date).getFullYear(); i++){
        years.push(i)
      }
      return reverse ? years.reverse() : years
    },

    newAddressFilled(){
      for(let key in this.newAddress){
        if(!this.newAddress[key]) return false
      }
      return true
    },

    newCarFilled(){
      for(let key in this.newCar){
        if(!this.newCar[key]) return false
      }
      return true
        
    }
  },
  methods: {

    toggleOpenEditDescription(){
      if(this.openEditDescription){ // already open
        this.description = this.newDescription
      }
      else { // still closed
         this.newDescription = this.description
      }
      this.openEditDescription = !this.openEditDescription
    },

    toggleEditLiftMaxDistance(){
      if(this.editDistance){ // already open
        this.liftMaxDistance = this.newLiftMaxDistance
      }
      else { // still closed
         this.newLiftMaxDistance = this.liftMaxDistance
      }
      this.editDistance = !this.editDistance
		},
		
		toggleOpenEditPrefs(){
			if(this.openEditPrefs){ // open, shall be closed, so prefs have to be converted and stores back to original var 
        this.prefs = this.newPrefs
      }
			else { // still closed, shall be opened, so we have to copy (and first convert) prefs to another var
			
				this.newPrefs = this.prefs
      }
      this.openEditPrefs = !this.openEditPrefs
    },

    betterPrefColor(color){
      if(color == 'GREEN') return 'green-8'
      else if(color == 'YELLOW') return 'orange'
      else return color.toLowerCase()
    },

    showCarInfo(item){
      for(let key in item){
        this.carInfo[key] = item[key]
			}
      this.carInfoOpen = true
    },
		
		addAddress(){
			this.$store.dispatch("auth/addAddress", {
				id: this.$store.getters['auth/user'].id,
				address: this.newAddress
			})
			this.newAddress = {
				street: '',
				number: '',
				postcode: '',
				city: ''
			}
		},

		removeAddress(id){
			if(id) this.$store.dispatch("auth/removeAddress", id)
    },
    
    async addCar(){
      let id = this.$store.getters['auth/user'].id
      let car = this.newCar
      
      await this.$store.dispatch("auth/addCar", JSON.parse(JSON.stringify({
          id: id,
          car: car
      })))
      

      for(let key in this.newCar){
        this.newCar[key] = key != 'seats' ? '' : 3; // original state, 3 seats look better than 0, it's the default value when selecting the seats.
      }
      this.openAddCar = false
      this.openAddCarConfirm = false
      
    },

    removeCar(id){
      if(id) this.$store.dispatch("auth/removeCar", id)
    },

    addRandomCar(){
      this.newCar.brand = this.randomItemFromArray(Object.keys(this.newCarOptions.cars))
      this.newCar.type = this.randomItemFromArray(Object.keys(this.newCarOptions.cars[this.newCar.brand]))
      this.newCar.model = this.randomItemFromArray(this.newCarOptions.cars[this.newCar.brand][this.newCar.type])
      this.newCar.colorTone = this.randomItemFromArray(Object.keys(this.newCarOptions.colors))
      this.newCar.color = this.randomItemFromArray(Object.keys(this.newCarOptions.colors[this.newCar.colorTone]))
      this.newCar.seats = this.randomItemFromArray([1,2,3,4,5,6,7])
      this.newCar.year = this.randomItemFromArray([2020,2019,2018,2017,2016,2015])

      let validPlate = true
      this.newCar.licensePlate = validPlate ? 'B AA 2001' : 'B SS 2330'
      this.openAddCarConfirm = true
      
    },

    loadFile(file) {
      this.file = file
      const size = 300; // represents the height
      const ratio = 1; // default ratio at profile pictures

      const width = size * ratio;
      const fileName = file.name;
      const reader = new FileReader();
      reader.onerror = error => console.log(error);
      reader.readAsDataURL(file);
      reader.onload = event => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
          const elem = document.getElementById("newImage")
          elem.width = width;
          elem.height = size;


          const ctx = elem.getContext("2d");
          if (img.width >= img.height) {
            // landscape or square: width has to be cropped
            var scale = img.height / size;
            var indent = (img.width - img.height) / scale; // indent has to be half of the difference and negative, additionally divided by scale
            ctx.drawImage(img, indent / -2, 0, width + indent, size);
          } else {
            // portrait
            var scale = img.width / size;
            var indent = (img.height - img.width) / scale; // indent has to be half of the difference and negative, additionally divided by scale
            ctx.drawImage(img, 0, indent / -2, width, size + indent);
          }
          try{
            this.fileBlob = elem.toBlob()
          }
          catch(e){
            alert('Die Konvertierung hat nicht funktioniert. E:' + e)
          }
        }, reader.onerror = error => {
          alert(error)
        }
      }

          // input image is made square and scaled
    //       sendApiRequest(
    //         SQL_UPDATE_PROFILE_PICTURE,
    //         { imageData: elem.toDataURL() },
    //         _ => {
    //           this.ppPath = '';
    //           buildGetRequestUrl(
    //             GET_USER_PROFILE_PIC,
    //             { fbid: this.$store.getters["auth/user"].uid },
    //             url => {
    //               this.ppPath = url;
    //             }
    //           )
    //         },
    //         error => {
    //           throw error;
    //         }
    //         else { // portrait
    //           var scale = img.width / size
    //           var indent  = (img.height - img.width) / scale // indent has to be half of the difference and negative, additionally divided by scale
    //           ctx.drawImage(img, 0, indent / -2, width, size + indent)
    //         }

    //         var image_blob = elem.toBlob()
    //         this.updateProfilePicture(image_blob)
    //         // input image is made square and scaled
            
            
    //         console.log(elem.toBlob())
    //         console.log(elem)
    //           },
    //           reader.onerror = error => console.log(error);
    //   };
    //       );
    //       this.openUpload = false;
    //     }
    //   }
    //   reader.readAsDataURL(file);
    },


    updateProfilePicture(blob) {
      sendApiRequest(SQL_UPDATE_PROFILE_PICTURE,
      {imageData: blob},
      _ => console.warn('success'),
      error => {throw error})
    },

    capitalize(string){
      return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
    },

    
    checkValidNumberPlate(){
      // only for development: 
      let alwaysOk = true
      

      // real logic:
      if(alwaysOk){
        return true
      }
      else {
        // Unicode Table: BIG letters: 65-90, small letters: 97-122

        let splits = plate.split('-')
        var threeParts = () => {
          splits.forEach(string => {
            if(!string) return false
          })
          return true
        }
        try{
          let correctSplits = splits.length == 3
          let correctCityLength = splits[0].length > 0 && splits[0].length < 4
          let correctNameLength = splits[1].length > 0 && splits[1].length < 3
          
          let cityAndNameInLetters = () => {
            (splits[0] + splits[1]).forEach(char, index => {
              let code = charCodeAt(index)
              let isLetter = ((code >= 65 && code <= 90) || (code >= 97 && code <= 122))
              if(!isLetter) return false
            })
            return true
          }
          
          let correctNumberLength = () => {
            try{
              var number = parseInt(splits[2])
              return number > 0 && number < 10000
            }
            catch(e){
              return false // maybe letters given
            }
          }

          if(threeParts && correctSplits && correctCityLength && correctNameLength && cityAndNameInLetters && correctNumberLength){
            return true
          }
          else {
            return false
          }
        }
        catch(e){ // all the arrays which cause an error
          return false
        }
      }
    },

    randomItemFromArray(array){
      return array[Math.floor(Math.random() * array.length)]
    }
  },
  mounted() {
    buildGetRequestUrl(
      GET_USER_PROFILE_PIC,
      { fbid: this.$store.getters["auth/user"].uid },
      url => {
        this.ppPath = url;
      }
    )
    
    sendApiRequest(GET_CAR_MODELS,
    {},
    data => {
      this.newCarOptions = data
      },
    error => {throw error})

    this.$store.state.pageName = 'Profil'
  }
};
</script>