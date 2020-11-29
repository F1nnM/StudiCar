<template>
  <div>
    <q-list dense style="border: 1px solid gray" class="q-my-md rounded-borders">
      <q-item dense class="q-pr-none">
        <q-item-section avatar>
          <q-avatar>
            <q-img :src="requestingUser.imageUrl" />
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
            <q-btn
              outline
              icon="thumb_down"
              @click="respondLiftRequest(false)"
              no-caps
              class="q-px-xs q-mr-md"
              color="red"
              dense
            />
            <q-btn
              outline
              icon="thumb_up"
              @click="respondLiftRequest(true)"
              no-caps
              class="q-px-xs"
              color="green"
              dense
            />
          </div>
        </q-item-section>
      </q-item>

      <q-card>
        <q-card-section>
          <q-item>
            <q-item-section>
              <q-item-label>Kurzbeschreibung</q-item-label>
              <q-item-label caption>{{ requestingUser.bio }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn
                label="zum Profil"
                outline
                :to="'benutzerinfo?userFbId=' + requestingUser.fbId"
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

import { sendApiRequest } from "../ApiAccess";

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
    liftId: Number
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
              dark: true,
              title: "Absagen",
              message: `Magst du ${user.name} mitteilen, warum du sie nicht mitnimmst?`,
              ok: {
                color: "negative"
              },
              cancel: {
                color: "white"
              },
              options: {
                type: "radio",
                model: "prefs",
                // inline: true
                items: [
                  { label: "Präferenzen passen nicht", value: "prefs" },
                  { label: "Nein, keine Mitteilung", value: "private" }
                ]
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
                options: {
                  type: "checkbox",
                  model: [],
                  // inline: true
                  items: [{ label: "Nicht mehr fragen", value: true }]
                },
                cancel: true,
                persistent: true
              })
              .onOk(data => {
                res(data[0]);
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
          fbId: user.fbId,
          name: user.name,
          surname: user.surname
        },
        accepted: accepted,
        reason: responseReason
      });
    },
    mounted() {}
  }
};
</script>

<style scoped lang="scss">
</style>