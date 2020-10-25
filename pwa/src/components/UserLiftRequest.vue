<template>
  <div>
    <q-list dense style="border: 1px solid gray" class="q-my-md rounded-borders">
      <q-item dense>
        <q-item-section avatar>
          <q-avatar>
            <q-img :src="request.requestingUser.imageUrl" />
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <div class="text-subtitle1">{{ request.requestingUser.name }}</div>
          <div>{{ request.requestingUser.surname }}</div>
          <div class="row full-width">
            <div
              v-for="(p,index) in request.requestingUser.prefs"
              :key="index"
              :class="`col-auto q-px-xs text-${ betterPrefColor(p) }`"
            >●</div>
          </div>
        </q-item-section>
        <q-item-section side>
          <q-btn-toggle
            dense
            outline
            toggle-color="dark"
            v-model="userViewTab"
            :options="[{
                                icon: 'info', value: 'info'
                              },{
                                icon: 'touch_app', value: 'response'
                              }]"
          />
        </q-item-section>
      </q-item>

      <q-card>
        <q-card-section>
          <q-tab-panels
            class="q-pa-none"
            v-model="userViewTab"
            animated
            transition-next="scale"
            transition-prev="scale"
          >
            <q-tab-panel name="info" class="q-pa-xs">
              <div class="row">
                <div class="col-8">
                  <p class="text-caption">Nachricht</p>
                  <div class="text-caption text-grey-9">{{ request.requestingUser.bio }}</div>
                </div>
                <div class="col-4 text-center">
                  <ColoredMeter
                    width="15vw"
                    :angle="request.requestingUser.stats.driverCount / request.requestingUser.stats.liftCount"
                    :minInput="0"
                    :maxInput="1"
                  >{{ request.requestingUser.stats.driverCount }} / {{ request.requestingUser.stats.liftCount }}</ColoredMeter>
                  <q-btn
                    label="zum Profil"
                    outline
                    :to="'benutzerinfo?slId=' + request.requestingUser.fbId"
                    no-caps
                    class="q-px-xs q-mt-md"
                    color="dark"
                    dense
                  />
                </div>
              </div>
            </q-tab-panel>
            <q-tab-panel name="response" class="row justify-between">
              <q-btn
                label="Absagen"
                outline
                icon="thumb_down"
                @click="respondLiftRequest(false)"
                no-caps
                class="q-px-xs"
                color="red"
                dense
              />
              <q-btn
                label="Zusagen"
                outline
                icon="thumb_up"
                @click="respondLiftRequest(true)"
                no-caps
                class="q-px-xs"
                color="green"
                dense
              />
            </q-tab-panel>
          </q-tab-panels>
        </q-card-section>
      </q-card>
    </q-list>
  </div>
</template>

<script>
import { date } from "quasar";
import ExtHr from "components/ExtendedHr";
import ColoredMeter from "components/ColoredMeter";

import { sendApiRequest } from "../ApiAccess";

export default {
  name: "UserLiftRequest",
  components: {
    ColoredMeter,
  },
  data() {
    return {
      userViewTab: "info",
    };
  },
  model: {
    prop: "request",
    event: "input",
  },
  props: {
    request: Object,
    liftId: Number,
  },
  computed: {},

  methods: {
    betterPrefColor(color) {
      if (color == "GREEN") return "green-8";
      else if (color == "YELLOW") return "orange";
      else return color.toLowerCase();
    },

    respondLiftRequest(accepted) {
      var user = this.request.requestingUser;
      this.$emit("respond", {
        liftId: this.liftId,
        user: {
          // on purpose NOT copying user obj, because containing much not needed data
          id: user.id,
          fbId: user.fbId,
          name: user.name,
          surname: user.surname,
        },
        accepted: accepted,
      });
    },
    mounted() {},
  },
};
</script>

<style scoped lang="scss">
</style>