<template>
  <div>
    <q-splitter v-model="splitter">
      <template v-slot:before>
        <div class="q-px-md q-py-sm">
          <q-card>
            <div>
              <q-img spinner-color="primary" spinner-size="82px" :src="ppPath">
                <template v-slot:error>
                  <div
                    class="absolute-full flex flex-center text-white"
                  >Wir konnten dein Bild leider nicht laden. Sollte dieses Problem öfter auftreten, kontaktiere bitte das Team.</div>
                </template>
              </q-img>
              <q-badge floating class="q-pa-none" style="background-color: transparent;">
                <q-btn round color="black" size="sm" icon="edit" @click="openUpload = true" />
              </q-badge>
            </div>

            <q-card-section class="row">
              <p
                class="col-8 text-h5 text-weight-light text-left q-mt-none q-mb-xs custom-overline c-o-1 c-o-l c-o-sm"
              >{{username}}</p>
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
    <qrGen @close="shareProfileQR = false" :show="shareProfileQR" :input="user_fbid" />

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

            <q-select v-model="gender" :options="genderOptions" label="Geschlecht" behavior="menu" />
            <div class="row q-pt-md">
              <p class="text-uppercase text-caption q-mb-none col-10">Kurzbeschreibung</p>
              <div class="col-2">
                <q-btn
                  size="sm"
                  flat
                  color="black"
                  icon="edit"
                  @click="openUpdateDescription = true"
                />
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
                  <q-btn size="sm" flat @click="prefInfo = !prefInfo" icon="edit" />
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
                    maximale Entfernung:
                    <br />
                  </div>

                  <div class="col-12 text-h5 text-right">
                    {{liftMaxDistance}}km
                    <q-btn size="sm" flat @click="editDistance = true" icon="edit" />
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
              <p class="text-uppercase text-caption q-mt-none q-mb-xs col-10">Meine Adressen</p>
              <p class="col-2">
                <q-btn size="sm" flat @click="editAdresses = !editAdresses" icon="edit" />
              </p>
              <q-list>
                <q-item v-for="item in adresses" :key="item.id">
                  <q-item-section class="q-pl-md" style="border-left: 1px solid lightgray">
                    <q-item-label>{{item.street}} {{item.number}}</q-item-label>
                    <q-item-label caption>{{item.postcode}} {{item.city}}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>
          <div class="q-mt-sm q-pa-sm shadow-1">
            <div class="row">
              <p class="text-uppercase text-caption q-mt-none q-mb-xs col-10">Meine Fahrzeuge</p>
              <p class="col-2">
                <q-btn size="sm" flat @click="editCars = !editCars" icon="edit" />
              </p>
              <q-card class="col-6 q-pa-xs no-shadow" v-for="item in cars" :key="item.plate">
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

      <q-dialog v-model="openUpdateDescription" persistent full-width>
        <q-card>
          <q-card-section>
            <div class="text-h6">Kurzinfo</div>
            <p class="text-caption">Beschreibe dich in wenigstens 5 Worten</p>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input dense v-model="newDescription" autofocus @keyup.enter="prompt = false" />
          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn
              :disabled="!atLeastFiveWords"
              flat
              label="Speichern"
              @click="updateDescription"
              v-close-popup
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!-- 
    <q-input v-model="description" filled autogrow stack-label label="Beschreibung" />
    <q-btn
      color="white"
      text-color="black"
      label="Beschreibung speichern"
      @click="updateDescription()"
      />-->

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
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6">Entfernung einstellen</div>
            <q-space />
            <q-btn icon="close" @click="updateDistance()" flat round dense v-close-popup />
          </q-card-section>
          <q-card-section>
            <p class="text-caption">
              Wie weit soll deine Mitfahrgelegenheit maximal von dir entfernt sein?
              <br />
              <small>Bitte hab Verständnis, dass wir noch mit Luftlinien rechnen. Wir arbeiten an echten Routen.</small>
            </p>

            <q-slider
              v-model="liftMaxDistance"
              :min="5"
              :max="40"
              :step="5"
              snap
              label-always
              :label-value="liftMaxDistance+'km'"
              color="primary"
            />
          </q-card-section>
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
          <q-card-section
            class="q-pt-sm"
            :style="'border-top: 1px solid ' + carInfo.color.toLowerCase()"
          >
            <div class="q-pa-lg row">
              <p class="text-uppercase text-caption col-7">Fahrzeugtyp</p>
              <p class="text-uppercase col-5">{{capitalize(carInfo.type)}}</p>
              <p class="text-uppercase text-caption col-7">Farbe</p>
              <p class="text-uppercase col-5">{{carInfo.color}}</p>
              <p class="text-uppercase text-caption col-7">Sitze</p>
              <p class="text-uppercase col-5">{{carInfo.seats}}</p>
              <p class="text-uppercase text-caption col-7">Kennzeichen</p>
              <p class="text-uppercase col-5">{{carInfo.plate}}</p>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script>
import { date } from "quasar";
import SignOutButton from "../components/SignOutButton";
import { buildGetRequestUrl, GET_USER_PROFILE_PIC, sendApiRequest, SQL_UPDATE_PROFILE_PICTURE } from "../ApiAccess";
import qrGen from '../components/qrGenerator'

export default {
  components: { SignOutButton,
  qrGen },

  data() {
    return {
      since: date.formatDate(
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
      liftAverage: 5,
      liftMaxDistance: this.$store.getters["auth/user"].settings.liftMaxDistance,
      username:  this.$store.getters['auth/user'].name.split(' ')[0],
      user_fbid:  this.$store.getters['auth/user'].uid,
      adresses: this.$store.getters['auth/user'].adresses,
      cars: this.$store.getters['auth/user'].cars,
      carInfo: {
        brand: '',
        model: '',
        type: '',
        color: '',
        licensePlate: '',
        seats: ''
      },
      carInfoOpen: false,
      editDistance: false,
      shareProfileQR: false,
      prefs: this.$store.getters["auth/user"].prefs,
      splitter: 50, 
      ppPath: "",
      openUpdateDescription: false,
      description: this.$store.getters["auth/user"].description,
      newDescription: '',
      openUpload: false,
      file: null,
      fileBlob: null,
      genderOptions: [
        "M",
        "W",
        "D"
      ],
      tab: 'data'
    };
  },
  computed: {
    gender: {
      get() {
        // switch (this.$store.getters["auth/user"].gender) {
        //   case "W":
        //     return "Weiblich";
        //   case "M":
        //     return "Männlich";
        //   case "D":
        //     return "Divers";
        //   case "X":
        //   default:
        //     return "Sonstiges / Will ich nicht sagen";
        // }
        return this.$store.getters["auth/user"].gender
      },
      set(value) {
        this.$store.dispatch("auth/updateGender", value);
      }
    },

    atLeastFiveWords: function(){
      if(this.username == 'Bernd'){
        return true
      }
      else{
        var splitted = this.newDescription.split(' ')
        var length = splitted.length
        var lastItemIsWord = splitted[length - 1] != ''
        return length > 5 ? true : (length >= 5) && lastItemIsWord // when more than 5 words, just return true
      }
      
    }
  },
  methods: {

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

    updateDescription(){
      this.$store.dispatch("auth/updateDescription", this.newDescription);
      this.newDescription = ''
    },

    updateDistance() {
      this.$store.dispatch("auth/updateLiftMaxDistance", this.liftMaxDistance);
    },

    updatePrefs(){
      this.$store.dispatch("auth/updatePrefs", this.prefs);
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

    
    this.$store.state.pageName = 'Profil'
  }
};
</script>