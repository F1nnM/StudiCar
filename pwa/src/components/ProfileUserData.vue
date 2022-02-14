<template>
  <!-- this component was made to split the profile file in smaller pieces to improve maintining, just the advantages of modularizing -->
  <div>
    <q-splitter :value="50" :separator-style="'background-color: transparent '">
      <template v-slot:before>
        <q-card class="q-ml-md q-mt-md q-mb-xs q-mr-sm">
          <q-card-section class="q-py-sm">
            <div id="img-container">
              <q-img
                spinner-color="primary"
                class="rounded-borders"
                spinner-size="82px"
                ref="profile_image"
                @load="imageHasBeenLoaded"
                :src="ppPath"
              >
                <template v-slot:error>
                  <div class="absolute-full flex flex-center text-white">
                    StudiCar konnte dein Bild nicht laden. Bitte stelle eine
                    Internetverbindung her, um dein Profilbild zu sehen.
                  </div>
                </template>
              </q-img>
              <q-badge
                floating
                class="q-pa-none"
                style="background-color: transparent"
              >
                <!-- <q-btn
                    round
                    color="black"
                    size="sm"
                    icon="delete"
                    @click="resetPP()"
                    class="q-mr-sm"
                  />-->
                <q-btn
                  round
                  outline
                  color="black"
                  size="sm"
                  icon="edit"
                  @click="openUpload = true"
                />
              </q-badge>
            </div>
          </q-card-section>

          <q-card-section class="q-pb-sm"
            ><div
              class="col-8 text-h5 text-weight-light text-left q-mt-none q-mb-xs custom-overline c-o-1 c-o-l c-o-sm"
            >
              {{ username }}
              <!-- Anastasia -->
            </div>
          </q-card-section>
        </q-card>
      </template>

      <template v-slot:after>
        <div class="column justify-between q-pr-md">
          <div class="col">
            <div class="row justify-start q-ml-sm q-mt-md">
              <!-- <div>
            <q-card class="my-shadow-left no-border">
              <q-card-section> -->
              <q-btn class="q-mr-sm" @click="shareProfileQR = true">
                <QrIcon size="sm" :type="4" showLogo />
              </q-btn>

              <q-btn icon="group" size="sm" to="friends/" />
            </div>
          </div>
          <div class="col">
            <q-card class="q-ml-sm q-mt-sm q-mb-xs">
              <q-card-section class="q-py-sm">
                <div class="text-uppercase text-caption q-mt-none q-mb-xs">
                  Präferenzen
                  <br />im Auto
                  <q-btn
                    size="sm"
                    flat
                    @click="toggleOpenEditPrefs"
                    icon="edit"
                  />
                </div>
                <div class="row text-caption">
                  <div class="col-9">Redseligkeit</div>
                  <div :class="'col-3 text-' + betterPrefColor(prefs.talk)">
                    ●
                  </div>
                  <div class="col-9">... am Morgen</div>
                  <div
                    :class="'col-3 text-' + betterPrefColor(prefs.talkMorning)"
                  >
                    ●
                  </div>
                  <div class="col-9">Rauchen</div>
                  <div :class="'col-3 text-' + betterPrefColor(prefs.smoking)">
                    ●
                  </div>
                  <div class="col-9">Musik</div>
                  <div :class="'col-3 text-' + betterPrefColor(prefs.music)">
                    ●
                  </div>
                </div>
                <!-- <q-expansion-item v-model="prefExpanded">
            <template v-slot:header>
              <span>
                ●●●●
              </span>
            </template>
          </q-expansion-item> -->
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- <q-list>
          <q-item-label
            header
            class="q-pt-xs q-pb-xs text-caption text-uppercase"
            >Dabei seit</q-item-label
          >
          <q-item>{{ since }}</q-item>
          <q-item-label header class="text-caption text-uppercase"
            >Meiste Fahrten</q-item-label
          >
          <div v-if="friends.length">
            <q-item
              v-for="friend in friends"
              :key="friend.fbId"
              dense
              class="q-px-xs q-ml-sm"
              clickable
              :to="'benutzerinfo?userFbId=' + friend.fbId"
            >
              <q-item-section avatar>
                <q-avatar size="md">
                  
                  <q-img :src="friend.imageUrl" />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ friend.name }}</q-item-label>
              </q-item-section>
              <q-item-section side class="text-bold q-mr-sm">{{
                friend.lifts
              }}</q-item-section>
            </q-item>
          </div>
          <div v-else class="text-caption">
            Du hast noch an keinen Fahrten teilgenommen
          </div>
        </q-list> -->
      </template>
    </q-splitter>
    <q-card class="q-ma-md q-mt-sm">
      <q-card-section class="q-pb-sm q-pt-xs ">
        <div class="row justify-between q-mb-xs">
          <div class="text-uppercase text-caption q-mt-xs">
            Über Mich
          </div>
          <q-btn
            size="sm"
            flat
            color="black"
            icon="edit"
            @click="toggleOpenEditDescription"
          />
        </div>
        <div class="text-weight-light q-mt-sm">
          <div v-if="description">{{ description }}</div>
          <div v-else>
            - noch keine Beschreibung hinterlegt -
          </div>
        </div>
      </q-card-section>
    </q-card>
    <q-dialog
      :value="!!friendInfoData"
      @input="e => (friendInfoData = !!e)"
      position="right"
      class="bg-white"
      style="min-width: 45vw; min-height: 40vh"
    >
      <q-card v-if="!!friendInfoData">
        <q-card-section class="q-pa-sm">
          <q-list>
            <q-item-label header>Details</q-item-label>
            <q-item>
              <q-item-section avatar>
                <q-avatar>
                  <q-img :src="friendInfoData.imageUrl" />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ friendInfoData.name }}</q-item-label>
                <q-item-label caption>{{
                  friendInfoData.surname
                }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-expansion-item dense class="full-width">
              <template v-slot:header>
                <q-btn
                  outline
                  dense
                  no-caps
                  label="Profil"
                  :to="'benutzerinfo?userFbId=' + friendInfoData.fbId"
                />
              </template>
              <q-card>
                <q-card-section>
                  <q-btn
                    outline
                    no-caps
                    dense
                    class="q-px-sm"
                    color="red"
                    label="Entfernen"
                  />
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>

    <QrGen
      v-model="shareProfileQR"
      :label="username"
      linearProgress
      :input="qrInput"
      text="Lass einen anderen StudiCar Nutzer den Code mit der integrierten Kamera scannen oder teile die Daten direkt über WhatsApp"
    />

    <q-dialog v-model="openUpload" full-width>
      <q-card>
        <q-card-section>
          <div class="column items-start q-gutter-y-md">
            <p class="text-h6">Lade dein neues Bild hoch</p>
            <q-slide-transition>
              <div v-if="!file" class="full-width">
                <!-- this area will be shown when no image has been selected yet -->
                <q-file
                  @input="loadFile"
                  accept="image/*"
                  :hint="
                    file
                      ? '...und noch auf das Icon tippen'
                      : 'noch kein Bild ausgewählt'
                  "
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
                    style="object-fit: contain; max-height: 20vh"
                  />
                </div>
                <div class="col-4">
                  <q-btn
                    flat
                    icon="publish"
                    label="Speichern"
                    color="primary"
                    dense
                    no-caps
                    :disable="
                      !this.newPPictureBase64 || uploadingProfilePicture
                    "
                    @click="uploadProfilePicture"
                  />
                  <br />
                  <br />
                  <q-btn
                    flat
                    color="negative"
                    label="Entfernen"
                    dense
                    no-caps
                    icon="delete"
                    @click="file = null"
                    :disable="uploadingProfilePicture"
                  />
                </div>
              </div>
            </q-slide-transition>
            <br />
            <div v-if="!file" class="text-caption">
              Bitte stelle sicher, dass du auf dem Bild gut zu sehen bist.
              Vergewissere dich außerdem, dass du die Rechte hast, dieses Bild
              hochzuladen.
              <div v-if="!uploadingProfilePicture">
                <ExtHr color="grey-7" class="q-my-md" />
                <q-btn
                  size="md"
                  label="Bild zurücksetzen"
                  icon="delete"
                  color="negative"
                  class="float-right q-pr-xs"
                  dense
                  outline
                  @click="resetPP"
                />
              </div>
            </div>
            <div v-else class="text-caption">
              StudiCar hat dein Bild etwas zugeschnitten, damit es den
              Abmessungen für Profilbilder entspricht.
            </div>
          </div>
        </q-card-section>
        <q-linear-progress
          class="q-mt-xs full-width"
          indeterminate
          size="sm"
          track-color="white"
          v-if="uploadingProfilePicture"
        />
      </q-card>
    </q-dialog>

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
          <q-btn
            class="col-2"
            icon="clear"
            flat
            size="sm"
            @click="newDescription = ''"
          />
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

    <q-dialog
      v-model="openEditPrefs"
      persistent
      position="bottom"
      class="q-pa-md"
    >
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
                  }
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
  </div>
