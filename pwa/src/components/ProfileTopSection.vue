<template>
  <div>
    <q-splitter :value="50" disable>
      <template v-slot:before>
        <div class="q-px-md q-py-sm">
          <q-card>
            <q-card-section class="q-pa-none">
              <div class>
                <q-img
                  spinner-color="primary"
                  class="rounded-borders"
                  spinner-size="82px"
                  :src="ppPath"
                >
                  <template v-slot:error>
                    <div class="absolute-full flex flex-center text-white">
                      Wir konnten dein Bild nicht laden. Bitte stelle eine
                      Internetverbindung her, um dein Profilbild zu sehen.
                    </div>
                  </template>
                </q-img>
                <q-badge floating class="q-pa-none" style="background-color: transparent">
                  <q-btn
                    round
                    color="black"
                    size="sm"
                    icon="delete"
                    @click="resetPP()"
                    class="q-mr-sm"
                  />
                  <q-btn round color="black" size="sm" icon="edit" @click="openUpload = true" />
                </q-badge>
              </div>
            </q-card-section>

            <q-card-section class="row q-pb-none">
              <div
                class="col-8 text-h5 text-weight-light text-left q-mt-none q-mb-xs custom-overline c-o-1 c-o-l c-o-sm"
              >{{ username }}</div>
              <p class="col-4">
                <q-btn icon="select_all" @click="shareProfileQR = true" flat />
              </p>
            </q-card-section>
          </q-card>
          <br />
          <div class="full-width text-right">
            <q-btn-toggle
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
            </q-btn-toggle>
          </div>
        </div>
      </template>

      <template v-slot:after>
        <q-tab-panels
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

                  <!-- <q-item class="q-pa-none">
                    <q-item-section>
                      <q-avatar
                        color="white"
                        class="text-weight-light"
                        text-color="dark"
                      >{{ t.lifts.all }}</q-avatar>
                    </q-item-section>
                    <q-item-section avatar>
                      <q-circular-progress
                        show-value
                        font-size="16px"
                        class="text-primary q-ma-sm"
                        :value="Math.round(t.lifts.driver / t.lifts.all * 100)"
                        size="xl"
                        :thickness="0.05"
                        color="primary"
                        track-color="grey-3"
                      >
                        <q-icon name="emoji_people" color="dark" />
                        {{ t.lifts.driver }}
                      </q-circular-progress>
                    </q-item-section>
                  </q-item>-->

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
                <!-- <q-tab-panel name="current">
                  <q-item class="q-pt-md">
                    <q-item-section>
                      im Moment
                      <q-avatar
                        color="white"
                        class="text-weight-light"
                        text-color="dark"
                      >{{ stats.liftCount }}</q-avatar>
                    </q-item-section>
                    <q-item-section avatar>
                      <q-circular-progress
                        show-value
                        font-size="16px"
                        class="text-primary q-ma-sm"
                        :value="Math.round(stats.driverCount / stats.liftCount * 100)"
                        size="xl"
                        :thickness="0.05"
                        color="primary"
                        track-color="grey-3"
                      >
                        <q-icon name="directions_car" color="dark" />
                        {{ stats.driverCount }}
                      </q-circular-progress>
                    </q-item-section>
                  </q-item>
                </q-tab-panel>-->
              </q-tab-panels>
            </q-list>
          </q-tab-panel>
          <q-tab-panel name="friends">
            <q-list>
              <q-item-label header class="q-pt-xs q-pb-xs text-uppercase text-caption">Dabei seit</q-item-label>
              <q-item>{{ since }}</q-item>
              <q-item-label header class="q-pt-xs q-pb-xs text-uppercase text-caption">Freunde</q-item-label>
              <q-item>
                <p class="text-caption">Du hast noch keine Nutzer als Freunde markiert</p>
              </q-item>
            </q-list>
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>

    <QrGen
      v-model="shareProfileQR"
      :label="username"
      linearProgress
      :input="qrInput"
      text="Über diesen Code können auch Nutzer außerhalb von Fahrgemeinschaften dein Profil besuchen."
    />

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
                    icon="backup"
                    :disable="!this.newPPictureBase64"
                    @click="uploadProfilePicture()"
                    class="vertical-middle"
                  />
                  <br />
                  <br />
                  <q-btn flat icon="backspace" @click="file = null" />
                </div>
              </div>
            </q-slide-transition>
            <br />
            <p v-if="!file" class="text-caption">
              Bitte stelle sicher, dass du auf dem Bild gut zu sehen bist.
              Vergewissere dich außerdem, dass du berechtigt bist, dieses Bild
              hochzuladen.
            </p>
            <p v-if="file" class="text-caption">
              Wir haben dein Bild etwas zugeschnitten, damit es den
              Abmessungen für Profilbilder entspricht.
            </p>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { date } from "quasar";
import ExtendedHr from "components/ExtendedHr";
import ColoredMeter from "components/ColoredMeter";
import QrGen from "../components/QrGenerator";

import {
  buildGetRequestUrl,
  sendApiRequest,
  GET_USER_PROFILE_PIC,
  SQL_UPDATE_PROFILE_PICTURE,
  SQL_RESET_PROFILE_PICTURE,
} from "../ApiAccess";

export default {
  name: "ProfileTopSection",
  components: {
    ColoredMeter,
    QrGen,
  },
  props: {
    username: String,
    stats: Object,
  },
  data() {
    return {
      ppPath: "",
      openUpload: false,
      shareProfileQR: false,
      statsFriendsTab: "stats",
      statsTimeTab: "current",
      file: null,
      newPPictureBase64: "",
    };
  },
  computed: {
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
            "Dezember",
          ],
        }
      );
    },

    qrInput() {
      const id = this.$store.getters["auth/user"].uid;

      return "u" + id;
    },
  },
  methods: {
    loadFile(file) {
      this.file = file;
      const size = 300, // represents the height
        ratio = 1; // default ratio at profile pictures

      const width = size * ratio,
        fileName = file.name,
        reader = new FileReader();
      reader.onerror = (error) => console.log(error);
      reader.readAsDataURL(file);
      reader.onload = (event) => {
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
          (reader.onerror = (error) => {
            alert(error);
          });
      };
    },

    uploadProfilePicture() {
      if (this.newPPictureBase64)
        sendApiRequest(
          SQL_UPDATE_PROFILE_PICTURE,
          {
            imageData: this.newPPictureBase64,
          },
          (_) => {
            this.ppPath += "&timestamp=" + Date.now();
            this.openUpload = false;
            this.file = null;
            this.newPPictureBase64 = "";
          }
        );
    },

    resetPP() {
      this.$q
        .dialog({
          title: "Bild zurücksetzen",
          message: "Willst du dein Bild wirklich zurücksetzen?",
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          sendApiRequest(SQL_RESET_PROFILE_PICTURE, {}, (_) => {
            this.ppPath += "&timestamp=" + Date.now();
          });
        })
        .onCancel(() => {});
    },
  },
  mounted() {
    buildGetRequestUrl(
      GET_USER_PROFILE_PIC,
      { fbid: this.$store.getters["auth/user"].uid },
      (url) => {
        this.ppPath = url;
      }
    );
  },
};
</script>

<style scoped>
</style>