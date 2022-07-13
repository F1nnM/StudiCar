<template>
  <div class="q-pa-md">
    <TitleButton>
      <div class="row justify-end">
        <q-tab-panels
          animated
          v-model="liftTab"
          transition-prev="jump-right"
          transition-next="jump-left"
          class="text-caption text-right q-pa-none"
        >
          <q-tab-panel
            class="text-caption text-right q-pa-none q-pr-sm q-pt-sm"
            v-for="item in bigTabOptions"
            :key="item.value"
            :name="item.value"
          >
            <q-slide-transition>
              <q-badge
                v-if="item.value == 'pending'"
                class="q-mx-xs"
                :color="totalRequests ? 'primary' : 'dark'"
                >{{ totalRequests }}</q-badge
              >
              <q-badge
                v-if="item.value == 'pending_out'"
                class="q-mx-xs"
                :color="totalRequests ? 'primary' : 'dark'"
                >{{ totalRequests }}</q-badge
              >
            </q-slide-transition>
            {{ item.label }}
          </q-tab-panel>
        </q-tab-panels>
        <q-btn-toggle
          v-model="liftTab"
          no-caps
          rounded
          dense
          unelevated
          outline
          toggle-color="primary"
          text-color="grey-5"
          color="white"
          :options="bigTabOptionsWithoutLabel"
        />
        <!-- 
          {value: 'outgoing', icon: 'ion-trending-up'}

        -->
      </div>
    </TitleButton>

    <q-tab-panels
      animated
      v-model="liftTab"
      transition-prev="fade"
      transition-next="fade"
    >
      <q-tab-panel name="pending" class="q-pa-none">
        <div v-if="totalRequests" class="row">
          <!-- <p class="text-caption">Du hast Anfragen für die folgenden Mitfahrgelegenheiten:</p> -->
          <!-- <div class="order-last q-ml-md" style="border-left: 6px dotted gray"></div> -->
          <div>
            <!-- <q-tabs
              v-model="pendingRequestTab"
              dense
              align="justify"
              class="text-grey-5 bg-white"
              :breakpoint="0"
            >
              <q-tab v-for="(lift, index) in liftRequests" :key="index" :name="index" />
            </q-tabs>-->
            <q-tab-panels
              swipeable
              animated
              v-model="pendingRequestTab"
              transition-prev="slide-right"
              transition-next="slide-left"
              class="text-caption q-pa-none"
            >
              <q-tab-panel
                v-for="(lift, index) in userStore.user.liftRequests"
                :key="lift.liftId"
                class="q-pa-none"
                :name="index"
              >
                <LiftOfferForRequest
                  :lift="getLiftFromId(lift.liftId)"
                  :numberOfRequests="lift.requestingUsers.length"
                  @acceptAll="acceptAllRequestsOfLift"
                  @left="switchTab(false)"
                  @right="switchTab(true)"
                >
                  <!--  <q-pagination
                    :value="pendingRequestTab + 1"
                    :max="liftRequests.length"
                    @input="val => { pendingRequestTab = val - 1 }"
                  ></q-pagination>-->
                  <div class="self-center">
                    <div class="text-center text-overline">
                      Seite {{ pendingRequestTab + 1 }}/{{
                        userStore.user.liftRequests.length
                      }}
                    </div>
                    <div class="row justify-between">
                      <q-btn
                        @click="switchTab(false)"
                        :disable="pendingRequestTab == 0"
                        icon="keyboard_arrow_left"
                        dense
                        flat
                        size="md"
                      />
                      <q-btn
                        @click="switchTab(true)"
                        :disable="
                          pendingRequestTab ==
                          userStore.user.liftRequests.length - 1
                        "
                        icon="keyboard_arrow_right"
                        dense
                        flat
                        size="md"
                      />
                    </div>
                  </div>
                </LiftOfferForRequest>
                <ExtHr color="grey-3" size="xs" />
                <div v-if="!(seatsLeft(lift.liftId) > 0)" class="text-negative">
                  Das Fahrzeug ist im Moment voll, du kannst keine Angebote
                  annehmen.
                </div>
                <div class="full-width">
                  <span
                    class="text-negative"
                    v-if="
                      !canAcceptAllRequests(lift) && seatsLeft(lift.liftId) > 0
                    "
                    >Du hast mehr Anfragen als noch Plätze frei sind!</span
                  >
                  <q-slide-item
                    left-color="white"
                    right-color="white"
                    class="q-my-sm"
                    @left="quickRespondLiftRequest(lift.liftId, r, true)"
                    @right="quickRespondLiftRequest(lift.liftId, r, false)"
                    v-for="r in lift.requestingUsers"
                    :key="r.id"
                  >
                    <template v-slot:left v-if="seatsLeft(lift.liftId) > 0">
                      <q-avatar>
                        <q-icon name="thumb_up" color="positive" size="sm" />
                      </q-avatar>
                      <span class="text-dark text-h6 text-uppercase">Ok</span>

                      <p class="text-grey-9">
                        Anfrage von {{ r.name }} annehmen
                      </p>
                    </template>
                    <template v-slot:right>
                      <q-avatar>
                        <q-icon name="thumb_down" color="negative" size="sm" />
                      </q-avatar>
                      <span class="text-dark text-h6 text-uppercase">Ne</span>

                      <p class="text-grey-9">
                        Anfrage von {{ r.name }} ablehnen
                      </p>
                    </template>
                    <div :key="keyToBeIncremented">
                      <IncomingLiftRequest
                        :requestingUser="r"
                        :liftId="lift.liftId"
                        :acceptDisabled="seatsLeft(lift.liftId) <= 0"
                        @respond="respondLiftRequest"
                      />
                    </div>
                  </q-slide-item>
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </div>
        </div>
        <div v-else class="text-caption">Im Moment hast du keine Anfragen.</div>
      </q-tab-panel>

      <q-tab-panel name="pending_out" class="q-pa-none">
        <div v-if="userStore.user.outgoingRequests.length">
          <LiftOffer
            v-for="r in userStore.user.outgoingRequests"
            :key="r.liftId"
            :lift="r"
            isAlreadyRequested
            @cancelRequest="cancelRequest"
          />
        </div>
        <div v-else class="text-caption">
          Im Moment sind von dir keine offenen Anfragen bei anderen Fahrten
          vorhanden.
        </div>
      </q-tab-panel>

      <q-tab-panel name="current" class="q-pa-none">
        <div v-if="lastMessages.length">
          <q-list class="q-pb-sm">
            <ChatItem
              v-for="(m, index) in recentChats"
              :key="m.timestamp + Math.random() + ''"
              :message="m"
              :sentByName="getNameFromId(m.liftId, m.sentBy)"
              :firstItem="index == 0"
              @open="openTheLift"
              @shortLiftInfo="openShortLiftInfo"
              @right="openShortLiftInfo"
              @left="openLiftWithDetails"
            />
            <q-item-label
              class="q-mt-lg"
              header
              v-if="olderChats.length > 0 && recentChats.length > 0"
              >Ältere Chats</q-item-label
            >
            <ChatItem
              v-for="(m, index) in olderChats"
              :key="m.timestamp + Math.random() + ''"
              :message="m"
              :sentByName="getNameFromId(m.liftId, m.sentBy)"
              :firstItem="index == 0"
              @open="openTheLift"
              @shortLiftInfo="openShortLiftInfo"
              @right="openShortLiftInfo"
              @left="openLiftWithDetails"
            />
          </q-list>
          <LiftPopup
            @shortLiftInfo="openShortLiftInfo"
            open="chatPopup.isOpen"
            :detailsOpen="chatPopup.detailsOpen"
            @detailsOpenUpdate="chatPopup.detailsOpen = $event"
            :lift="chatPopup.data"
            @closeLift="closeLift"
            @closeAndLeave="leave"
          />
          <QrGen
            position="bottom"
            v-model="liftCodePopup.isOpen"
            linearProgress
            :input="qrInput"
            text="Über diesen Code kannst du eine Fahrgemeinschaft direkt teilen."
          >
            {{ liftCodePopup.data ? liftCodePopup.data.start.name : '' }}
            <span class="q-mx-xs">›</span>
            {{ liftCodePopup.data ? liftCodePopup.data.destination.name : '' }}
          </QrGen>
        </div>
        <div v-else class="text-caption">
          Du nimmst noch an keinen Fahrten teil. Frage auf dem Marktplatz bei
          einer Fahrt an oder biete selber eine an.
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script setup>
import { useUserStore } from 'src/stores/user';
import { useAppStore } from 'src/stores/app';

