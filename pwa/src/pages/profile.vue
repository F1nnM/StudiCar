<template>
  <div>
    <TitleButtonAnchor class="q-mt-md q-mr-md">
      <q-btn :icon="groupIcon" label="Freunde" no-caps outline color="primary" />
      <!-- <q-btn-toggle
        v-model="statsFriendsTab"
        rounded
        outline
        toggle-color="primary"
        color="grey-5"
        :options="[
                { value: 'stats', slot: 'stats' },
                { value: 'friends', slot: 'friends' },
              ]"
      >
        <template v-slot:stats>
          <q-icon name="bar_chart" size="xs" />
        </template>
        <template v-slot:friends>
          <q-icon name="people_alt" size="xs" />
        </template>
      </q-btn-toggle>-->
    </TitleButtonAnchor>

    <ProfileTopSection :username="username" :stats="stats" />

    <div class="q-py-sm q-px-none">
      <q-tabs
        v-model="tab"
        dense
        class="text-gray-7"
        active-color="gray"
        indicator-color="primary"
        align="justify"
      >
        <q-tab name="data" icon="person_outline" />
        <q-tab name="reservoir" icon="emoji_transportation" />
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
            <p class="text-uppercase text-caption q-mt-xs q-mb-xs">Über Mich</p>
            <div class="row q-py-md">
              <span class="text-caption text-grey-7 q-mb-none col-10">Kurzbeschreibung</span>
              <div class="col-2">
                <q-btn size="sm" flat color="black" icon="edit" @click="toggleOpenEditDescription" />
              </div>
              <div v-if="description">{{ description }}</div>
              <div v-else class="text-weight-light">- noch keine Beschreibung hinterlegt -</div>
            </div>

            <q-select
              v-model="gender"
              transition-show="jump-up"
              transition-hide="jump-up"
              :options="genderOptions"
              label="Geschlecht"
              behavior="menu"
              borderless
            />
          </div>

          <div class="q-mt-sm q-pa-sm shadow-1">
            <div class="row">
              <div class="col-6">
                <div class="text-uppercase text-caption q-mt-none q-mb-xs">
                  Präferenzen
                  <br />im Auto
                  <q-btn size="sm" flat @click="toggleOpenEditPrefs" icon="edit" />
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
              <p
                class="col-5 text-uppercase text-caption q-mt-none q-mb-xs"
              >Meine Adresse{{ addresses.length != 1 ? 'n' : '' }}</p>
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
                style="transition: 0.1s"
                @click="openEditAddresses = !openEditAddresses"
                :icon="openEditAddresses ? 'done' : 'edit'"
              />
            </div>
            <!-- <q-slide-transition>
              <p v-show="openEditAddresses" dense class="q-ma-none text-caption">
                Hinweis: Deine Aktionen werden sofort synchronisiert, der Haken
                blendet nur die Knöpfe aus.
              </p>
            </q-slide-transition>-->
            <div
              v-if="!addresses.length"
              class="text-weight-light"
            >Du hast noch keine Adressen hinzugefügt</div>
            <q-list v-else>
              <div>
                <q-item v-for="item in addresses" :key="item.id">
                  <q-item-section>
                    <div class="row">
                      <q-item-label v-html="item.nickname" v-if="item.nickname"></q-item-label>
                      <q-item-label v-else>{{ item.city }}</q-item-label>
                      <q-icon
                        name="home"
                        size=".9em"
                        color="primary"
                        class="q-ml-sm"
                        v-if="!item.default"
                      />
                      <!-- <q-icon
                        name="roofing"
                        size=".9em"
                        color="primary"
                        class="q-ml-sm"
                      />-->
                    </div>

                    <q-item-label caption class="q-mt-xs">
                      <span>{{ item.street }} {{ item.number }}</span>
                      <span class="q-mx-xs">-</span>
                      <span>{{ item.postcode }} {{ item.city }}</span>
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side top>
                    <q-slide-transition>
                      <q-btn
                        v-if="openEditAddresses"
                        @click="removeAddress(item.id)"
                        flat
                        class="float-right"
                        icon="remove_circle_outline"
                        color="red"
                        size="md"
                      />
                    </q-slide-transition>
                  </q-item-section>
                </q-item>
              </div>
            </q-list>
          </div>
          <div class="q-mt-sm q-pa-sm shadow-1">
            <div class="row justify-between">
              <p
                class="text-uppercase text-caption q-mt-none q-mb-xs"
              >Mein{{ cars.length != 1 ? 'e' : '' }} Fahrzeug{{ cars.length != 1 ? 'e' : '' }}</p>

              <q-btn
                flat
                v-show="openEditCars"
                @click="openAddCar = true"
                dense
                icon="add"
                color="green"
              />

              <q-btn size="sm" flat @click="openEditCars = !openEditCars" icon="edit" />

              <!-- <q-slide-transition>
                <p v-if="openEditCars" dense class="q-ma-none text-caption">
                  Hinweis: Deine Aktionen werden sofort synchronisiert, der
                  Haken blendet nur die Knöpfe aus.
                  <br />
                </p>
              </q-slide-transition>-->
            </div>
            <div
              v-if="!cars.length"
              class="text-weight-light"
            >Du hast noch keine Fahrzeuge hinzugefügt</div>
            <div
              class="row justify-between nowrap full-width"
              v-for="item in cars"
              :key="item.licensePlate"
            >
              <CompactCarInfo :expandable="!openEditCars" :car="item" />
              <q-slide-transition>
                <div v-if="openEditCars">
                  <q-btn
                    @click="removeCar(item.carId, item.brand, item.model)"
                    flat
                    dense
                    icon="remove_circle_outline"
                    color="red"
                    size="md"
                  />
                </div>
              </q-slide-transition>
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

      <q-dialog v-model="editDistance" full-height full-width persistent>
        <q-card class="column full-height">
          <q-card-section class="q-pb-none">
            <div class="text-h6">Entfernung einstellen</div>
          </q-card-section>
          <q-card-section>
            <p class="text-caption">
              Wie weit soll deine Mitfahrgelegenheit maximal von dir entfernt
              sein?
              <br />
              <small>
                Bitte hab Verständnis, dass wir noch mit Luftlinien rechnen.
                Echte Routen sollen aber bald kommen.
              </small>
            </p>

            <q-slider
              v-model="newLiftMaxDistance"
              :min="5"
              :max="40"
              :step="5"
              snap
              label-always
              :label-value="newLiftMaxDistance + ' km'"
              color="primary"
            />
            <div style="min-height: 30vh"></div>
          </q-card-section>
          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn flat label="Speichern" @click="toggleEditLiftMaxDistance" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="carInfoOpen" position="bottom">
        <q-toolbar class="bg-white">
          <q-toolbar-title class="text-h6 custom-underline c-u-4 c-u-l c-u-md">Infos zum Fahrzeug</q-toolbar-title>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-toolbar>
        <div class="rounded-borders" :style="'border-top: 1px solid ' + carInfo.color">
          <CarInfo :car="carInfo" />
        </div>
      </q-dialog>

      <q-dialog v-model="openEditPrefs" persistent position="bottom" class="q-pa-md">
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
            <template v-slot:after style="height: 300px">
              <q-tab-panels
                v-model="openEditPrefsTab"
                swipeable
                animated
                vertical
                transition-prev="jump-down"
                transition-next="jump-up"
                style="height: 400px"
              >
                <q-tab-panel
                  v-for="cat in [
                    {
                      prop: 'talk',
                      label: 'Redseligkeit',
                    },
                    {
                      prop: 'talkMorning',
                      label: '... am Morgen',
                    },
                    {
                      prop: 'smoking',
                      label: 'Rauchen im Auto',
                    },
                    {
                      prop: 'music',
                      label: 'Musik im Auto',
                    },
                  ]"
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
                    :rules="[
                      (val) =>
                        (val && val.length > 0 && val.length <= 52) || 'Bitte gib eine Straße ein',
                    ]"
                  />
                </div>
                <div class="col-5">
                  <q-input
                    required
                    type="text"
                    v-model="newAddress.number"
                    label="Hausnummer"
                    lazy-rules
                    :rules="[
                      (val) =>
                        (val.length > 0 && val.length < 10) ||
                        'Bitte gib eine Hausnummer ein',
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
                  :rules="[
                    (val) =>
                      (val && ('' + val).length == 5) || 'Fünf Stellen bitte',
                  ]"
                />

                <q-input
                  required
                  class="col-7"
                  type="text"
                  v-model="newAddress.city"
                  label="Ort"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val !== null && val !== '') ||
                      'Ohne Stadt können wir lange suchen...',
                  ]"
                />
                <q-input
                  class="col-12"
                  type="text"
                  v-model="newAddress.nickname"
                  label="Beschreibung"
                  lazy-rules
                  :rules="[(val) => val.length <= 10 || 'Maximal 10 Zeichen']"
                  hint="Optional, wird groß vor der Adresse angezeigt."
                />
              </div>
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

      <q-dialog v-model="openAddCar" full-width position="bottom" persistent>
        <q-toolbar class="bg-white">
          <q-toolbar-title>Fahrzeug hinzufügen</q-toolbar-title>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-toolbar>

        <q-stepper
          header-nav
          contracted
          swipeable
          v-model="openNewCarTab"
          ref="stepper"
          color="primary"
          animated
        >
          <q-step
            :name="1"
            title="Marke"
            icon="home"
            :done="openNewCarTab > 1 || !!newCar.brand"
            :error="openNewCarTab > 1 && !newCar.brand"
          >
            <q-select
              v-model="newCar.brand"
              label="Marke auswählen"
              hint="Von welcher Marke ist dein Auto?"
              :options="newCarOptions ? Object.keys(newCarOptions) : []"
              behavior="menu"
              @input="$refs.stepper.next()"
            />
            <!-- <p class="text-caption q-mt-md q-mb-none">
                  Wenn deine Marke nicht dabei sein sollte, dann nimm bitte über die Team-Seite mit uns KOntak
            </p>-->
          </q-step>

          <q-step
            :name="2"
            title="Modell"
            icon="rv_hookup"
            :done="openNewCarTab > 2 || !!newCar.model"
            :error="openNewCarTab > 2 && !newCar.model"
          >
            <q-select
              v-model="newCar.model"
              :color="!newCar.brand ? 'negative' : 'dark'"
              :label="
                    newCar.brand
                      ? 'Modell auswählen'
                      : 'Wähle zuerst deine Marke aus'
                  "
              hint="Und welches Modell?"
              :options="newCar.brand ? newCarOptions[newCar.brand] : []"
              behavior="menu"
              @input="$refs.stepper.next()"
            />
            <!-- <p
                  class="text-caption q-mt-md q-mb-none"
            >Wenn dein Modell nicht dabei sein sollte, dann nimm bitte über die Teamseite mit uns Kontakt auf.</p>-->
          </q-step>
          <q-step
            :name="3"
            title="Typ"
            icon="directions_bus"
            :done="openNewCarTab > 3 || !!newCar.type"
            :error="openNewCarTab > 3 && !newCar.type"
          >
            <q-select
              v-model="newCar.type"
              label="Typ auswählen"
              hint="Versuche, dein Auto einzuordnen"
              :options="carTypeOptions"
              behavior="menu"
              @input="$refs.stepper.next()"
            />
          </q-step>

          <q-step
            :name="4"
            title="Farbe"
            icon="brush"
            :done="openNewCarTab > 4 || !!newCar.color"
            :error="openNewCarTab > 4 && !newCar.color"
          >
            <div class="text-caption">
              Anhand der Autofarbe können andere Nutzer dein Auto besser
              erkennen
            </div>
            <ImageColorPicker imageSrc="app-icon_color_preview.png" v-model="newCar.color" />
          </q-step>

          <q-step
            :name="5"
            title="Baujahr"
            icon="query_builder"
            :done="openNewCarTab > 5 || newCar.year != 'XXXX'"
            :error="openNewCarTab > 5 && newCar.year == 'XXXX'"
          >
            <q-select
              v-model="newCar.year"
              label="Baujahr auswählen"
              hint="In welchem Jahr wurde dein Auto gebaut?"
              :options="possibleBuildYears"
              behavior="menu"
              @input="$refs.stepper.next()"
            />
          </q-step>

          <q-step
            :name="6"
            title="Nummernschild"
            icon="money"
            :done="openNewCarTab > 6 || validNumberPlate()"
            :error="openNewCarTab > 6 && !newCar.licensePlate && !validNumberPlate()"
          >
            <q-input
              type="text"
              placeholder="HDH DH 2020"
              v-model="newCar.licensePlate"
              label="Nummernschild"
              hint="Das können Nutzer nur dann sehen, wenn sie mit dir mitfahren."
            />
            <q-slide-transition>
              <div v-if="!validNumberPlate()">
                <div class="text-negative q-mt-md">Noch keine gültige Eingabe</div>
              </div>
            </q-slide-transition>
          </q-step>

          <q-step
            :name="7"
            title="Sitze"
            icon="supervisor_account"
            :done="openNewCarTab > 7 && (typeof newCar.seats == 'number')"
            :error="openNewCarTab > 7 && newCar.seats == null"
          >
            <p>
              Wie viele Leute kannst du normalerweise noch
              <span class="text-bold">mitnehmen?</span>
            </p>
            <q-slider
              markers
              :thumb-path="'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'"
              :min="1"
              :max="9"
              snap
              :step="1"
              label
              label-always
              v-model="newCar.seats"
            />
            <p
              class="text-caption q-mt-lg"
            >Wir werden dich vor jeder Fahrt fragen, ob es dabei bleibt.</p>
          </q-step>
          <q-step :name="8" title="Überprüfen" icon="visibility">
            <p>Bitte vergewissere dich, dass die Daten korrekt und vollständig sind.</p>

            <CarInfo :car="newCar" />

            <br />
            <p>Wenn du ein Auto hinzufügst, erklärst du dich mit unseren AGBs und Datenschutzverordnung (im Hauptmenü in der linken Seitenleiste zu finden) einverstanden.</p>
          </q-step>

          <template v-slot:navigation>
            <q-stepper-navigation>
              <q-btn
                @click="
                      if (openNewCarTab < 8) {
                        $refs.stepper.next();
                      }
                      else addCar()
                    "
                color="primary"
                :label="openNewCarTab == 8 ? 'Hinzufügen' : 'Weiter'"
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
      </q-dialog>
    </div>
  </div>
