<template>
  <div class="q-py-md">
    <div class="row">
      <div class="col-10">
        <!-- <q-btn-toggle
          v-model="mainTab"
          spread
          outline
          toggle-color="primary"
          class="only-bottom-border"
          color="white"
          text-color="black"
          :options="[
            { label: 'Freunde', value: 'friends' },
            { label: 'Ausstehend', value: 'pending' }
          ]"
        /> -->
        <q-tabs
          v-model="mainTab"
          dense
          align="justify"
          class="text-dark"
          indicator-color="primary"
        >
          <q-tab name="friends" label="Freunde" />
          <q-tab name="pending" label="Ausstehend" />
        </q-tabs>
        <q-tab-panels
          v-model="mainTab"
          class="q-mx-none"
          transition-next="jump-left"
          transition-prev="jump-right"
          animated
        >
          <q-tab-panel name="friends">
            <q-list v-if="friends.length">
              <q-item v-for="(f, idx) in friends" :key="f.name + idx">
                <q-item-section avatar>
                  <a :href="'/#/benutzerinfo?userFbId=' + f.fbId">
                    <!-- was the easiest way, vue router did make troubles -->
                    <q-avatar>
                      <img
                        v-if="imagePaths[f.fbId]"
                        :src="imagePaths[f.fbId]"
                      />
                      <q-icon name="account" v-else />
                    </q-avatar>
                  </a>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ f.name }} </q-item-label>
                  <q-item-label caption class="text-grey">
                    {{ f.surname }}
                  </q-item-label>
                  <q-item-label caption>
                    <q-rating
                      readonly
                      v-if="f.rating"
                      size="1em"
                      :value="f.rating"
                      :max="5"
                      icon="emoji_people"
                      color="primary"
                    /><Tooltip>
                      <!-- putting tooltip in rating didn't work: rating has no default slot -->
                      {{
                        ['Kaum', 'Wenig', 'Mehrere', 'Viele', 'Ständige'][
                          f.rating - 1
                        ]
                      }}

                      {{ f.rating == 5 ? 'Mitfahrer' : 'Fahrgemeinschaften' }}
                    </Tooltip>
                  </q-item-label>
                </q-item-section>

                <q-item-section side class="no-pointer">
                  <FriendHeart
                    backColor="grey-3"
                    size="sm"
                    :left="f.friended.in"
                    :right="f.friended.me"
                    @click="toggleHeart(f.fbId)"
                  />
                </q-item-section>
              </q-item>
            </q-list>
            <div v-else>
              <q-item>
                <q-item-section>
                  <q-item-label
                    >Du hast noch keine Freunde in StudiCar</q-item-label
                  >
                  <q-item-label caption
                    >Besuche die Profile von Mitfahrern und frage für eine
                    Freundschaft an</q-item-label
                  >
                </q-item-section>
              </q-item>
            </div>
          </q-tab-panel>
          <q-tab-panel name="pending">
            <q-list v-if="pending.length">
              <q-item v-for="(f, idx) in pending" :key="f.name + idx">
                <q-item-section avatar>
                  <a :href="'/#/benutzerinfo?userFbId=' + f.fbId">
                    <q-avatar>
                      <img
                        :src="
                          imagePaths[f.fbId] ||
                          'https://cdn.quasar.dev/img/boy-avatar.png'
                        "
                      />
                    </q-avatar>
                  </a>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ f.name }} </q-item-label>
                  <q-item-label caption class="text-grey">
                    {{ f.surname }}
                  </q-item-label>
                </q-item-section>

                <q-item-section side>
                  <FriendHeart
                    backColor="grey-3"
                    size="sm"
                    :left="f.friended.in"
                    :right="f.friended.me"
                    @click="toggleHeart(f.fbId)"
                  />
                </q-item-section>
              </q-item>
            </q-list>
            <div v-else>
              <q-item>
                <q-item-section>
                  <q-item-label>Keine ausstehenden Anfragen</q-item-label>
                  <q-item-label caption
                    >Besuche die Profile von Mitfahrern und frage für eine
                    Freundschaft an</q-item-label
                  >
                </q-item-section>
              </q-item>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </div>
      <div class="col-2">
        <q-avatar size="md">
          <img v-if="friendsFromStore.length" :src="ppPath" />
        </q-avatar>
        <!-- <div class="row">
          <div class="col-1"> -->
        <div
          v-for="(f, idx) in currentList"
          :key="f.name + idx"
          :class="'related-border ' + (idx == 0 ? 'top' : '')"
        ></div>
        <!-- </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from 'src/stores/user';
