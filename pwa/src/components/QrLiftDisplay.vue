<template>
  <!-- this component is used to display a lift transferred via StudiCar Code -->
  <q-dialog
    :value="!!liftData && !denied"
    persistent
    @hide="hide"
    full-width
    square
    position="bottom"
    transition-hide="flip-down"
  >
    <q-card>
      <q-card-section>
        <div v-if="lift && !alreadyMemberOfLift">
          <p class="text-subtitle2">
            {{ invitingUserName }} hat dich zu einer Fahrgemeinschaft
            eingeladen:
          </p>
          <p v-if="lift.requested" class="text-caption text-red">
            Du hast hier schon angefragt, Antwort steht noch aus
          </p>
          <LiftOffer :lift="lift" @request="emitRequest" noShadow />
          <q-item v-if="!prefsMatching">
            <q-item-section avatar>
              <q-icon name="warning" color="negative" />
            </q-item-section>
            <q-item-section>
              <q-item-label
                >Deine Präferenzen scheinen nicht zu denen von
                {{ lift.driver.name }} zu passen.</q-item-label
              >
            </q-item-section>
          </q-item>
        </div>
        <q-item v-else-if="alreadyMemberOfLift">
          <q-item-section avatar>
            <q-avatar size="4em">
              <q-icon name="info" />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>Info zur Einladung</q-item-label>
            <q-item-label caption
              >Ihr seid bereits beide in der Fahrgemeinschaft.</q-item-label
            >
          </q-item-section>
        </q-item>
        <q-item v-else-if="err">
          <q-item-section avatar>
            <q-avatar size="4em">
              <q-icon name="error_outline" color="negative" />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>Anfrage fehlgeschlagen</q-item-label>
            <q-item-label caption
              >Fehler {{ err.status }}: {{ err.data }}</q-item-label
            >
          </q-item-section>
        </q-item>
        <div v-else>
          <q-item>
            <q-item-section avatar>
              <q-circular-progress
                indeterminate
                size="md"
                color="primary"
                class="q-ma-md"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-subtitle1"
                >StudiCar überprüft deine Einladung</q-item-label
              >
              <q-item-label caption>Bitte hab einen Moment Geduld</q-item-label>
            </q-item-section>
          </q-item>
        </div>
      </q-card-section>
      <q-card-section actions class="text-right" bordered>
        <q-btn
          @click="denied = true"
          label="Abbrechen"
          class="q-my-none"
          flat
          color="negative"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useUserStore } from 'src/stores/user';

let viewTab = 'info';
let lift = null; // is the lift object returned by the server
let err = null;
let alreadyMemberOfLift = false;
let invitingUserName = null;
let denied = false;
let liftData = ''; // computed property makes no sence because url as depending value is not reactive as well

const userStore = useUserStore();

const $route = useRoute();

const liftId = computed(() => {
  if (liftData) return parseInt(liftData.split('#i')[0]);
  else return -1;
});

const invitingUserId = computed(() => {
  return liftData.split('#i')[1];
});

const userPrefs = computed(() => {
  return userStore.user.prefs;
});

const prefsMatching = computed(() => {
  if (!lift) return null;
  var liftPrefs = lift.driver.prefs;
  var matching = Object.keys(liftPrefs).every((pref) => {
    var liftPrefValue = prefToInt(liftPrefs[pref]),
      userPrefValue = prefToInt(userPrefs[pref]);

    return liftPrefValue >= userPrefValue;
    function prefToInt(val) {
      switch (val) {
        case 'GREEN':
          return 0;
        case 'YELLOW':
          return 1;
        case 'RED':
          return 2;
      }
    }
  });

  return matching;
});

watch($route, () => {
  // const forceReloadData = true

  denied = false; // new round, new luck
  refresh();
});

function emitRequest(val) {
  $emit('request', val); // model is string
  hide(); // close it after requesting
}

function hide() {
  denied = true; // just to be sure, in case user made it to close without denying
}

function refresh() {
  var locArr = window.location.href.split('?qrLiftData=');
  if (locArr.length > 1) {
    var data = locArr[1];
    data = data.split('#0.')[0]; // cut the random part
    if (liftData != data) {
      liftData = data;
      lift = null; // when new data wanted, vars are reset again
    }
    var currentLifts = userStore.user.chatLifts,
      a = currentLifts.find((l) => l.id == liftId);
    if (a) {
      alreadyMemberOfLift = true;
      lift = null; // to be sure
    } else {
      callServer();
    }
  } else liftData = '';
}

function callServer() {
  sendApiRequest(
    SQL_GET_MARKETPLACE_OFFER,
    {
      uuid: liftId, // a uuid, is as a longer and more secure liftId
      invitingUserId: invitingUserId,
    },
    (data) => {
      lift = data.lift;
      invitingUserName = data.invitingUserName;
    },
    (err_) => {
      err = err_;
    }
  );
}

onMounted(() => {
  refresh();
});
</script>

<style lang="scss" scoped></style>
