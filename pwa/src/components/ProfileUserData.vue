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
      <q-card-section class="q-pb-sm q-pt-xs">
        <div class="row justify-between q-mb-xs">
          <div class="text-uppercase text-caption q-mt-xs">Über Mich</div>
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
          <div v-else>- noch keine Beschreibung hinterlegt -</div>
        </div>
      </q-card-section>
    </q-card>
    <q-dialog
      :value="!!friendInfoData"
      @input="(e) => (friendInfoData = !!e)"
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

    <QrGenerator
      v-model="shareProfileQR"
      :label="username"
      linearProgress
      :input="qrInput"
      text="Lass einen anderen StudiCar Nutzer den Code mit dem Scanner (rechts oben in StudiCar) lesen oder teile die Daten direkt über WhatsApp"
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
                    :disable="!newPPictureBase64 || uploadingProfilePicture"
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
          <template v-slot:before>
            <q-tabs v-model="openEditPrefsTab" vertical class="text-primary">
              <q-tab name="talk" icon="record_voice_over" />
              <q-tab name="talkMorning" icon="alarm" />
              <q-tab name="smoking" icon="smoking_rooms" />
              <q-tab name="music" icon="music_note" />
            </q-tabs>
          </template>
          <template v-slot:after>
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
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar';

const $q = useQuasar();
defineExpose({ $q });

import { useAppStore } from 'src/stores/app';
import { useUserStore } from 'src/stores/user';
import { buildGetRequestUrl, GET_USER_PROFILE_PIC } from 'src/utils/ApiAccess';

const props = defineProps({
  username: String,
});
const { username } = toRefs(props);

const userStore = useUserStore();
const appStore = useAppStore();

const ppPath = ref('');
const openUpload = ref(false);
const shareProfileQR = ref(false);
const friendInfoData = ref(null);
const statsFriendsTab = ref('stats');
const statsTimeTab = ref('current');
const file = ref(null);
const newPPictureBase64 = ref('');
const friendsPage = ref(0);
const uploadingProfilePicture = ref(false);
const prefExpanded = ref(false);

const openEditPrefs = ref(false); // prefs settings
const openEditPrefsTab = ref('talk');
const newPrefs = ref({
  talk: '',
  talkMorning: '',
  smoking: '',
  music: '',
});
const prefsDocu = ref(appStore.prefsDocu);
const imageForColors = ref(null);

const openEditDescription = ref(false);
const newDescription = ref('');

function loadFile(event) {
  const file = event.target.files[0];
  const size = 300; // represents the height
  const ratio = 1; // default ratio at profile pictures

  const width = size * ratio;
  const reader = new FileReader();
  reader.onerror = (error) => console.log(error);
  reader.readAsDataURL(file);
  reader.onload = (event) => {
    var img = new Image();
    img.src = event.target.result;

    (img.onload = () => {
      const elem = document.getElementById('newImage');
      elem.width = width;
      elem.height = size;

      const ctx = elem.getContext('2d');
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
      newPPictureBase64 = elem.toDataURL();
    }),
      (reader.onerror = (error) => {
        alert(error);
      });
  };
}

function uploadProfilePicture() {
  if (newPPictureBase64) {
    uploadingProfilePicture = true;
    sendApiRequest(
      SQL_UPDATE_PROFILE_PICTURE,
      {
        imageData: newPPictureBase64,
      },
      () => {
        ppPath.value += '&timestamp=' + Date.now();
        openUpload = false;
        file = null;
        newPPictureBase64 = '';
        uploadingProfilePicture = false;
      },
      () => {
        uploadingProfilePicture = false;
      }
    );
  }
}

function resetPP() {
  $q.dialog({
    title: 'Bild zurücksetzen',
    message:
      'Willst du dein Bild wirklich zurücksetzen? StudiCar speichert dann ein anonymes Ersatzbild.',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    uploadingProfilePicture = true;
    sendApiRequest(
      SQL_RESET_PROFILE_PICTURE,
      {},
      () => {
        ppPath.value += '&timestamp=' + Date.now();
        openUpload = false;
        uploadingProfilePicture = false;
      },
      () => {
        uploadingProfilePicture = false;
      }
    );
  });
}

function betterPrefColor(color) {
  if (color == 'GREEN') color = 'green-8';
  // first convert color if neccessary
  else if (color == 'YELLOW') color = 'orange';
  return color.toLowerCase(); // always return lower case
}

function toggleOpenEditPrefs(save) {
  if (openEditPrefs) {
    // open, shall be closed, so prefs have to be converted and stored back to original var (only when save)
    if (save) {
      prefs = newPrefs; // just to minimize traffic, prefs are only stored when clicking on save (respectively closing dialog)
      newPrefs = {
        talk: '',
        talkMorning: '',
        smoking: '',
        music: '',
      };
    } else {
      newPrefs = {
        // just to make sure
        talk: '',
        talkMorning: '',
        smoking: '',
        music: '',
      };
    }
  } else {
    // still closed, shall be opened, so we have to copy (and first convert) prefs to another var

    newPrefs = prefs;
  }

  openEditPrefs = !openEditPrefs;
}

function toggleOpenEditDescription() {
  if (openEditDescription) {
    // already open
    description = newDescription;
  } else {
    // still closed
    newDescription = description;
  }
  openEditDescription = !openEditDescription;
}

const friends = computed(() => {
  return userStore.user.topFriends;
});

const friendsGroup4 = computed(() => {
  const pageSize = 4;

  var arr = [];

  friends.forEach((f, index) => {
    if (index % pageSize == 0) {
      // e.g. when pageSize is 4 then a new "page" will be generated at indices 4, 8, 12 ...
      arr.push([f]); // directly push new page and this friend
    } else arr[Math.floor(index / pageSize)].push(f);
  });
  return arr;
});

const profileColor = computed(() => {
  return 'white';
});

const atLeastFiveWords = computed(() => {
  if (username == 'Bernd') {
    return true;
  } else {
    var splitted = newDescription.split(' ');
    var length = splitted.length;
    var lastItemIsWord = splitted[length - 1] != '';
    return length > 5 ? true : length >= 5 && lastItemIsWord; // when more than 5 words, just return true
  }
});

const since = computed(() => {
  return date.formatDate(
    // user statistics, cannot directly be changed by user
    userStore.user.stats.createdAt,
    'MMMM YYYY',
    {
      months: [
        'Januar',
        'Februar',
        'März',
        'April',
        'Mai',
        'Juni',
        'Juli',
        'August',
        'September',
        'Oktober',
        'November',
        'Dezember',
      ],
    }
  );
});

const qrInput = computed(() => {
  const uid = userStore.user.uid;
  return {
    type: 'user',
    data: uid,
  };
});

const prefs = computed({
  get: () => {
    return userStore.user.prefs;
  },
  set: (value) => {
    userStore.updatePrefs(value);
  },
});
const description = computed({
  get: () => {
    return userStore.user.bio;
  },
  set: (value) => {
    userStore.updateDescription(value);
  },
});

onMounted(() => {
  buildGetRequestUrl(GET_USER_PROFILE_PIC, {
    fbid: userStore.user.uid,
  }).then((url) => {
    ppPath.value = url;
  });
});
</script>

<style scoped></style>
