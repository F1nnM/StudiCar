<template>
  <!-- this component was made to split the profile file in smaller pieces to improve maintining, just the advantages of modularizing -->
  <div>
    <div class="q-mr-md">
      <TitleButtonAnchor>
        <q-btn label="Freunde" to="/friends" outline color="primary" />
      </TitleButtonAnchor>
    </div>

    <q-splitter
      :value="50"
      disable
      :separator-style="'background-color: transparent '"
    >
      <template v-slot:before>
        <div class="q-px-md q-py-sm">
          <q-card
            class="my-shadow-left"
            :style="'border-color: ' + profileColor"
          >
            <q-card-section class="q-pa-none">
              <div class>
                <q-img
                  spinner-color="primary"
                  class="rounded-borders"
                  spinner-size="82px"
                  id="profile_image"
                  :src="ppPath"
                  @load="getProminentColor"
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

            <q-card-section class="row q-pb-none">
              <div
                class="col-8 text-h5 text-weight-light text-left q-mt-none q-mb-xs custom-overline c-o-1 c-o-l c-o-sm"
              >
                {{ username }}
              </div>
              <p class="col-4">
                <q-btn @click="shareProfileQR = true" flat>
                  <QrIcon size="sm" :type="4" showLogo />
                </q-btn>
              </p>
            </q-card-section>
          </q-card>
        </div>
      </template>

      <template v-slot:after>
        <!-- <q-tab-panels
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
                  v-for="t in [
                    {
                      name: 'previous',
                      label: 'Früher',
                      lifts: {
                        all: stats.liftsAll,
                        driver: stats.liftsOffered,
                      },
                    },
                    {
                      name: 'current',
                      label: 'Aktuell',
                      lifts: {
                        all: stats.liftCount,
                        driver: stats.driverCount,
                      },
                    },
                  ]"
                  :key="t.name"
                  :name="t.name"
                >
                  <p>{{ t.label }}</p>

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
              </q-tab-panels>
            </q-list>
          </q-tab-panel>
        <q-tab-panel name="friends" class="q-pa-xs">-->
        <q-list>
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
                  <!-- friendInfoData = friend -->
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
        </q-list>
        <!--  </q-tab-panel>
        </q-tab-panels>-->
      </template>
    </q-splitter>
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
  </div>
</template>
<script src="js/Vibrant.min.js"></script>
<script>
import { date } from "quasar";

import ExtHr from "components/ExtendedHr";
import ColoredMeter from "components/ColoredMeter";
import QrGen from "components/QrGenerator";
import QrIcon from "components/QrIcon";
import TitleButtonAnchor from "components/TitleButtonAnchor";

import {
  buildGetRequestUrl,
  sendApiRequest,
  GET_USER_PROFILE_PIC,
  SQL_UPDATE_PROFILE_PICTURE,
  SQL_RESET_PROFILE_PICTURE
} from "../ApiAccess";

export default {
  name: "ProfileTopSection",
  components: {
    ExtHr,
    QrGen,
    QrIcon,
    TitleButtonAnchor
  },
  props: {
    username: String,
    stats: Object
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
      uploadingProfilePicture: false
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

    getProminentColor() {
      var img = document.getElementById("profile_image");
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