</template>
<script>
import { date } from "quasar";
import ExtHr from "components/ExtendedHr";
import QrGen from "components/QrGenerator";
import QrIcon from "components/QrIcon";

import Vibrant from "node-vibrant";

import {
  buildGetRequestUrl,
  sendApiRequest,
  GET_USER_PROFILE_PIC,
  SQL_UPDATE_PROFILE_PICTURE,
  SQL_RESET_PROFILE_PICTURE
} from "../ApiAccess";

export default {
  name: "ProfileUserData",
  components: {
    ExtHr,
    QrGen,
    QrIcon
  },
  props: {
    username: String
  },
  data() {
    return {
      ppPath: "",
      openUpload: false,
      shareProfileQR: false,
      friendInfoData: null,
      statsFriendsTab: "stats",
      statsTimeTab: "current",
      file: null,
      newPPictureBase64: "",
      friendsPage: 0,
      uploadingProfilePicture: false,
      prefExpanded: false,

      openEditPrefs: false, // prefs settings
      openEditPrefsTab: "talk",
      newPrefs: {
        talk: "",
        talkMorning: "",
        smoking: "",
        music: ""
      },
      prefsDocu: this.$store.state.prefsDocu,
      imageForColors: null,

      openEditDescription: false,
      newDescription: ""
    };
  },
  computed: {
    friends() {
      return this.$store.getters["auth/user"].topFriends;
    },

    friendsGroup4() {
      const pageSize = 4;

      var arr = [];

      this.friends.forEach((f, index) => {
        if (index % pageSize == 0) {
          // e.g. when pageSize is 4 then a new "page" will be generated at indices 4, 8, 12 ...
          arr.push([f]); // directly push new page and this friend
        } else arr[Math.floor(index / pageSize)].push(f);
      });
      return arr;
    },

    profileColor() {
      return "white";
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
            "Dezember"
          ]
        }
      );
    },

    qrInput() {
      const uid = this.$store.getters["auth/user"].uid,
        host = process.env.DEV ? "localhost:3000" : "dev.pwa.studicar.mfinn.de";

      return {
        type: "user",
        data: uid
      };
    },

    prefs: {
      get() {
        return this.$store.getters["auth/user"].prefs;
      },
      set(value) {
        this.$store.dispatch("auth/updatePrefs", value);
      }
    },

    description: {
      get() {
        return this.$store.getters["auth/user"].bio;
      },
      set(value) {
        this.$store.dispatch("auth/updateDescription", value);
      }
    }
  },
  methods: {
    loadFile(file) {
      this.file = file;
      const size = 300, // represents the height
        ratio = 1; // default ratio at profile pictures

      const width = size * ratio,
        fileName = file.name,
        reader = new FileReader();
      reader.onerror = error => console.log(error);
      reader.readAsDataURL(file);
      reader.onload = event => {
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
          (reader.onerror = error => {
            alert(error);
          });
      };
    },

    uploadProfilePicture() {
      if (this.newPPictureBase64) {
        this.uploadingProfilePicture = true;
        sendApiRequest(
          SQL_UPDATE_PROFILE_PICTURE,
          {
            imageData: this.newPPictureBase64
          },
          _ => {
            this.ppPath += "&timestamp=" + Date.now();
            this.openUpload = false;
            this.file = null;
            this.newPPictureBase64 = "";
            this.uploadingProfilePicture = false;
          },
          err => {
            this.uploadingProfilePicture = false;
          }
        );
      }
    },

    resetPP() {
      this.$q
        .dialog({
          title: "Bild zurücksetzen",
          message:
            "Willst du dein Bild wirklich zurücksetzen? StudiCar speichert dann ein anonymes Ersatzbild.",
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.uploadingProfilePicture = true;
          sendApiRequest(
            SQL_RESET_PROFILE_PICTURE,
            {},
            _ => {
              this.ppPath += "&timestamp=" + Date.now();
              this.openUpload = false;
              this.uploadingProfilePicture = false;
            },
            err => {
              this.uploadingProfilePicture = false;
            }
          );
        })
        .onCancel(() => {});
    },

    betterPrefColor(color) {
      if (color == "GREEN") color = "green-8";
      // first convert color if neccessary
      else if (color == "YELLOW") color = "orange";
      return color.toLowerCase(); // always return lower case
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

    imageHasBeenLoaded() {
      const img = this.$refs.profile_image;

      console.log("Image has been loaded");
    }
  },
  mounted() {
    (async _ => {
      this.ppPath = await buildGetRequestUrl(GET_USER_PROFILE_PIC, {
        fbid: this.$store.getters["auth/user"].uid
      });
    })();
  }
};
</script>

<style scoped></style>
