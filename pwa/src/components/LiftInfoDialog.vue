<template>
  <q-dialog
    :value="value"
    transition-show="slide-left"
    transition-hide="slide-right"
    maximized
    @input="emit"
  >
    <div
      v-if="lift"
      v-touch-swipe.mouse.right="swipedToRight"
      v-touch-swipe.mouse.left="closeLift"
    >
      <div class="row justify-end">
        <div
          class="col-2 text-right column justify-center q-pr-md text-primary bg-white"
        >
          Info
        </div>
        <div class="col-2 bg-white text-primary">
          <q-toolbar>
            <q-toolbar-title class="text-uppercase">
              <q-btn
                v-ripple
                icon="close"
                flat
                round
                dense
                @click="emit(false)"
                v-touch-hold:300.mouse="closeLift"
              />
            </q-toolbar-title>
          </q-toolbar>
        </div>
      </div>
      <div class="bg-white q-pa-md" style="min-height: 100vh">
        <q-list class="q-mt-md bg-white">
          <q-item dense class="q-mb-md">
            <q-item-section>
              <q-item-label class="text-h5 text-weight-light"
                >Fahrtdetails</q-item-label
              >
            </q-item-section>
          </q-item>
          <q-item-label header>
            <div class="row justify-between">
              <span>Verlauf</span>
              <q-item-label caption>
                <q-icon
                  name="loop"
                  size="xs"
                  class="q-mr-xs"
                  v-if="isRepeating"
                />
                <q-icon name="query_builder" size="xs" class="q-mr-xs" v-else />
                {{ formattedDate }}
              </q-item-label>
            </div>
          </q-item-label>

          <ExpansionLiftTimeline :lift="lift"></ExpansionLiftTimeline>
          <q-separator />
          <q-item-label header>Fahrzeug</q-item-label>
          <CompactCarInfo :car="lift.car" expandable />
          <q-item-label header>
            <div v-if="lift.passengers">
              Teilnehmer
              <br />
              <small class="text-caption" style="font-size: 0.7em"
                >Tippe, um zum jeweiligen Profil zu kommen</small
              >
              <span class="text-caption float-right">
                {{ lift.passengers.length + 1 }} /
                {{ lift.car.seatsWithoutDriver + 1 }}
                <q-icon
                  name="person"
                  size="xs"
                  v-if="lift.passengers.length < lift.car.seatsWithoutDriver"
                />
                <q-icon name="how_to_reg" color="positive" size="xs" v-else />
              </span>
            </div>
            <span v-else class="text-caption float-right">
              0 / {{ lift.car.seatsWithoutDriver }}
              <q-icon name="person" size="xs" />
            </span>
          </q-item-label>
          <q-item v-ripple clickable @click="viewUserFromFbId(lift.driver.id)">
            <q-item-section top avatar>
              <q-avatar>
                <img
                  :key="keyToRefreshImages"
                  :src="imageUrlTable[lift.driver.id]"
                />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <p class="q-mb-none">
                {{ !isDriver ? lift.driver.name : 'Du' }}
                <q-badge class="q-ml-sm" transparent color="white">
                  <q-icon name="directions_car" size="xs" color="black" />
                </q-badge>
              </p>

              <small v-if="!isDriver">{{ lift.driver.surname }}</small>
            </q-item-section>
            <q-item-section side>
              <div class="row justify-around">
                <q-btn
                  v-for="pref in [
                    {
                      val: 'talk',
                      icon: 'record_voice_over',
                    },
                    {
                      val: 'talkMorning',
                      icon: 'alarm',
                    },
                    {
                      val: 'smoking',
                      icon: 'smoking_rooms',
                    },
                    {
                      val: 'music',
                      icon: 'music_note',
                    },
                  ]"
                  :key="pref.val"
                  outline
                  rounded
                  dense
                  class="q-pa-xs"
                  :color="betterPrefColor(pref.val)"
                  size="sm"
                >
                  <q-icon :name="pref.icon" color="grey-7" />
                </q-btn>
              </div>
            </q-item-section>
          </q-item>
          <q-separator />
          <div v-if="lift.passengers">
            <div class="row justify-between">
              <q-item
                clickable
                v-ripple
                @click="viewUserFromFbId(item.id)"
                class="col-6"
                v-for="item in lift.passengers"
                :key="item.id"
              >
                <q-item-section top avatar>
                  <q-avatar>
                    <img
                      :key="keyToRefreshImages"
                      :src="imageUrlTable[item.id]"
                    />
                  </q-avatar>
                </q-item-section>

                <q-item-section v-if="item.id != myFbId">
                  <q-item-label>
                    {{ item.name }}
                    <br />
                    <small>{{ item.surname }}</small>
                  </q-item-label>
                  <q-item-label caption></q-item-label>
                </q-item-section>
                <q-item-section v-else>
                  <q-item-label>Du</q-item-label>
                </q-item-section>

                <!-- <q-item-section side>
                <q-btn icon="arrow_forward_ios" outline dense rounded size="sm" />
                </q-item-section>-->
              </q-item>
            </div>
          </div>
          <p v-else class="text-center q-mt-sm text-grey-7">
            Du hast noch keine Mitfahrer
          </p>
          <q-expansion-item>
            <template v-slot:header>
              <q-item>
                <q-item-section>
                  <q-item-label>Optionen</q-item-label>
                </q-item-section>
                <q-item-section avatar>
                  <q-avatar>
                    <q-icon name="settings" color="dark" />
                  </q-avatar>
                </q-item-section>
              </q-item>
            </template>
            <q-card>
              <q-card-section>
                <q-btn
                  :disable="!isDriver"
                  color="dark"
                  outline
                  @click="openEditTime = true"
                  class="q-my-sm"
                  icon="update"
                  label="Fahrtzeit bearbeiten"
                />
                <q-btn
                  :disable="isDriver && !!lift.passengers.length"
                  color="dark"
                  outline
                  @click="leave"
                >
                  <q-icon name="logout" color="negative" />
                  <span class="q-ml-sm" v-if="isDriver"
                    >Mitfahrgelegenheit auflösen</span
                  >
                  <span class="q-ml-sm" v-else>Verlassen</span>
                  <q-tooltip
                    anchor="top middle"
                    style="border-bottom: 1px solid black"
                    :content-class="`bg-white text-dark`"
                    self="bottom middle"
                    :offset="[10, 10]"
                    >Hinweis: Wenn du noch Mitfahrer hast, dann kannst du als
                    Fahrer nicht einfach so absagen.</q-tooltip
                  >
                </q-btn>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
      </div>
      <q-dialog v-model="showModelFrame" full-height full-width>
        <q-card class="bg-white">
          <q-card-section style="height: 70vh">
            <q-item-label class="q-mb-sm">
              Modell online ansehen
              <q-badge>BETA</q-badge>
            </q-item-label>
            <vue-friendly-iframe style="height: 70vh" :src="modelUrl" />
          </q-card-section>
        </q-card>
      </q-dialog>

      <SettingScope
        v-model="openEditTime"
        @show="loadCurrentTime"
        :uploading="uploading"
        property="Fahrzeit"
        :disableSave="!areTimeChanges"
      >
        <template v-slot:description>
          Der Termin der Fahrt setzt sich aus zwei Komponenten zusammen:
          <ul>
            <li>
              Tag: Der Tag kann entweder ein festes Datum oder ein
              wiederkehrender Wochentag sein.
            </li>
            <li>
              Zeit: Die Zeit an sich kann willkürlich gewählt werden, es wird
              allerdings immer nur die Zeit an der DH gespeichert: Abfahrtzeit
              bei Start, Ankunftszeit bei Fahrtende. Somit ist die Wahl der
              beiden Optionen mit der Reihenfolge der Stationen verbunden, die
              im Moment noch nicht geändert werden kann.
            </li>
          </ul>
        </template>

        <LiftEditDateTime v-model="newTime" />
      </SettingScope>
    </div>
  </q-dialog>
