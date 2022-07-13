<template>
  <div>
    <div class="q-mt-sm q-pa-sm shadow-1">
      <div class="row">
        <p class="col-5 text-uppercase text-caption q-mt-none q-mb-xs">
          Meine Adresse{{ addresses.length != 1 ? 'n' : '' }}
        </p>
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
      <div v-if="!addresses.length" class="text-weight-light">
        Du hast noch keine Adressen hinzugefügt
      </div>
      <q-list v-else>
        <div>
          <q-item v-for="item in addresses" :key="item.id">
            <q-item-section>
              <div class="row">
                <q-item-label
                  v-html="item.nickname"
                  v-if="item.nickname"
                ></q-item-label>
                <q-item-label v-else>{{ item.city }}</q-item-label>
                <q-icon
                  name="home"
                  size="xs"
                  color="primary"
                  class="q-ml-sm"
                  v-if="item.isDefault"
                />
                <q-btn
                  icon="home"
                  flat
                  dense
                  size="xs"
                  color="grey-5"
                  class="q-ml-sm"
                  v-if="!item.isDefault && openEditAddresses"
                  @click="updateDefaultAddress(item.id)"
                />
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
        <p class="text-uppercase text-caption q-mt-none q-mb-xs">
          Mein{{ cars.length != 1 ? 'e' : '' }} Fahrzeug{{
            cars.length != 1 ? 'e' : ''
          }}
        </p>

        <q-btn
          flat
          v-show="openEditCars"
          @click="openAddCar = true"
          dense
          icon="add"
          color="green"
        />

        <q-btn
          size="sm"
          flat
          @click="openEditCars = !openEditCars"
          icon="edit"
        />

        <!-- <q-slide-transition>
                <p v-if="openEditCars" dense class="q-ma-none text-caption">
                  Hinweis: Deine Aktionen werden sofort synchronisiert, der
                  Haken blendet nur die Knöpfe aus.
                  <br />
                </p>
              </q-slide-transition>-->
      </div>
      <div v-if="!cars.length" class="text-weight-light">
        Du hast noch keine Fahrzeuge hinzugefügt
      </div>
      <div
        class="row justify-between text-no-wrap full-width"
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
    <q-dialog v-model="carInfoOpen" position="bottom">
      <q-toolbar class="bg-white">
        <q-toolbar-title class="text-h6 custom-underline c-u-4 c-u-l c-u-md"
          >Infos zum Fahrzeug</q-toolbar-title
        >
        <q-btn icon="close" flat round dense v-close-popup />
      </q-toolbar>
      <div
        class="rounded-borders"
        :style="'border-top: 1px solid ' + carInfo.color"
      >
        <CarInfo :car="carInfo" />
      </div>
    </q-dialog>

    <q-dialog v-model="openNewAddress" position="bottom" persistent>
      <q-card>
        <q-form @submit="addAddress" class="q-gutter-md">
          <q-card-section class="text-h6 text-weight-light"
            >Eine Adresse hinzufügen</q-card-section
          >

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
                      (val && val.length > 0 && val.length <= 52) ||
                      'Bitte gib eine Straße ein',
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
                    'Ohne Stadt kann StudiCar lange suchen...',
                ]"
              />
              <q-input
                class="col-12"
                type="text"
                v-model="newAddress.nickname"
                label="Private Beschreibung"
                lazy-rules
                :rules="[(val) => val.length <= 10 || 'Maximal 10 Zeichen']"
                hint="Optional, kann dir helfen Adressen leichter zu unterscheiden. Ist nur für dich selber sichtbar."
              />
            </div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn
              flat
              label="Abbrechen"
              @click="openNewAddress = false"
              color="primary"
            />
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

    <SettingScope
      :value="openAddCar"
      descriptionLabel="cool"
      property="Fahrzeug hinzufügen"
    >
      <!-- <q-dialog v-model="openAddCar" full-width position="bottom" persistent> -->

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
              newCar.brand ? 'Modell auswählen' : 'Wähle zuerst deine Marke aus'
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
            Anhand der Autofarbe können andere Nutzer dein Auto besser erkennen
          </div>
          <ImageColorPicker
            v-model="newCar.color"
          />
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
          :error="
            openNewCarTab > 6 && !newCar.licensePlate && !validNumberPlate()
          "
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
              <div class="text-negative q-mt-md">
                Noch keine gültige Eingabe
              </div>
            </div>
          </q-slide-transition>
        </q-step>

        <q-step
          :name="7"
          title="Sitze"
          icon="supervisor_account"
          :done="openNewCarTab > 7 && typeof newCar.seats == 'number'"
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
          <p class="text-caption q-mt-lg">
            StudiCar werden dich vor jeder Fahrt fragen, ob es dabei bleibt.
          </p>
        </q-step>
        <q-step :name="8" title="Überprüfen" icon="visibility">
          <p>
            Bitte vergewissere dich, dass die Daten korrekt und vollständig
            sind.
          </p>

          <CarInfo :car="newCar" />

          <br />
          <p>
            Wenn du ein Auto hinzufügst, erklärst du dich mit unseren AGBs und
            Datenschutzverordnung (im Hauptmenü in der linken Seitenleiste zu
            finden) einverstanden.
          </p>
        </q-step>

        <template v-slot:navigation>
          <q-stepper-navigation>
            <q-btn
              @click="
                if (openNewCarTab < 8) {
                  $refs.stepper.next();
                } else addCar();
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
    </SettingScope>
  </div>
