<template>
  <div>
    <q-list dense style="border: 1px solid gray" class="rounded-borders">
      <q-item dense class="q-pr-none">
        <q-item-section avatar>
          <q-avatar size="xl">
            <img :src="requestingUser.imageUrl" />
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <div class="text-subtitle1">{{ requestingUser.name }}</div>
          <div>{{ requestingUser.surname }}</div>
          <div class="row full-width">
            <div
              v-for="(p,index) in requestingUser.prefs"
              :key="index"
              :class="`col-auto q-px-xs text-${ betterPrefColor(p) }`"
            >●</div>
          </div>
        </q-item-section>
        <q-item-section side class="q-px-none">
          <div class="row justify-between">
            <q-btn outline @click="(false)" no-caps class="q-px-xs q-mr-md" color="grey-7" dense>
              <q-icon color="negative" name="thumb_down" />
            </q-btn>
            <q-btn
              outline
              @click="respondLiftRequest(true)"
              no-caps
              :disable="acceptDisabled"
              color="grey-7"
              class="q-px-xs"
              dense
            >
              <q-icon name="thumb_up" color="positive" />
            </q-btn>
          </div>
        </q-item-section>
      </q-item>

      <q-card>
        <q-card-section class="q-px-sm q-py-xs">
          <q-item dense>
            <q-item-section>
              <q-item-label>Kurzbeschreibung</q-item-label>
              <q-item-label caption>{{ requestingUser.bio || '- keine Beschreibung eingestellt -' }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn
                label="zum Profil"
                outline
                :to="'benutzerinfo?userFbId=' + requestingUser.id"
                no-caps
                class="q-px-xs q-mt-md"
                color="dark"
                dense
              />
            </q-item-section>
          </q-item>
        </q-card-section>
      </q-card>
    </q-list>
  </div>
</template>

<script>
import { date } from "quasar";
import ExtHr from "components/ExtendedHr";
import ColoredMeter from "components/ColoredMeter";

import { buildGetRequestUrl, GET_USER_PROFILE_PIC } from "../ApiAccess";

export default {
  name: "IncomingLiftRequest",
  components: {},
  data() {
    return {
      userViewTab: "info"
    };
  },
  model: {
    prop: "request",
    event: "input"
  },
  props: {
    requestingUser: Object,
    liftId: Number,
    acceptDisabled: Boolean
  },
  computed: {},

  methods: {
    betterPrefColor(color) {
      if (color == "GREEN") return "green-8";
      else if (color == "YELLOW") return "orange";
      else return color.toLowerCase();
    },

    async respondLiftRequest(accepted) {
      var user = this.requestingUser,
        responseReason = "";
      if (accepted == false)
        responseReason = await new Promise((res, rej) => {
          this.$q
            .dialog({
              title: "Ablehnen",
              message: `Willst du die Anfrage von ${user.name} ablehnen?`,
              ok: {
                color: "negative"
              },
              cancel: {
                color: "positive"
              },
              cancel: true,
              persistent: true
            })
            .onOk(data => {
              res(data);
            })
            .onCancel(rej);
        });
      else {
        var confirmationRequired = this.$store.state.settings
          .askAgainWhenAppreciatingNewPassenger;
        if (confirmationRequired)
          var doNotAskAgain = await new Promise((res, rej) => {
            this.$q
              .dialog({
                title: "Zusagen",
                message: `${user.name} in die Fahrgemeinschaft mit aufnehmen?`,
                ok: {
                  color: "positive"
                },
                cancel: {
                  color: "white"
                },
                /* options: {
                  type: "checkbox",
                  model: [],
                  // inline: true
                  items: [{ label: "Nicht mehr fragen", value: true }]
                }, */
                cancel: true,
                persistent: true
              })
              .onOk(data => {
                // via data setting can be saved
                res();
              })
              .onCancel(rej);
          });
        if (doNotAskAgain)
          this.$store.commit("setAskAgainWhenAppreciatingNewPassenger", false);
      }
      this.$emit("respond", {
        liftId: this.liftId,
        user: {
          // on purpose NOT copying user obj, because containing much not needed data
          id: user.id,
          name: user.name,
          surname: user.surname
        },
        accepted: accepted,
        reason: responseReason || null
      });
    }
  },
  mounted() {
    buildGetRequestUrl(
      GET_USER_PROFILE_PIC,
      {
        fbid: this.requestingUser.id
      },
      url => {
        this.requestingUser.imageUrl = url;
      }
    );
  }
};
</script>

<style scoped lang="scss">
</style>