import { date } from 'quasar';

const userStore = useUserStore();
const appStore = useAppStore();

const liftTab = ref('current');
const pendingRequestTab = ref(0);
const chatPopup = ref({
  isOpen: false,
  detailsOpen: false,
  data: null,
});
const liftCodePopup = ref({
  isOpen: false,
  data: null,
});
const keyToBeIncremented = ref(0);

watch(liftTab, (newTab) => {
  if (newTab == 'current') pendingRequestTab.value = 0; // fallback, because there are edge cases that hide incoming offers when this tab != 0
});

onMounted(() => {
  appStore.setPage({
    name: 'Fahrten',
  });
});

const lastMessages = computed(() => {
  var returnedArray = [];
  var lifts = JSON.parse(JSON.stringify(userStore.user.chatLifts));
  lifts.forEach((lift) => {
    if (
      lift.messages.length > 0 &&
      lift.messages[lift.messages.length - 1].content
    ) {
      var lastMessage = lift.messages[lift.messages.length - 1];
      returnedArray.push({
        liftId: lift.id,
        start: getCampusLabel(lift.start.id, lift.start.name),
        destination: getCampusLabel(lift.destination.id, lift.destination.name),
        sentBy: lastMessage.sentBy,
        type: lastMessage.type,
        content: lastMessage.content,
        timestamp: lastMessage.timestamp,
      });
    }
  });
  returnedArray.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  ); // sort descending, so swap compared values

  return returnedArray;
});
const recentChats = computed(() => {
  const now = new Date();
  const dayLimit = 14;
  return lastMessages.value.filter((m) => {
    return false == isOverLimit(m.timestamp, now, dayLimit);
  });

  function isOverLimit(stamp, now, dayLimit) {
    var diff = date.getDateDiff(now, new Date(stamp), 'days');
    return diff > dayLimit;
  }
});
const olderChats = computed(() => {
  const now = new Date();
  const dayLimit = 14;
  return lastMessages.value.filter((m) => {
    return true == isOverLimit(m.timestamp, now, dayLimit);
  });

  function isOverLimit(stamp, now, dayLimit) {
    var diff = date.getDateDiff(now, new Date(stamp), 'days');
    return diff > dayLimit;
  }
});
const withoutMessages = computed(() => {
  var returnedArray = [];
  var lifts = JSON.parse(JSON.stringify(userStore.user.chatLifts));
  lifts.forEach((lift, index) => {
    var hasMessageButNoContent = lift.messages.length
      ? !lift.messages[lift.messages.length - 1].content
      : true;
    if (lift.messages.length == 0 || hasMessageButNoContent) {
      returnedArray.push({
        liftId: lift.id,
        start: lift.start.name,
        destination: lift.destination.name,
        daysLeft: date.getDateDiff(new Date(lift.date), new Date(), 'days'),
        timestamp: new Date(),
      });
    }
  });
  returnedArray.sort((a, b) => a.daysLeft - b.daysLeft);

  return returnedArray;
});
const bigTabOptions = computed(() => {
  return [
    { value: 'current', icon: 'playlist_add_check', label: 'Bestehend' },
    {
      value: 'pending',
      icon: 'call_received',
      label: 'eingehende Anfrage' + (totalRequests != 1 ? 'n' : ''),
    },
    {
      value: 'pending_out',
      icon: 'call_missed_outgoing',
      label: 'ausstehende Anfrage' + (totalRequests != 1 ? 'n' : ''),
    },
  ];
});
const bigTabOptionsWithoutLabel = computed(() => {
  return JSON.parse(JSON.stringify(bigTabOptions.value)).map((item) => {
    delete item.label;
    return item;
  });
});
const thumbStyle = computed(() => {
  return {
    right: '4px',
    borderRadius: '5px',
    backgroundColor: '#027be3',
    width: '5px',
    opacity: 0.75,
  };
});
const barStyle = computed(() => {
  return {
    right: '2px',
    borderRadius: '9px',
    backgroundColor: '#027be3',
    width: '9px',
    opacity: 0.2,
  };
});
const qrInput = computed(() => {
  return {
    type: 'lift',
    data:
      (liftCodePopup.value.data ? liftCodePopup.value.data.id : '') +
      '#i' +
      userStore.user.uid,
  };
});
const totalRequests = computed(() => {
  var n = 0;
  Object.values(userStore.user.liftRequests).forEach((lift) => {
    n += lift.requestingUsers.length;
  });
  return n;
});