</template>

<script>
import { date } from "quasar";
import ImageColorPicker from "components/ImageColorPicker";
import ProfileTopSection from "components/ProfileTopSection";
import ColoredMeter from "components/ColoredMeter";
import ExtHr from "../components/ExtendedHr";
import QrGen from "../components/QrGenerator";
import CarInfo from "../components/CarInfo";
import TitleButtonAnchor from "../components/TitleButtonAnchor";
import CompactCarInfo from "../components/CompactCarInfo";
import { mdiAccountGroupOutline } from "@quasar/extras/mdi-v5";

import {
  buildGetRequestUrl,
  GET_USER_PROFILE_PIC,
  sendApiRequest,
  SQL_UPDATE_PROFILE_PICTURE,
  GET_CAR_MODELS,
  SQL_RESET_PROFILE_PICTURE
} from "../ApiAccess";

export default {
  components: {
    ImageColorPicker,
    ProfileTopSection,
    CarInfo,
    TitleButtonAnchor,
    CompactCarInfo
  },

  data() {
    return {
      stats: this.$store.getters["auth/user"].stats,
      username: this.$store.getters["auth/user"].name.split(" ")[0],
      newLiftMaxDistance: 0, // basic profile settings
      editDistance: false,
      genderOptions: ["Männlich", "Weiblich", "Divers"],
      carTypeOptions: [
        "Kompaktwagen",
        "Kombi",
        "Limousine",
        "Cabrio",
        "SUV",
        "Sportwagen",
        "Transporter",
        "Pickup"
      ],
      openEditDescription: false,
      newDescription: "",

      openEditPrefs: false, // prefs settings
      openEditPrefsTab: "talk",
      newPrefs: {
        talk: "",
        talkMorning: "",
        smoking: "",
        music: ""
      },
      prefsDocu: this.$store.state.prefsDocu,

      openEditAddresses: false, // addresses settings
      openNewAddress: false,
      newAddress: {
        nickname: "",
        street: "",
        number: "",
        postcode: "",
        city: ""
      },

      carInfo: {
        // cars settings
        brand: "",
        model: "",
        type: "",
        color: "",
        licensePlate: "",
        seats: null
      },
      carInfoOpen: false,
      newCar: {
        brand: "",
        type: "",
        model: "",
        color: "",
        year: "XXXX",
        seats: 3,
        licensePlate: ""
      },
      newCarOptions: {},
      openNewCarTab: 1,
      openEditCars: false,
      openAddCar: false,
      openAddCarConfirm: false,
      groupIcon: mdiAccountGroupOutline,

      tab: "data" // vue models which doesn't belong to specific function
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
      }
    },

    liftMaxDistance: {
      get() {
        return this.$store.getters["auth/user"].settings.liftMaxDistance;
      },
      set(value) {
        this.$store.dispatch("auth/updateLiftMaxDistance", value);
      }
    },

    description: {
      get() {
        return this.$store.getters["auth/user"].bio;
      },
      set(value) {
        this.$store.dispatch("auth/updateDescription", value);
      }
    },

    prefs: {
      get() {
        return this.$store.getters["auth/user"].prefs;
      },
      set(value) {
        this.$store.dispatch("auth/updatePrefs", value);
      }
    },

    addresses: {
      get() {
        return this.$store.getters["auth/user"].addresses.filter(item => {
          return item.id > 3; // filter only private adresses, IDs 1 to 3 are reserved for schools
        });
      }
    },

    cars: {
      get() {
        return this.$store.getters["auth/user"].cars;
      }
    },

    dataSaver: {
      get() {
        return this.$store.getters["auth/user"].dataSaver;
      },
      set(value) {
        this.$store.dispatch("auth/updateDataSaver", value);
      }
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

    meterModelBefore() {
      var a = this.stats;
      return a.liftsOffered / a.liftsAll;
    }
  },
  methods: {
    validNumberPlate() {
      this.newCar.licensePlate = this.newCar.licensePlate.toUpperCase();
      var pattern = /[A-ZÄÖÜ]{1,3} [A-ZÄÖÜ]{1,2} \d{1,4}$/gm;
      var matches = this.newCar.licensePlate.match(pattern);
      return !!matches; // returns null if no matches, otherwise array, so have to double-negate it
    },

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
          this.prefs = this.newPrefs; // just to minimize traffic, prefs are only stored when clicking on save (respectively closing dialog)
          this.newPrefs = {
            talk: "",
            talkMorning: "",
            smoking: "",
            music: ""
          };
        } else {
          this.newPrefs = {
            // just to make sure
            talk: "",
            talkMorning: "",
            smoking: "",
            music: ""
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
      this.carInfo = item;
      this.carInfoOpen = true;
    },

    addAddress() {
      this.$store.dispatch("auth/addAddress", this.newAddress);
      this.newAddress = {
        nickname: "",
        street: "",
        number: "",
        postcode: "",
        city: ""
      };
    },

    removeAddress(id) {
      if (id) this.$store.dispatch("auth/removeAddress", id);
    },

    async addCar() {
      await this.$store.dispatch(
        "auth/addCar",
        JSON.parse(JSON.stringify(this.newCar))
      );

      for (let key in this.newCar) {
        this.newCar[key] = key != "seats" ? "" : 3; // original state, reset to blank form to continue. 3 seats look better than 0, it's the default value when selecting the seats.
      }
      this.openAddCar = false;
      this.openNewCarTab = 1;
      this.openAddCarConfirm = false;
    },

    removeCar(id, brand, model) {
      if (id)
        this.$q
          .dialog({
            title: "Entfernen",
            message: `Deinen ${brand} ${model} aus der Liste entfernen?`,
            cancel: true,
            persistent: true
          })
          .onOk(() => {
            this.$store.dispatch("auth/removeCar", id);
          });
    },

    addRandomCar() {
      this.newCar.brand = this.randomItemFromArray(
        Object.keys(this.newCarOptions)
      );
      this.newCar.type = this.randomItemFromArray(this.carTypeOptions);
      this.newCar.model = this.randomItemFromArray(
        this.newCarOptions[this.newCar.brand]
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
        2015
      ]);

      let validPlate = true;
      this.newCar.licensePlate = validPlate ? "HDH DH 2020" : "B SS 2330";
      this.openAddCarConfirm = true;
    },

    randomItemFromArray(array) {
      return array[Math.floor(Math.random() * array.length)];
    }
  },
  mounted() {
    var locArr = window.location.href.split("?tab=");
    this.tab = locArr.length > 1 ? locArr[1] : "data";

    sendApiRequest(
      GET_CAR_MODELS,
      {},
      data => {
        this.newCarOptions = data;
      },
      error => {
        throw error;
      }
    );

    this.$store.commit("setPage", {
      name: "Profil"
    });
  }
};
</script>