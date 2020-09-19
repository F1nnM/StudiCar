<template>
  <div class="q-pa-md">
    <p class="text-h6 text-center">Eine Fahrt anbieten</p>
    <q-card v-show="uploading == -1">
      <q-card-section>
        <p>
          <q-icon name="error_outline" size="md" color="negative" />Beim Upload ist ein Fehler aufgetreten. Wenn das Problem öfter auftritt, dann
          <a
            href="#/contact"
          >schreib uns</a> bitte.
        </p>
      </q-card-section>
    </q-card>
    <q-stepper v-model="step" vertical class="overflow-scroll" color="primary" animated>
      <q-step :name="1" title="Wähle dein Ziel aus" icon="near_me" :done="step > 1">
        <p class="text-caption">Fährst du zur Hochschule oder nach Hause?</p>
        <q-list>
          <q-item tag="label">
            <q-item-section avatar>
              <q-radio v-model="lift.destination" val="school" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Zur Hochschule</q-item-label>
              <q-item-label
                caption
              >Du kannst dann noch auswählen, zu welchem Gebäude und wo du losfährst.</q-item-label>
            </q-item-section>
          </q-item>

          <q-item tag="label">
            <q-item-section avatar>
              <q-radio v-model="lift.destination" val="home" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Nach Hause</q-item-label>
              <q-item-label
                caption
              >Du kannst dann noch aus deinen Adressen auswählen und wo du losfährst.</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>

        <q-stepper-navigation>
          <q-btn @click="step++" color="primary" label="Weiter" />
        </q-stepper-navigation>
      </q-step>

      <q-step :name="2" title="Genaue Adresse auswählen" icon="location_on" :done="step > 2">
        <p class="text-caption">Wo fährst du genau hin?</p>
        <q-list>
          <p class="text-caption text-red" v-if="!getExactAddresses.length">
            <!-- when shown, school cannot be selected, because then length would not be 0 -->
            Du hast noch keine Adressen hinterlegt, aus denen du auswählen könntest.
          </p>
          <q-item tag="label" v-for="address in getExactAddresses" :key="address.id">
            <q-radio v-model="lift.destinationAddressId" :val="address.id" />
            <q-item-section v-show="getImagePath(address.id)" avatar>
              <q-avatar rounded>
                <img class="shadow-3 q-ma-none" :src="getImagePath(address.id)" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label>{{address.nickname ? address.nickname : 'nach ' + address.city}}</q-item-label>
              <q-item-label caption class="row">
                <div class="overflow-hidden">{{address.street}} {{address.number}}</div>
              </q-item-label>
              <q-item-label caption class="row">
                <div class="col-auto overflow-hidden">{{address.postcode}} {{address.city}}</div>
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <q-stepper-navigation>
          <q-btn flat @click="step--" color="primary" label="Eins zurück" class="q-ml-sm" />
          <q-btn
            @click="step++"
            color="primary"
            :disable="!lift.destinationAddressId"
            label="Weiter"
          />
        </q-stepper-navigation>
      </q-step>

      <q-step :name="3" title="Abfahrtsort festlegen" icon="near_me" :done="step > 3">
        <p class="text-caption">Und wo fährst du los?</p>
        <q-list>
          <p class="text-caption text-red" v-if="!getExactStartingPoints.length">
            <!-- when shown, school cannot be selected, because then length would not be 0 -->
            Du hast noch keine Adressen hinterlegt, aus denen du auswählen könntest.
          </p>
          <q-item tag="label" v-for="address in getExactStartingPoints" :key="address.id">
            <q-radio v-model="lift.startAddressId" :val="address.id" />
            <q-item-section v-show="getImagePath(address.id)" avatar>
              <q-avatar rounded>
                <img class="shadow-3 q-ma-none" :src="getImagePath(address.id)" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label>{{address.nickname ? address.nickname : 'in ' + address.city}}</q-item-label>
              <q-item-label caption class="row">
                <div class="overflow-hidden">{{address.street}} {{address.number}}</div>
              </q-item-label>
              <q-item-label caption class="row">
                <div class="col-auto overflow-hidden">{{address.postcode}} {{address.city}}</div>
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <q-stepper-navigation>
          <q-btn flat @click="step--" color="primary" label="Eins zurück" class="q-ml-sm" />
          <q-btn @click="step++" :disable="!lift.startAddressId" color="primary" label="Weiter" />
        </q-stepper-navigation>
      </q-step>

      <q-step :name="4" title="Auto auswählen" icon="emoji_transportation" :done="step > 4">
        <p class="text-caption">Mit welchem Auto fährst du?</p>
        <q-list>
          <p
            class="text-caption text-red"
            v-if="!userCars.length"
          >Du hast noch keine Fahrzeuge eingestellt, aus denen du auswählen könntest.</p>
          <q-item tag="label" v-for="car in userCars" :key="car.carId" class="q-pr-none">
            <q-radio v-model="lift.carId" :val="car.carId" />
            <q-item-section avatar>
              <q-avatar rounded>
                <img class="shadow-3 q-ma-none" src="~assets/loremimage.jpg" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label>{{car.brand}} {{car.model}}</q-item-label>
              <extHR class="q-my-sm" :color="car.color" size="1px" />
              <q-item-label caption>
                {{car.licensePlate}} ({{car.seats}}
                <q-icon name="airline_seat_recline_normal" size="xs" />frei)
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <q-stepper-navigation>
          <q-btn flat @click="step--" color="primary" label="Eins Zurück" class="q-ml-sm" />
          <q-btn @click="step ++" color="primary" :disable="!lift.carId" label="Weiter" />
        </q-stepper-navigation>
      </q-step>

      <q-step :name="5" title="Sitze bearbeiten" icon="person_add" :done="step > 5">
        <p
          class="text-caption"
        >Wie viele Leute nimmst du diesmal mit? (Hinweis: Wenn du hier 0 beibehältst, übernehmen wir {{getCarData.seats}} Mitfahrer wie sonst auch)</p>
        <q-item>
          <q-item-section avatar>
            <q-icon :color="lift.seats ? 'primary' : 'grey-4'" name="airline_seat_recline_normal" />
          </q-item-section>
          <q-item-section>
            <q-slider
              markers
              thumb-path="M7.59 5.41c-.78-.78-.78-2.05 0-2.83.78-.78 2.05-.78 2.83 0 .78.78.78 2.05 0 2.83-.79.79-2.05.79-2.83 0zM6 16V7H4v9c0 2.76 2.24 5 5 5h6v-2H9c-1.66 0-3-1.34-3-3zm14 4.07L14.93 15H11.5v-3.68c1.4 1.15 3.6 2.16 5.5 2.16v-2.16c-1.66.02-3.61-.87-4.67-2.04l-1.4-1.55c-.19-.21-.43-.38-.69-.5-.29-.14-.62-.23-.96-.23h-.03C8.01 7 7 8.01 7 9.25V15c0 1.66 1.34 3 3 3h5.07l3.5 3.5L20 20.07z"
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
          <q-btn color="primary" @click="step --" label="Zurück" flat />
          <q-btn
            @click="openAddLiftConfirm = true"
            color="primary"
            label="Abschließen"
            class="q-ml-sm"
          />
        </q-stepper-navigation>
      </q-step>
      <q-card v-show="uploading == 1">
        <q-card-section>
          <p>Bitte hab noch einen Moment Geduld...</p>

          <q-linear-progress indeterminate color="primary" class="q-mt-sm" />
        </q-card-section>
      </q-card>
      <q-card v-show="uploading == 2">
        <q-card-section>
          <p>
            <q-icon name="check" size="md" color="primary" />Dein Angebot ist jetzt online.
          </p>
        </q-card-section>
      </q-card>

      <q-dialog
        v-model="openAddLiftConfirm"
        full-width
        full-height
        persistent
        transition-show="slide-up"
        :transition-hide="flipAddLiftConfirm ? 'flip-up' : 'slide-up'"
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
                Bitte wirf nochmal einen Blick auf deine Angaben, bevor wir dein Angebot veröffentlichen.
                <br />
                <br />Und falls noch nicht geschehen: Lies bitte noch kurz unsere
                <a
                  href="https://mi.com"
                >Datenverarbeitung</a>.
              </p>
            </q-expansion-item>
          </q-card-section>

          <q-card-section>
            <extHR color="primary" size="xs" />
          </q-card-section>

          <q-card-section>
            <div class="row overview">
              <div class="col-6">
                <p class="text-subtitle1 q-mb-sm">
                  {{getDataFromAddressId(lift.startAddressId).nickname}}
                  <span
                    class="text-caption q-ml-sm"
                  >{{getDataFromAddressId(lift.startAddressId).city}}</span>
                </p>
              </div>
              <div class="col-6 text-right">
                <q-item>
                  <q-item-section>
                    <q-item-label>{{getCarFromId(lift.carId).brand}} {{getCarFromId(lift.carId).model}}</q-item-label>
                    <extHR class="q-my-sm" :color="getCarData.color" size="1px" />
                    <q-item-label caption>
                      {{lift.seats ? lift.seats : getCarData.seats}}
                      <q-icon name="airline_seat_recline_normal"></q-icon>frei
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </div>
              <div class="col-2 text-right text-overline">14:35</div>

              <div class="col-10">
                <!-- placeholder -->
              </div>
              <div class="col-12">
                <q-slide-transition>
                  <div v-show="overviewExpanded">
                    <div v-for="stop in lift.stops" :key="stop.addressId" class="row overview">
                      <div class="col-2 text-right text-overline">{{getStopTime(stop.time)}}</div>
                      <q-item class="col-10">
                        <q-item-section>
                          <q-item-label>{{getDataFromAddressId(stop.addressId).city}}</q-item-label>
                          <q-item-label
                            caption
                          >{{getDataFromAddressId(stop.addressId).street}} {{getDataFromAddressId(stop.addressId).number}}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </div>
                  </div>
                </q-slide-transition>
              </div>

              <div class="col-2 text-right text-overline q-pt-md">14:38</div>
              <div class="col-10 q-pt-md" v-if="!lift.stops">
                <q-expansion-item expand-separator v-model="overviewExpanded">
                  <template v-slot:header>
                    <small>
                      <div class="text-weight-light">Zwischenstopps anzeigen</div>
                    </small>
                  </template>
                </q-expansion-item>
              </div>

              <div class="col-12">
                <p class="text-subtitle1 q-mt-sm">
                  {{getDataFromAddressId(lift.destinationAddressId).nickname}}
                  <span
                    class="text-caption q-ml-sm"
                  >{{getDataFromAddressId(lift.destinationAddressId).city}}</span>
                </p>
              </div>
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Bearbeiten" @click="openAddLiftConfirm = false" v-close-popup />
            <q-btn color="primary" label="Freigeben" @click="addLift()" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-stepper>
  </div>