async function refreshContent(res, rej) {
  var callbacks = {
    res: res,
    rej: rej,
  };
  userStore.reloadChatLifts();
  userStore.getLiftRequests();
  userStore.getOutgoingRequests();
  // reload all three of them, causes more traffic but then you have always full fresh data
}

function switchTab(right) {
  const max = userStore.user.liftRequests.length - 1;
  constmin = 0;
  if (right) {
    if (pendingRequestTab.value < max) pendingRequestTab.value++;
  } else {
    if (pendingRequestTab.value > min) pendingRequestTab.value--;
  }
}

function getNameFromId(liftId, userId) {
  var lift = userStore.user.chatLifts.find((l) => l.id == liftId);
  var people = [];
  lift.passengers.forEach((item) => people.push(item));
  people.push(JSON.parse(JSON.stringify(lift.driver)));
  if (userId == 'Go6vlU74gFgz5GgM5eRnWPPt2Cf1') return 'StudiCar';
  else {
    var a = people.find((p) => p.id == userId);
    if (!a) return '[Ehemalig]';
    else return a.name;
  }
}

function getCampusLabel(campusId, name) {
  switch (campusId) {
    case 1:
      return 'Würfel';
    case 2:
      return 'Alte DH';
    case 3:
      return 'Kloster';
    default:
      return name;
  }
}