</template>

<script setup>
import { useUserStore } from 'src/stores/user';
import { buildGetRequestUrl, GET_USER_PROFILE_PIC } from 'src/utils/ApiAccess';
import { onMounted } from 'vue';

const props = defineProps({
  value: Boolean,
  lift: Object,
});
const { value, lift } = toRefs(props);

const userStore = useUserStore();

let showModelFrame = false;
let imageUrlTable = {};
let openEditTime = false;
newTime = {
  dateTab: 'fix',
  timeTab: 'arrive',
  date: null,
  time: null,
};
let oldTime = {};
let uploading = false;
let keyToRefreshImages = 0;

const modelUrl = computed(() => {
  var car = lift.car;
  var humanColor = '';

  var search = `${car.brand}+${car.model.replace(' ', '')}+${
    car.type
  }+${humanColor}`;
  search = search.replaceAll('+', '%20');
  return 'https://www.pexels.com/search/' + search;
});

const isRepeating = computed(() => {
  return lift.repeatsOn != 0;
});

const getRepeatingDayOptions = computed(() => {
  return [
    'Montag',
    'Dienstag',
    'Mittwoch',
    'Donnerstag',
    'Freitag',
    'Samstag',
  ].map((val, index) => ({
    label: val,
    value: index + 1,
  }));
});

