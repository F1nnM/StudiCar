<template>
  <div>
    <div
      v-if="!(hasOwnAddresses || hasOwnCars)"
      class="text-center flex column justify-center q-pa-lg"
      style="height: 50vh"
    >
      <q-item class="text-left">
        <q-item-section avatar>
          <q-icon name="warning" size="md" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Du kannst noch keine Angebote hinzufügen</q-item-label>
          <q-item-label caption v-if="!(hasOwnCars && hasOwnAddresses)"
            >Weder Fahrzeuge noch Adressen gespeichert
          </q-item-label>
          <q-item-label caption v-else-if="!hasOwnCars"
            >Noch keine Fahrzeuge gespeichert</q-item-label
          >
          <q-item-label caption v-else-if="!hasOwnAddresses"
            >Noch keine Adressen gespeichert</q-item-label
          >
        </q-item-section>
      </q-item>
      <q-item class="text-right">
        <q-item-section>
          <q-item-label>
            <q-btn
              icon="add"
              label="Zum Profil"
              class="q-mt-sm q-pr-sm"
              to="/profil?tab=reservoir"
              dense
              outline
            />
          </q-item-label>
        </q-item-section>
      </q-item>
    </div>
    <q-dialog
      v-else
      :model-value="true"
      :maximized="uploading == 0"
      persistent
      transition-show="slide-up"
      transition-hide="slide-down"
      @hide="goHome"
    >
      <q-tab-panels
        v-model="uploading"
        class="q-pa-none"
        animated
        transition-next="jump-up"
        transition-prev="flip-up"
      >
        <q-tab-panel :name="0" class="q-pa-none">
          <!-- screen for not uploading, normal editing -->

          <div class="bg-white">
            <div class="row">
              <span class="col-2"></span>
              <q-toolbar class="q-pt-md col-8">
                <q-toolbar-title class="text-center bg-white"
                  >Eine Fahrt anbieten</q-toolbar-title
                >
              </q-toolbar>
              <div class="col-2 bg-primary text-center">
                <q-btn
                  flat
                  size="md"
                  class="text-white full-height"
                  icon="close"
                  v-close-popup
                />
              </div>
            </div>

            <div class="q-pa-sm">
              <!-- <q-card v-show="uploading == -1">
          <q-card-section>
            <p>
              <q-icon name="error_outline" size="md" color="negative" />Beim Upload ist ein Fehler aufgetreten. Wenn das Problem öfter auftritt, dann
              <a
                href="#/contact"
              >schreib uns</a> bitte.
            </p>
          </q-card-section>
              </q-card>-->
              <q-stepper
                v-model="step"
                vertical
                class="overflow-scroll shadow-0"
                color="primary"
                animated
              >
                <q-step
                  :name="1"
                  title="Wähle dein Ziel aus"
                  icon="near_me"
                  :done="step > 1"
                >
                  <p class="text-caption">
                    Fährst du zur Hochschule oder nach Hause?
                  </p>
                  <q-list>
                    <q-item tag="label">
                      <q-item-section avatar>
                        <q-radio v-model="lift.destination" val="school" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>Zur Hochschule</q-item-label>
                        <q-item-label caption
                          >Du kannst dann noch auswählen, zu welchem Gebäude und
                          wo du losfährst.</q-item-label
                        >
                      </q-item-section>
                    </q-item>

                    <q-item tag="label">
                      <q-item-section avatar>
                        <q-radio v-model="lift.destination" val="home" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>Nach Hause</q-item-label>
                        <q-item-label caption
                          >Du kannst dann noch aus deinen Adressen auswählen und
                          wo du losfährst.</q-item-label
                        >
                      </q-item-section>
                    </q-item>
                  </q-list>

                  <q-stepper-navigation>
                    <q-btn @click="step++" color="primary" label="Weiter" />
                  </q-stepper-navigation>
                </q-step>

                <q-step
                  :name="2"
                  title="Genaue Adresse auswählen"
                  icon="location_on"
                  :done="step > 2"
                >
                  <p class="text-caption">Wo fährst du genau hin?</p>
                  <q-list>
                    <q-item
                      tag="label"
                      v-for="address in getExactAddresses"
                      :key="address.id"
                    >
                      <q-radio
                        v-model="lift.destinationAddressId"
                        :val="address.id"
                      />
                      <q-item-section v-show="getImagePath(address.id)" avatar>
                        <q-avatar rounded>
                          <img
                            class="shadow-3 q-ma-none"
                            :src="getImagePath(address.id)"
                          />
                        </q-avatar>
                      </q-item-section>

                      <q-item-section>
                        <q-item-label>{{
                          address.nickname
                            ? address.nickname
                            : 'nach ' + address.city
                        }}</q-item-label>
                        <q-item-label caption class="row">
                          <div class="overflow-hidden">
                            {{ address.street }} {{ address.number }}
                          </div>
                        </q-item-label>
                        <q-item-label caption class="row">
                          <div class="col-auto overflow-hidden">
                            {{ address.postcode }} {{ address.city }}
                          </div>
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                  <q-stepper-navigation>
                    <q-btn
                      flat
                      @click="stepDec"
                      color="primary"
                      label="Eins zurück"
                      class="q-ml-sm"
                    />
                    <q-btn
                      @click="stepInc"
                      color="primary"
                      :disable="!lift.destinationAddressId"
                      label="Weiter"
                    />
                  </q-stepper-navigation>
                </q-step>

                <q-step
                  :name="3"
                  title="Abfahrtsort festlegen"
                  icon="near_me"
                  :done="step > 3"
                >
                  <p class="text-caption">Und wo fährst du los?</p>
                  <q-list>
                    <q-item
                      tag="label"
                      v-for="address in getExactStartingPoints"
                      :key="address.id"
                    >
                      <q-radio
                        v-model="lift.startAddressId"
                        :val="address.id"
                      />
                      <q-item-section v-show="getImagePath(address.id)" avatar>
                        <q-avatar rounded>
                          <img
                            class="shadow-3 q-ma-none"
                            :src="getImagePath(address.id)"
                          />
                        </q-avatar>
                      </q-item-section>

                      <q-item-section>
                        <q-item-label>{{
                          address.nickname
                            ? address.nickname
                            : 'in ' + address.city
                        }}</q-item-label>
                        <q-item-label caption class="row">
                          <div class="overflow-hidden">
                            {{ address.street }} {{ address.number }}
                          </div>
                        </q-item-label>
                        <q-item-label caption class="row">
                          <div class="col-auto overflow-hidden">
                            {{ address.postcode }} {{ address.city }}
                          </div>
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                  <q-stepper-navigation>
                    <q-btn
                      flat
                      @click="stepDec"
                      color="primary"
                      label="Eins zurück"
                      class="q-ml-sm"
                    />
                    <q-btn
                      @click="stepInc"
                      :disable="!lift.startAddressId"
                      color="primary"
                      label="Weiter"
                    />
                  </q-stepper-navigation>
                </q-step>

                <q-step
                  :name="4"
                  title="Fahrzeug auswählen"
                  icon="emoji_transportation"
                  :done="step > 4"
                >
                  <p class="text-caption">Mit welchem Fahrzeug fährst du?</p>
                  <q-list>
                    <q-item
                      tag="label"
                      v-for="car in userCars"
                      :key="car.carId"
                      class="q-pr-none"
                    >
                      <q-radio v-model="lift.carId" :val="car.carId" />

                      <q-item-section>
                        <q-item-label>
                          {{ car.brand }} {{ car.model }}
                          <ExtHr
                            class="q-my-sm q-pr-xl"
                            hex
                            :color="car.color"
                            size="1px"
                          />
                        </q-item-label>
                        <q-item-label caption>
                          <q-icon name="person" size="xs" />
                          {{ car.seats }}
                          weitere Plätze
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                  <q-stepper-navigation>
                    <q-btn
                      flat
                      @click="stepDec"
                      color="primary"
                      label="Eins Zurück"
                      class="q-ml-sm"
                    />
                    <q-btn
                      @click="stepInc"
                      color="primary"
                      :disable="!lift.carId"
                      label="Weiter"
                    />
                  </q-stepper-navigation>
                </q-step>

                <q-step
                  :name="5"
                  title="Sitze bearbeiten"
                  icon="person_add"
                  :done="step > 5"
                >
                  <p class="text-caption">
                    Willst du die Anzahl an Mitfahrern für diese Fahrt ändern?
                    (Hinweis: Wenn du hier 0 beibehältst, dann speichert
                    StudiCar für diese Fahrt {{ getCarData.seats }} Mitfahrer,
                    also die übliche Kapazität dieses Fahrzeugs)
                  </p>
                  <q-item>
                    <q-item-section avatar>
                      <q-icon
                        color="primary"
                        name="edit"
                        v-if="lift.seats || getCarData.seats == lift.seats"
                      />
                      <q-icon color="primary" name="how_to_reg" v-else />
                    </q-item-section>
                    <q-item-section>
                      <q-slider
                        markers
                        v-model="lift.seats"
                        :min="0"
                        :max="9"
                        :step="1"
                        snap
                        label
                        label-always
                      />
                    </q-item-section>
                  </q-item>

                  <q-stepper-navigation>
                    <q-btn
                      flat
                      @click="stepDec"
                      color="primary"
                      label="Eins Zurück"
                      class="q-ml-sm"
                    />
                    <q-btn @click="stepInc" color="primary" label="Weiter" />
                  </q-stepper-navigation>
                </q-step>
                <q-step
                  :name="6"
                  title="Tag und Zeit festlegen"
                  icon="event"
                  :done="step > 6"
                >
                  <p class="text-caption">
                    Wähle aus, wann du planst zu fahren. Bei der Zeit ist immer
                    die Zeit an der DHBW gemeint.
                  </p>

                  <LiftEditDateTime v-model="lift" />

                  <q-stepper-navigation>
                    <q-btn
                      color="primary"
                      @click="stepDec"
                      label="Zurück"
                      flat
                    />
                    <q-btn
                      @click="stepInc"
                      color="primary"
                      :disable="lift.time == null || lift.date == 0"
                      label="Abschließen"
                      class="q-ml-sm"
                    />
                  </q-stepper-navigation>
                </q-step>

                <q-step
                  :name="7"
                  class="q-pr-none"
                  title="Überprüfen"
                  icon="visibility"
                  :done="step > 7"
                >
                  <p class="text-caption">
                    Wirf noch einen Blick auf die Übersicht, bevor du dein
                    Angebot veröffentlichst
                  </p>

                  <q-tabs
                    indicator-color="primary"
                    narrow-indicator
                    v-model="overviewTab"
                    dense
                    class="bg-white text-dark"
                  >
                    <q-tab name="route" icon="map" />
                    <q-tab name="car" icon="directions_car" />
                  </q-tabs>
                  <q-tab-panels v-model="overviewTab" class="q-pa-none q-mt-sm">
                    <q-tab-panel name="route" class="q-pa-none">
                      <q-item class="q-mb-sm">
                        <q-item-section>
                          <q-item-label>{{ startCity }}</q-item-label>
                          <q-icon
                            class="q-ml-md"
                            v-if="lift.destination == 'home'"
                            name="school"
                            size="xs"
                          />
                        </q-item-section>
                        <q-item-section class="text-center">
                          <q-item-label>
                            <div
                              v-if="lift.destination == 'home'"
                              class="text-primary"
                            >
                              <span class="text-subtitle2">|</span>
                              <q-icon name="arrow_forward" size="xs" />
                            </div>
                            <q-icon
                              v-else
                              name="keyboard_tab"
                              color="primary"
                              size="xs"
                            />
                          </q-item-label>
                          <q-item-label caption>
                            {{
                              lift.destination == 'home' ? 'Abfahrt' : 'Ankunft'
                            }}
                            <br />
                            um {{ lift.time }}
                          </q-item-label>
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>{{ destCity }}</q-item-label>
                          <q-icon
                            class="q-ml-md"
                            v-if="lift.destination == 'school'"
                            name="school"
                            size="xs"
                          />
                        </q-item-section>
                      </q-item>
                      <!-- <q-item dense>
                        <q-item-section avatar>
                          <q-icon
                            name="loop"
                            size="xs"
                            class="q-mr-xs"
                            v-if="lift.dateTab == 'weekly'"
                          />
                          <q-icon name="query_builder" size="xs" class="q-mr-xs" v-else />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label></q-item-label>
                        </q-item-section>
                      </q-item>-->
                    </q-tab-panel>
                    <q-tab-panel name="car" class="q-pa-none">
                      <CompactCarInfo :car="getCarData" compactView />
                    </q-tab-panel>
                  </q-tab-panels>

                  <q-stepper-navigation>
                    <q-btn
                      color="primary"
                      @click="stepDec"
                      label="Zurück"
                      flat
                    />
                    <q-btn
                      @click="addLift"
                      color="primary"
                      label="Veröffentlichen"
                      class="q-ml-sm"
                    />
                  </q-stepper-navigation>
                </q-step>
              </q-stepper>
            </div>
          </div>
        </q-tab-panel>
        <q-tab-panel :name="1" class="q-pa-none text-center">
          <q-card>
            <q-card-section>
              <q-circular-progress
                show-value
                font-size="16px"
                class="text-primary q-ma-md"
                indeterminate
                size="xl"
                :thickness="0.05"
                color="primary"
                track-color="white"
              >
                <q-icon name="publish" size="md" color="dark" />
              </q-circular-progress>
              <p>Dein Angebot wird veröffentlicht</p>
            </q-card-section>
          </q-card>
        </q-tab-panel>

        <q-tab-panel :name="2" class="q-pa-none text-center">
          <q-card>
            <q-card-section>
              <q-circular-progress
                show-value
                font-size="16px"
                class="text-primary q-ma-md"
                :value="uploadingDoneValue"
                size="xl"
                :thickness="0.05"
                color="primary"
                track-color="white"
              >
                <q-icon name="check" size="md" color="dark" />
              </q-circular-progress>
              <p>Dein Angebot ist jetzt online</p>
              <p class="text-caption q-mb-none">
                Du wirst automatisch zum Marktplatz weitergeleitet.
              </p>
            </q-card-section>
          </q-card>
        </q-tab-panel>
      </q-tab-panels>
    </q-dialog>
  </div>