function canAcceptAllRequests(lift) {
  return seatsLeft(lift.liftId) >= lift.requestingUsers.length;
}

function getPassengerNameFromId(lift, userId) {
  if (!lift.passengers) alert('no passengers');

  var people = {};
  lift.passengers.forEach((p) => (people[p.id] = p.name));
  people[lift.driver.id] = lift.driver.name;
  var a = people[userId];
  if (!a) return '[Ehemalig]';
  else return a.name;
}

function getLiftFromId(liftId) {
  return userStore.user.chatLifts.find((l) => l.id == liftId);
}

function seatsLeft(liftId) {
  const lift = getLiftFromId(liftId);
  var a = lift.car.seatsWithoutDriver - lift.passengers.length;
  if (a < 0) a = 0; // negative number as left seats makes no sence
  return a;
}

function openTheLift(liftId) {
  /* var enableDoubleTap = false;

      if (!process.env.DEV) enableDoubleTap = false; // just to be sure
      if (!enableDoubleTap) { */
  openLiftPopup(liftId);
  /* } else {
        if (alreadyTappedOnItem) openShortLiftInfo(liftId);
        else {
          alreadyTappedOnItem = true;
          setTimeout(_ => {
            if (!alreadyTappedOnItem) {
              openLiftPopup(liftId);
            }
            alreadyTappedOnItem = false;
          }, 200);
        }
      } */
}

function openLiftWithDetails(liftId) {
  chatPopup.detailsOpen.value = true;
  openLiftPopup(liftId);
}

function openLiftPopup(liftId) {
  var lift = userStore.user.chatLifts.find((l) => l.id == liftId);
  chatPopup.data.value = lift;
  liftCodePopup.isOpen.value = false; // just to be sure
  chatPopup.isOpen.value = true;
}

function openShortLiftInfo(liftId) {
  var lift = userStore.user.chatLifts.find((l) => l.id == liftId);
  liftCodePopup.data.value = lift;
  liftCodePopup.isOpen.value = true;
}

function quickRespondLiftRequest(liftId, requestingUser, accepted) {
  respondLiftRequest({
    liftId: liftId,
    user: {
      id: requestingUser.id,
      name: requestingUser.name,
      surname: requestingUser.surname,
    },
    accepted: accepted,
    reason: null, // no reason or futher information when doing quick response
  });
}

function acceptAllRequestsOfLift(liftId) {
  respondLiftRequest({
    liftId: liftId,
    user: {
      id: -1, // when transferring this as userId, API will affect changes to all current requests on that lift
    },
    accepted: true,
    reason: null,
  });
}

function respondLiftRequest(eventObj) {
  userStore.respondLiftRequest(eventObj);
  userStore.getLiftRequests().then(() => {
    alert('error at reloading after responding a lift request');
  });
  keyToBeIncremented.value++;
}

function cancelRequest(liftId) {
  // here will come the cancelling code
  userStore.cancelRequest(liftId);
}

function closeLift() {
  chatPopup.data.value = null;
  chatPopup.isOpen.value = false;
}

function leave(event) {
  closeLift();
  userStore.leaveLift(event.liftId);
}
</script>