</template>

<script>
import { sendApiRequest, SQL_ADD_LIFT } from "../ApiAccess";
import extHR from "components/ExtendedHr";
import { date } from "quasar";

export default {
  components: { extHR },

  data() {
    return {
      lift: {
        destination: "school", // default set to school, user selects first home/school, then exact address
        destinationAddressId: 0,
        startAddressId: 0,
        carId: null,
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
      },
      step: 1,
      openAddLiftConfirm: false,
      flipAddLiftConfirm: true,
      overviewExpanded: false,
      uploading: 0, // 0 means not uploading, 1 means upload in progress, 2 means upload successful and -1 means error
    };
  },
  computed: {
    carOptions() {
      let cars = [];
      for (let car of this.$store.getters["auth/user"].cars) {
        cars.push(car.licensePlate + " - " + car.brand + " " + car.model);
      }
      return cars;
    },

    userCars() {
      return this.$store.getters["auth/user"].cars;
    },

    getCarData() {
      // returns data of selected car, so that user for example can see how many seats would be default
      let cars = this.$store.getters["auth/user"].cars;
      let obj = cars.find((item) => {
        return item.carId == this.lift.carId;
      });
      return obj
        ? obj
        : {
            seats: 0,
            color: "white",
          }; // fallback when no car has been selected yet
    },

    liftValue: {
      get() {
        return this.lift;
      },
      set(value) {
        this.lift = value;
        this.step += 1;
      },
    },

    getExactAddresses() {
      if (this.lift.destination == "school") {
        return this.$store.getters["auth/user"].addresses.filter((item) => {
          return item.id < 4; // filter only the schools, which have IDs 1 to 3
        });

        // a[0].imagePath = require(pathBegin + 'HDH_cube.jpg')
        // a[1].imagePath = require(pathBegin + 'HDH_old.jpg')
        // a[2].imagePath = require(pathBegin + 'WIB_ext.jpg')
      } else if (this.lift.destination == "home") {
        return this.$store.getters["auth/user"].addresses.filter((item) => {
          return item.id > 3; // filter only private adresses, IDs 1 to 3 are reserved for schools
        });
      }
      return null;
    },

    getExactStartingPoints() {
      if (this.lift.destination != "school") {
        return this.$store.getters["auth/user"].addresses.filter((item) => {
          return item.id < 4; // filter only the schools, which have IDs 1 to 3
        });
      } else if (this.lift.destination != "home") {
        return this.$store.getters["auth/user"].addresses.filter((item) => {
          return item.id > 3; // filter only private adresses, IDs 1 to 3 are reserved for schools
        });
      }
      return null;
    },
  },

  mounted() {
    this.$store.commit("setPage", "");
    this.$store.commit("setPageTrans", "slide-up");
  },

  methods: {
    addLift() {
      new Promise((_) => {
        this.flipAddLiftConfirm = false;
      })
        .then((_) => {
          this.openAddLiftConfirm = false;
        })
        .then((_) => {
          this.flipAddLiftConfirm = true;
        }); // this is just to get a cool effect, flip when process is canceled and swipe up when lift shall be published.

      if (this.lift.seats == 0) {
        // case when user didn't want to change number of seats at this lift
        this.lift.seats = this.getCarData.seats;
      }
      this.step = 0;
      this.uploading = 1;
      sendApiRequest(
        SQL_ADD_LIFT,
        {
          id: this.$store.getters["auth/user"].id,
          lift: this.lift,
        },
        (_) => {
          // here comes your success code
          this.lift = {
            destination: "school", // default set to school, user selects first home/school, then exact address
            destinationAddressId: 0,
            startingPoint: 0,
            car: null,
            seats: 0, // just to avoid error when rendering slider
          };
          this.step = 0;
          this.openAddLiftConfirm = false;
          this.uploading = 2;
        },
        (error) => {
          alert(error);
          this.step = 1;
          this.uploading = -1;
        }
      );
    },

    resetFields() {
      location.reload();
    },

    getImagePath(id) {
      let pathBegin = "../assets/school_images/";
      switch (id) {
        case 1:
          return require("../assets/school_images/HDH_cube_resized.jpg");
          break;
        case 2:
          return require("../assets/school_images/HDH_old_resized.jpg");
          break;
        case 3:
          return require("../assets/school_images/WIB_ext_resized.jpg");
          break;

        default:
          return false; // this computed property is being called by school adresses and home adresses. When returning false, no image is shown.
      }
    },

    getDataFromAddressId(id) {
      let data = this.$store.getters["auth/user"].addresses.find((item) => {
        return item.id == id;
      });
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
    },

    getCarFromId(id) {
      let data = this.userCars.find((item) => {
        return item.carId == id;
      });
      if (data) return data;
      return {
        brand: null,
        model: null, // similar case to above method
      };
    },

    getStopTime(stamp) {
      return date.formatDate(stamp, "H:mm");
    },
  },
};
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