</template>

<script setup>
import { useUserStore } from 'src/stores/user';
import { useAppStore } from 'src/stores/app';

import {date} from 'quasar';

const maxDaysAhead = 30;
const lift = ref({
  destination: 'school', // default set to school, user selects first home/school, then exact address
  destinationAddressId: 0,
  startAddressId: 0,
  carId: null,
  time: null,
  timeTab: 'arrive',
  date: 1,
  dateTab: 'weekly',
  seats: 0, // just to avoid error when rendering slider
  stops: [
    {
      addressId: 31,
      time: 1593684157000,
    },
    {
      addressId: 34,
      time: 1593684175000,
    },
  ],
});
const step = ref(1);
const uploading = ref(0); // 0 means not uploading, 1 means upload in progress, 2 means upload successful and -1 means error
const overviewTab = ref('route');
const uploadingDoneValue = ref(0);

function stepInc() {
  step.value = step.value + 1;
}

function stepDec() {
  step.value = step.value - 1;
}

const appStore = useAppStore();
const userStore = useUserStore();

watch(uploading, (newv) => {
  if (newv == 2) {
    setTimeout((_) => {
      uploadingDoneValue.value = 100;
    }, 100); // when uploading done, this value is set to 100 to make cool check animation possible
  } else uploadingDoneValue.value = 0;
});