</template>

<script setup>
import { useUserStore } from 'src/stores/user';

let openEditAddresses = false; // addresses settings
let openNewAddress = false;

let carTypeOptions = [
  'Kompaktwagen',
  'Kombi',
  'Limousine',
  'Cabrio',
  'SUV',
  'Sportwagen',
  'Transporter',
  'Pickup',
];

let newAddressDefault = {
  nickname: '',
  street: '',
  number: '',
  postcode: '',
  city: '',
};
let newAddress = { ...newAddressDefault };
let carInfoDefault = {
  // cars settings
  brand: '',
  model: '',
  type: '',
  color: '',
  licensePlate: '',
  seats: null,
};
let carInfo = { ...carInfoDefault };
let carInfoOpen = false;
let newCarDefault = {
  brand: '',
  type: '',
  model: '',
  color: '',
  year: 'XXXX',
  seats: 3,
  licensePlate: '',
};
let newCar = { ...newCarDefault };
let newCarOptions = {};
let openNewCarTab = 1;
let openEditCars = false;
let openAddCar = false;
let openAddCarConfirm = false;

const userStore = useUserStore();

function validNumberPlate() {
  newCar.licensePlate = newCar.licensePlate.toUpperCase();
  var pattern = /[A-ZÄÖÜ]{1,3} [A-ZÄÖÜ]{1,2} \d{1,4}$/gm;
  var matches = newCar.licensePlate.match(pattern);
  return !!matches; // returns null if no matches, otherwise array, so have to double-negate it
}

function showCarInfo(item) {
  carInfo = item;
  carInfoOpen = true;
}

function addAddress() {
  userStore.addAddress(newAddress);
  newAddress = { ...newAddressDefault };
}

function removeAddress(id) {
  if (id) userStore.removeAddress(id);
}

function updateDefaultAddress(id) {
  userStore.updateDefaultAddress(id);
}

async function addCar() {
  userStore.addCar(newCar);
  newCar = { ...newCarDefault };
  openAddCar = false;
  openNewCarTab = 1;
  openAddCarConfirm = false;
}

function removeCar(id, brand, model) {
  if (id)
    $q.dialog({
      title: 'Entfernen',
      message: `Deinen ${brand} ${model} aus der Liste entfernen?`,
      cancel: true,
      persistent: true,
    }).onOk(() => {
      userStore.removeCar(id);
    });
}

function addRandomCar() {
  newCar.brand = randomItemFromArray(Object.keys(newCarOptions));
  newCar.type = randomItemFromArray(carTypeOptions);
  newCar.model = randomItemFromArray(newCarOptions[newCar.brand]);
  newCar.color =
    '#' + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, '0'); // just random hex color
  newCar.seats = randomItemFromArray([1, 2, 3, 4, 5, 6, 7]);
  newCar.year = randomItemFromArray([2020, 2019, 2018, 2017, 2016, 2015]);

  let validPlate = true;
  newCar.licensePlate = validPlate ? 'HDH DH 2020' : 'B SS 2330';
  openAddCarConfirm = true;
}

const addresses = computed(() => {
  return userStore.user.addresses.filter((item) => {
    return item.id > 3; // filter only private adresses, IDs 1 to 3 are reserved for schools
  });
});

const cars = computed(() => {
  return userStore.user.cars;
});

const possibleBuildYears = computed(() => {
  var reverse = true;
  let years = [];
  for (var i = 1940; i <= new Date().getFullYear(); i++) {
    years.push(i);
  }
  return reverse ? years.reverse() : years;
});

const newAddressFilled = computed(() => {
  for (let key in newAddress) {
    if (!newAddress[key] && key != 'nickname') return false; // only nickname can be blank
  }
  return true;
});

onMounted(() => {
  api.sendApiRequest(
    api.GET_CAR_MODELS,
    {},
    (data) => {
      newCarOptions = data;
    },
    (error) => {
      throw error;
    }
  );
});
</script>

<style scoped></style>
