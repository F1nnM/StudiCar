<template>
  <div>
    <div class="q-mr-md q-mt-md">
      <TitleButtonAnchor>
        <!-- <q-btn label="Freunde" to="/friends" outline color="primary" /> -->
        <q-tabs
          v-model="tab"
          dense
          switch-indicator
          class="text-gray-7"
          active-color="gray"
          indicator-color="primary"
          align="justify"
        >
          <q-tab name="data" icon="person_outline" />
          <q-tab name="reservoir" icon="emoji_transportation" />
        </q-tabs>
      </TitleButtonAnchor>
    </div>

    <q-tab-panels
      v-model="tab"
      animated
      swipeable
      transition-prev="jump-down"
      transition-next="jump-up"
      class="q-pt-0"
    >
      <q-tab-panel name="data">
        <ProfileUserData :username="username" />
      </q-tab-panel>
      <q-tab-panel name="reservoir">
        <ProfileOtherData />
      </q-tab-panel>
    </q-tab-panels>
    <!--  <q-tab-panel name="data" class="q-mt-sm q-pt-none">
          <div class="q-pa-sm shadow-1">
            <p class="text-uppercase text-caption q-mt-xs q-mb-xs">Über Mich</p>
            <div class="row q-py-md">
              <span class="text-caption text-grey-7 q-mb-none col-10"
                >Kurzbeschreibung</span
              >
              <div class="col-2">
                <q-btn
                  size="sm"
                  flat
                  color="black"
                  icon="edit"
                  @click="toggleOpenEditDescription"
                />
              </div>
              <div v-if="description">{{ description }}</div>
              <div v-else class="text-weight-light">
                - noch keine Beschreibung hinterlegt -
              </div>
            </div>

            <q-select
              v-model="gender"
              transition-show="jump-up"
              transition-hide="jump-up"
              :options="genderOptions"
              label="Geschlecht"
              behavior="menu"
              borderless
            />
          </div> -->

    <q-dialog v-model="editDistance" full-height full-width persistent>
      <q-card class="column full-height">
        <q-card-section class="q-pb-none">
          <div class="text-h6">Entfernung einstellen</div>
        </q-card-section>
        <q-card-section>
          <p class="text-caption">
            Wie weit soll deine Mitfahrgelegenheit maximal von dir entfernt
            sein?
            <br />
            <small>
              Bitte hab Verständnis, dass StudiCar noch mit Luftlinien rechnet.
              Echte Routen sollen aber bald kommen.
            </small>
          </p>

          <q-slider
            v-model="newLiftMaxDistance"
            :min="5"
            :max="40"
            :step="5"
            snap
            label-always
            :label-value="newLiftMaxDistance + ' km'"
            color="primary"
          />
          <div style="min-height: 30vh"></div>
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Abbrechen" v-close-popup />
          <q-btn
            flat
            label="Speichern"
            @click="toggleEditLiftMaxDistance"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { useAppStore } from 'src/stores/app';
import { useUserStore } from 'src/stores/user';

const userStore = useUserStore();
const appStore = useAppStore();

let stats = userStore.user.stats;
let username = userStore.user.name.split(' ')[0];
let newLiftMaxDistance = 0; // basic profile setting
let editDistance = false;
let genderOptions = ['Männlich', 'Weiblich', 'Divers'];

let groupIcon = mdiAccountGroupOutline;

let tab = 'data'; // vue models which doesn't belong to specific function

onMounted(() => {
  var locArr = window.location.href.split('?tab=');
  tab = locArr.length > 1 ? locArr[1] : 'data';

  appStore.setPage({
    name: 'Profil',
  });
});

function toggleEditLiftMaxDistance() {
  if (editDistance) {
    // already open
    liftMaxDistance = newLiftMaxDistance;
  } else {
    // still closed
    newLiftMaxDistance = liftMaxDistance;
  }
  editDistance = !editDistance;
}

const gender = computed({
  get() {
    switch (userStore.user.gender) {
      case 'W':
        return 'Weiblich';
      case 'M':
        return 'Männlich';
      case 'D':
        return 'Divers';
      case 'X':
        return 'Keine Angabe';
      default:
        return 'Ein Fehler ist aufgetreten';
    }
  },
  set(value) {
    userStore.updateGender(value);
  },
});

const liftMaxDistance = computed({
  get() {
    return userStore.user.settings.liftMaxDistance;
  },
  set(value) {
    userStore.updateLiftMaxDistance(value);
  },
});

const dataSaver = computed({
  get() {
    return userStore.user.dataSaver;
  },
  set(value) {
    userStore.updateDataSaver(value);
  },
});

const meterModelBefore = computed(() => {
  var a = stats;
  return a.liftsOffered / a.liftsAll;
});
</script>
