<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md">
      <div class="text-h4">Dein Profil {{file}}</div>
      <hr />
      <br />
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

    <q-input v-model="description" filled autogrow stack-label label="Beschreibung" />
    <q-btn
      color="white"
      text-color="black"
      label="Beschreibung speichern"
      @click="updateDescription()"
    />

    <q-select v-model="gender" :options="genderOptions" label="Standard" />

    <div style="padding: 20px;">
      <p>Dabei seit: {{since}}</p>
      <p>Mitfahrangebote gesamt: {{global.user.liftsAll}}</p>
      <p>Wochendurchschnitt: {{global.user.avgLifts}}</p>
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
            <q-file @input="loadFile" accept="image/*" />
            <div id="anchor"></div>
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
import { buildGetRequestUrl, GET_USER_PROFILE_PIC } from "../ApiAccess";

import { sendApiRequest, SQL_UPDATE_PROFILE_PICTURE } from '../ApiAccess';

import imageCompressor from 'vue-image-compressor'

export default {
  components: { SignOutButton },
  data() {
    return {
      since: date.formatDate(
        this.$store.getters["auth/user"].createdAt,
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
      liftMaxDistance: this.$store.getters["auth/user"].settings.liftMaxDistance,
      editDistance: false,
      ppPath: "",
      openUpload: false,
      file: null,
      description: this.$store.getters["auth/user"].description,
      genderOptions: [
        "Weiblich",
        "Männlich",
        "Divers",
        "Sonstiges / Will ich nicht sagen"
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
    }
  },
  methods: {
    updateDistance() {
      this.$store.dispatch("auth/updateLiftMaxDistance", this.liftMaxDistance);
    },

    loadFile(file){
      const size = 300 // represents the height
      const ratio = 1 // default ratio at profile pictures

      const width = size * ratio
      const fileName = file.name
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = event => {
          const img = new Image()
          img.src = event.target.result
        
          img.onload = () => {
            
            const elem = document.createElement('canvas')
            elem.width = width;
            elem.height = size;

            const ctx = elem.getContext('2d');
            if(img.width >= img.height){ // landscape or square: width has to be cropped
              var scale = img.height / size
              var indent  = (img.width - img.height) / scale // indent has to be half of the difference and negative, additionally divided by scale
              ctx.drawImage(img, indent / -2, 0, width + indent, size)
            }
            else { // portrait
              var scale = img.width / size
              var indent  = (img.height - img.width) / scale // indent has to be half of the difference and negative, additionally divided by scale
              ctx.drawImage(img, 0, indent / -2, width, size + indent)
            }

            var image_blob = elem.toBlob()
            this.updateProfilePicture(image_blob)
            // input image is made square and scaled
            
            
            console.log(elem.toBlob())
            console.log(elem)
              },
              reader.onerror = error => console.log(error);
      };
    },

    updateDescription() {
      this.$store.dispatch("auth/updateDescription", this.description);
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
    );
  }

};
</script>