const todayString = computed(() => {
  return date.formatDate(new Date(), 'YYYY/MM/DD');
});

const allAddresses = computed(() => {
  return userStore.user.addresses;
});

const hasOwnAddresses = computed(() => {
  return allAddresses.value.filter((item) => item.id > 3).length > 0;
});

const hasOwnCars = computed(() => {
  return userCars.value.length > 0;
});

const carOptions = computed(() => {
  let cars = [];
  for (let car of userCars.value) {
    cars.push(car.licensePlate + ' - ' + car.brand + ' ' + car.model);
  }
  return cars;
});

const userCars = computed(() => {
  return userStore.user.cars;
});

const getCarData = computed(() => {
  // returns data of selected car, so that user for example can see how many seats would be default
  let obj = userCars.value.find((item) => {
    return item.carId == lift.value.carId;
  });
  return obj
    ? obj
    : {
        seats: 0,
        color: 'white',
      }; // fallback when no car has been selected yet
});

const startCity = computed(() => {
  var start = lift.value.startAddressId || 1,
    address = allAddresses.value.find((a) => a.id == start);
  return address.city;
});

const destCity = computed(() => {
  var dest = lift.value.destinationAddressId || 1,
    address = allAddresses.value.find((a) => a.id == dest);
  return address.city;
});