const getRepeatingWeekday = computed(() => {
  // getter for display in overview
  if (!isRepeating) return null;
  var day = getRepeatingDayOptions.find((d) => d.value == lift.repeatsOn);
  return day ? day.label : null;
});

const isDriver = computed(() => {
  return lift.driver.id == userStore.user.uid;
});

const myFbId = computed(() => {
  return userStore.user.uid;
});

const formattedDate = computed(() => {
  if (isRepeating) return 'jeden ' + getRepeatingWeekday;
  var liftDate = new Date(lift.date + ' ' + lift.arriveBy),
    daysLeft = date.getDateDiff(liftDate, new Date(), 'days'),
    text = () => {
      switch (daysLeft) {
        case 0:
          return 'Fahrt ist heute';
          break;
        case 1:
          return 'Fahrt ist morgen';
          break;
        case 2:
          return 'Fahrt ist übermorgen';
          break;
        case -1:
          return 'Fahrt war gestern';
          break;
        case -2:
          return 'Fahrt war vorgestern';
          break;
        default:
          if (daysLeft < 0) return 'Fahrt war';
          else if (daysLeft <= 7) return 'Fahrt ist in ' + daysLeft + ' Tagen';
          else return 'Fahrt ist erst';
      }
    };
  return text() + ' am ' + date.formatDate(liftDate, 'DD.MM.');
});

const areTimeChanges = computed(() => {
  return JSON.stringify(oldTime) != JSON.stringify(newTime);
});

function emit(val) {
  $emit('input', val);
}
function closeLift() {
  $emit('closeLift');
}
function swipedToRight() {
  emit(false);
}

function loadCurrentTime() {
  if (isRepeating) {
    newTime.dateTab = 'weekly';
    newTime.date = lift.repeatsOn;
  } else {
    newTime.dateTab = 'fix';
    newTime.date = date.formatDate(new Date(lift.date), 'YYYY-MM-DD');
  }

  if (lift.arriveBy != '00:00:00') {
    newTime.timeTab = 'arrive';
    newTime.time = lift.arriveBy.substr(0, 5);
  } else {
    newTime.timeTab = 'depart';
    newTime.time = lift.departAt.substr(0, 5);
  }

  oldTime = JSON.parse(JSON.stringify(newTime)); // so that user can see whether he has made changes
}

async function getImageOfUser(id) {
  imageUrlTable[id] = await buildGetRequestUrl(GET_USER_PROFILE_PIC, {
    fbid: id,
  });
}

function betterPrefColor(prefName) {
  var color = lift.driver.prefs[prefName].toLowerCase();
  if (color == 'yellow') return 'orange';
  else return color;
}

function viewUserFromFbId(id) {
  window.location.href = '/#/benutzerinfo?userFbId=' + id;
}

function leave() {
  $q.dialog({
    title: 'Verlassen',
    message: `Willst du diese Mitfahrgelegenheit wirklich ${
      isDriver
        ? 'auflösen?'
        : 'verlassen? Deine Nachrichten bleiben ohne Namensanzeige erhalten.'
    }`,
    ok: {
      color: 'negative',
    },
    cancel: {
      color: 'white',
    },
    cancel: true,
    persistent: true,
  })
    .onOk(() => {
      $emit('closeAndLeave', {
        liftId: lift.id,
        wasDriver: isDriver,
      });
    })
    .onCancel();
}

onMounted(async () => {
  await getImageOfUser(lift.driver.id);
  for (const p of lift.passengers) {
    await getImageOfUser(p.id);
  }
  const lift = imageUrlTable;
  keyToRefreshImages++;
});
</script>

<style lang="scss" scoped></style>
