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
          transition-next="fade"
          transition-prev="fade"
          animated
        >
          <q-tab-panel :name="mainTab">
            <q-list>
              <q-item v-for="(f, idx) in currentList" :key="f.name + idx">
                <q-item-section avatar>
                  <q-avatar>
                    <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label
                    >{{ f.name }}
                    <span class="text-caption text-grey">
                      {{ f.surname }}
                    </span>
                  </q-item-label>
                  <q-item-label caption>
                    <q-rating
                      readonly
                      size="1em"
                      :value="f.rating"
                      :max="5"
                      icon="emoji_people"
                      color="primary"
                    >
                      <template v-slot:tip-1>
                        <q-tooltip>Kaum Fahrgemeinschaften</q-tooltip>
                      </template>
                      <template v-slot:tip-2>
                        <q-tooltip>Wenig Fahrgemeinschaften</q-tooltip>
                      </template>
                      <template v-slot:tip-3>
                        <q-tooltip>Mehrere Fahrgemeinschaften</q-tooltip>
                      </template>
                      <template v-slot:tip-4>
                        <q-tooltip>Viele Fahrgemeinschaften</q-tooltip>
                      </template>
                      <template v-slot:tip-5>
                        <q-tooltip>Ständige Mitfahrer</q-tooltip>
                      </template>
                    </q-rating>
                  </q-item-label>
                </q-item-section>

                <q-item-section side>
                  <FriendHeart
                    backColor="grey-3"
                    size="sm"
                    :left="f.friended.in"
                    :right="f.friended.me"
                    @click="toggleHeart(f.id)"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-tab-panel>
          <q-tab-panel name="pending">
            Pending
          </q-tab-panel>
        </q-tab-panels>
      </div>
      <div class="col-2">
        <q-avatar size="md">
          <img :src="ppPath" />
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

<script>
import FriendHeart from "../components/FriendHeart.vue";
import { buildGetRequestUrl, GET_USER_PROFILE_PIC } from "../ApiAccess";
export default {
  components: { FriendHeart },
  data() {
    return {
      mainTab: "friends",
      entireNetwork: [
        {
          id: 1,
          name: "Alicia",
          surname: "Müller",
          rating: 3,
          friended: {
            in: true,
            me: false
          }
        },
        {
          id: 2,
          name: "Herbert",
          surname: "Kahlschneider",
          rating: 1,
          friended: {
            in: true,
            me: true
          }
        },
        {
          id: 3,
          name: "Gerd",
          surname: "Gröner",
          rating: 5,
          friended: {
            in: true,
            me: true
          }
        },
        {
          id: 4,
          name: "Thomas",
          surname: "Bärlauch",
          rating: 2,
          friended: {
            in: false,
            me: true
          }
        }
      ],
      ppPath: ""
    };
  },

  computed: {
    friends() {
      return this.entireNetwork.filter(u => u.friended.in && u.friended.me);
    },

    pending() {
      return this.entireNetwork
        .filter(u => !(u.friended.in && u.friended.me))
        .sort((a, b) => +a.friended.me > +b.friended.me);
      /* sorting using the unary operator:
      +true = 1
      +false = 0 */
    },

    currentList() {
      if (this.mainTab == "friends") return this.friends;
      else return this.pending;
    }
  },

  watch: {},

  methods: {
    toggleHeart(id) {
      var otherUser = this.entireNetwork.find(u => u.id == id),
        friended = otherUser.friended;
      if (friended.in && friended.me) {
        // only ask if there is an connection established
        this.$q
          .dialog({
            title: "Freundschaft beenden",
            message: `Willst du die Freundschaft mit ${otherUser.name} wirklich beenden? Bis auf weiteres wird sie dann zu den 
            Ausstehenden geordnet`,
            cancel: true,
            persistent: true
          })
          .onOk(() => {
            friended.me = false;
          });
      } else {
        if (friended.me)
          this.$q
            .dialog({
              title: "Anfrage zurückziehen",
              message: `Willst du die Freundschaftsanfrage an ${otherUser.name} wirklich zurückziehen? Denk dran, dass 
du ${otherUser.name} dann nur über eine Fahrgemeinschaft oder einen StudiCar Code wiederfinden kannst!`,
              cancel: true,
              persistent: true
            })
            .onOk(() => {
              friended.me = false;
            });
        else friended.me = !friended.me;
        // request code
      }
    }
  },

  mounted() {
    this.$store.commit("setPage", {
      name: "Freunde"
    });

    (async _ => {
      this.ppPath = await buildGetRequestUrl(GET_USER_PROFILE_PIC, {
        fbid: this.$store.getters["auth/user"].uid
      });
    })();
  }
};
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