const getExactAddresses = computed(() => {
  if (lift.value.destination == 'school') {
    return allAddresses.value.filter((item) => item.id < 4); // filter only the schools, which have IDs 1 to 3

    // a[0].imagePath = require(pathBegin + 'HDH_cube.jpg')
    // a[1].imagePath = require(pathBegin + 'HDH_old.jpg')
    // a[2].imagePath = require(pathBegin + 'WIB_ext.jpg')
  } else if (lift.value.destination == 'home') {
    return allAddresses.value.filter((item) => item.id > 3); // filter only private adresses, IDs 1 to 3 are reserved for schools
  }
  return null;
});

const getExactStartingPoints = computed(() => {
  if (lift.value.destination != 'school') {
    return allAddresses.value.filter((item) => item.id < 4); // filter only the schools, which have IDs 1 to 3
  } else if (lift.value.destination != 'home') {
    return allAddresses.value.filter((item) => item.id > 3); // filter only private adresses, IDs 1 to 3 are reserved for schools
  }
  return null;
});

const departing = computed(() => {
  var dest = lift.value.destination;
  if (dest == 'home') return true;
  else if (dest == 'school') return false;
  else return null;
});

function goHome() {
  window.location.href = '/#/';
}

function dateOptions(d) {
  var a = date.getDateDiff(d, new Date(), 'days');
  a = a < maxDaysAhead && a >= 0;
  return a;
}