import { onMounted } from 'vue';

const userStore = useUserStore();
const appStore = useAppStore();

let mainTab = 'friends';
let ppPath = '';
let imagePaths = {};

const friendsFromStore = computed(() => {
  return userStore.user.friends;
});

const friends = computed(() => {
  return friendsFromStore.filter((u) => u.friended.in && u.friended.me);
});

const friendsFbId = computed(() => {
  return friends.map((e) => e.fbId);
});

const pending = computed(() => {
  return friendsFromStore
    .filter(
      (u) => !(u.friended.in && u.friended.me) && !friendsFbId.includes(u.fbId) // this line is just a workaround to fix an existing bug in the sql query
    )
    .sort((a, b) => +a.friended.me > +b.friended.me);
  /* sorting using the unary operator:
      +true = 1
      +false = 0 */
});

const currentList = computed(() => {
  if (mainTab == 'friends') return friends;
  else return pending;
});

async function userConfirm(fbId) {
  var otherUser = friendsFromStore.find((u) => u.fbId == fbId);
  var friended = otherUser.friended;
  // propably not the best way to extra find the wanted item, alternative would be to pass all as params
  // this definitely is the cleaner way

  if (friended.in && friended.me)
    // only ask if there is an connection established
    $q.dialog({
      title: 'Freundschaft beenden',
      message: `Willst du die Freundschaft mit ${otherUser.name} wirklich beenden? Die Anfrage wird dann wieder als ausstehend
            gespeichert.`,
      cancel: true,
      persistent: true,
    })
      .onOk(() => {
        sendRelationChange(fbId, friended.me);
      })
      .onCancel(console.warn("Friendship isn't supposed to be quit"));
  else if (friended.me)
    $q.dialog({
      title: 'Anfrage zurückziehen',
      message: `Willst du die Freundschaftsanfrage an ${otherUser.name} wirklich zurückziehen? Denk dran, dass
du ${otherUser.name} dann nur über eine Fahrgemeinschaft oder einen StudiCar Code wiederfinden kannst!`,
      cancel: true,
      persistent: true,
    })
      .onOk(() => {
        sendRelationChange(fbId, friended.me);
      })
      .onCancel(console.warn("Request isn't supposed to be deleted"));
  else sendRelationChange(fbId, friended.me);
}

async function toggleHeart(fbId) {
  userConfirm(fbId)
    .then(() => {
      sendRelationChange(fbId, friended.me);
    })
    .catch((err) => {
      console.warn('Changing aborted: ' + err);
    });
}

function sendRelationChange(friendId, mySideOfHeart) {
  userStore.changeFriendRelation(friendId, mySideOfHeart);
}

onMounted(() => {
  appStore.setPage({
    name: 'Freunde',
  })(async () => {
    ppPath = await buildGetRequestUrl(GET_USER_PROFILE_PIC, {
      fbid: userStore.user.uid,
    });
  })();
  friendsFromStore.forEach(async (e) => {
    imagePaths[e.fbId] = await buildGetRequestUrl(GET_USER_PROFILE_PIC, {
      fbid: e.fbId,
    });
  });
});
</script>

<style scoped lang="scss">
.related-border {
  border: 1px solid rgb(38, 92, 41);
  border-width: 0px 1px 1px 0px;

  padding-top: 70px;
  margin-right: 43px;

  &.top {
    margin-top: 20px;
    padding-top: 35px;
  }
}

.only-bottom-border {
  border-width: 0px 0px 0px 1px;
}
</style>
