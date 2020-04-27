<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md">
      <p>Hier siehst du alle wichtigen Infos zu deinem Profil.</p>
    </div>
    <q-img transition-show="slide-left" :src="ppPath" style="height: 200px; max-width: 200px;">
      <template v-slot:loading>
        <div class="absolute-full flex flex-center text-black">
          <q-inner-loading
            transition-show="slide-down"
            transition-hide="slide-down"
            size="50px"
            color="light-blue"
            class="q-ma-md"
          />
        </div>
      </template>
      <template v-slot:error>
        <div
          class="absolute-full flex flex-center text-white"
        >Bild kann leider nicht geladen werden. Bitte Internetverbindung überprüfen.</div>
      </template>
      <q-badge floating class="q-pa-none" style="background-color: transparent;">
        <q-btn round color="black" icon="edit" @click="openUpload = true" />
      </q-badge>
    </q-img>
    <br />

    <div class="q-pa-xs">
      <div class="row">
        <p class="text-uppercase text-caption q-mb-none col-6">Über mich</p>
        <div class="col-6">
          <q-btn round color="black" size="xs" icon="edit" @click="openUpdateDescription = true" />
        </div>
      </div>
      <div class="q-pa-sm relative">{{description}}</div>
    </div>

    <q-dialog v-model="openUpdateDescription" persistent>
      <q-card style="min-width: 350px">
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
            @click="updateDescription"
            flat
            label="Speichern"
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

    <q-select v-model="gender" :options="genderOptions" label="Geschlecht" behavior="menu" />

    <div style="padding: 20px;">
      <p>Dabei seit: {{since}}</p>
      <p>Fahrten angeboten: {{liftsOffered}}</p>
      <p>Mitfahrangebote gesamt: {{liftsAll}}</p>
      <p>Wochendurchschnitt: -</p>
    </div>

    <p>
      Entfernung: maximal {{liftMaxDistance}}km
      <q-btn @click="editDistance = true" icon="edit" />
    </p>

    <SignOutButton />

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

    <q-dialog v-model="editDistance" full-height full-width>
      <q-card class="column full-height">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Entfernung einstellen</div>
          <q-space />
          <q-btn icon="close" @click="updateDistance()" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <p
            class="text-caption"
          >Wie weit soll deine Mitfahrgelegenheit maximal von dir entfernt sein?</p>

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
  </div>
</template>

<script>
import { date } from "quasar";
import SignOutButton from "../components/SignOutButton";
import { buildGetRequestUrl, GET_USER_PROFILE_PIC, sendApiRequest, SQL_UPDATE_PROFILE_PICTURE } from "../ApiAccess";


export default {
  components: { SignOutButton },

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
      liftMaxDistance: this.$store.getters["auth/user"].settings.liftMaxDistance,
      editDistance: false,
      ppPath: "",
      openUpdateDescription: false,
      newDescription: '',
      openUpload: false,
      file: null,
      fileBlob: null,
      description: this.$store.getters["auth/user"].description,
      genderOptions: [
        "Männlich",
        "Weiblich",
        "Divers"
      ]
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
          default:
            return "Sonstiges / Will ich nicht sagen";
        }
      },
      set(value) {
        this.$store.dispatch("auth/updateGender", value);
      }
    },

    atLeastFiveWords: function(){
      var splitted = this.newDescription.split(' ')
      var length = splitted.length
      var lastItemIsWord = splitted[length - 1] != ''
      return length > 5 ? true : (length >= 5) && lastItemIsWord // when more than 5 words, just return true
    }
  },
  methods: {
    updateDistance() {
      this.$store.dispatch("auth/updateLiftMaxDistance", this.liftMaxDistance);
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
            try{
              this.fileBlob = elem.toBlob()
            }
            catch(e){
              alert('Die Konvertierung hat nicht funktioniert. E:' + e)
            }
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

    updateDescription() {
      this.$store.dispatch("auth/updateDescription", this.newDescription)
      this.newDescription = ''
    },

    updateProfilePicture(blob) {
      sendApiRequest(SQL_UPDATE_PROFILE_PICTURE,
      {imageData: blob},
      _ => console.warn('success'),
      error => {throw error})
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