async function addLift() {
  if (lift.value.seats == 0) {
    // case when user didn't want to change number of seats at this lift
    lift.value.seats = getCarData.seats;
  }
  uploading.value = 1;
  lift.value.departAt = departing;
  lift.value.timeTab = departing ? 'depart' : 'arrive';
  await userStore.addLift(lift.value);
  lift.value = {
    destination: 'school', // default set to school, user selects first home/school, then exact address
    destinationAddressId: 0,
    startingPoint: 0,
    car: null,
    seats: 0, // just to avoid error when rendering slider
  };
  uploading.value = 2;
  step.value = 1;

  await new Promise((res) => setTimeout(res, 1500)); // wait so that user can see success message
  goHome();
}

function getImagePath(id) {
  /* let pathBegin = "../assets/school_images/"; */
  switch (id) {
    case 1:
      return import('../assets/school_images/HDH_cube_resized.jpg');
    case 2:
      return import('../assets/school_images/HDH_old_resized.jpg');
    case 3:
      return import('../assets/school_images/WIB_ext_resized.jpg');
    default:
      return false; // When returning false, no image is shown as fallback.
  }
}

function getDataFromAddressId(id) {
  let data = userStore.user.addresses.find((item) => item.id == id);
  if (data) {
    if (!data.nickname) {
      // when no nickname saved, use city as nickname
      data.nickname = data.city;
    }
    return data;
  }
  return {
    nickname: null,
    street: null,
    city: null, // cases when no id has been set yet though method has been called
  };
}

function getCarFromId(id) {
  let data = null; // userCars.find(item => item.carId == id);
  if (data) return data;
  else
    return {
      brand: null,
      model: null, // similar case to above method
    };
}

function getStopTime(stamp) {
  return date.formatDate(stamp, 'H:mm');
}

onMounted(() => {
  appStore.setPage({
    name: 'Fahrt hinzufügen',
    onlyInNav: true,
  });
});
</script>

<style scoped lang="scss">
.overview {
  > .col-2 {
    border-right: 1px solid gray;
    padding-right: 5px;
  }

  > .col-10 {
    padding-left: 10px;
  }
}
</style>
