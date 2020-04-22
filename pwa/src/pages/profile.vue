<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md" style="max-width: 600px">
      <div class="text-h4">Dein Profil</div>
      <hr />
      <br />
      <p>Hier siehst du alle wichtigen Infos zu deinem Profil.</p>
    </div>
    <q-img transition-show="slide-left" :src="ppPath" style="height: 200px; max-width: 200px;">
      <template v-slot:loading>
        <div class="absolute-full flex flex-center text-black">
          <q-inner-loading
            transition-show="slide-down"
            transition-hide="slide-down"
            size="50px"
            color="light-blue"
            class="q-ma-md"
          />
        </div>
      </template>
      <template v-slot:error>
        <div
          class="absolute-full flex flex-center text-white"
        >Bild kann leider nicht geladen werden. Bitte Internetverbindung überprüfen.</div>
      </template>
    </q-img>

    <br />
    <div style="padding: 20px;">
      <p>Dabei seit: {{since}}</p>
      <p>Mitfahrangebote gesamt: {{global.user.liftsAll}}</p>
      <p>Wochendurchschnitt: {{global.user.avgLifts}}</p>
    </div>

    <p>
      Entfernung: maximal {{distance}}km
      <q-btn @click="editDistance = true" icon="edit" />
    </p>

    <SignOutButton />

    <q-dialog v-model="editDistance" full-height full-width>
      <q-card class="column full-height" style="width: 300px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Entfernung einstellen</div>
          <q-space />
          <q-btn icon="close" @click="saveDistance()" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <p
            class="text-caption"
          >Wie weit soll deine Mitfahrgelegenheit maximal von dir entfernt sein?</p>

          <q-slider
            v-model="distance"
            :min="5"
            :max="40"
            :step="5"
            snap
            label-always
            :label-value="distance+'km'"
            color="primary"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { date } from "quasar";
import SignOutButton from "../components/SignOutButton";
import { buildGetRequestUrl, GET_USER_PROFILE_PIC } from "../ApiAccess";

export default {
  components: { SignOutButton },
  data() {
    return {
      since: date.formatDate(this.global.user.createdAt, "MMMM YYYY", {
        months: [
          "Januar",
          "Februar",
          "März",
          "April",
          "Mai",
          "Juni",
          "Juli",
          "August",
          "September",
          "Oktober",
          "November",
          "Dezember"
        ]
      }),
      distance: this.global.user.settings.liftMaxDistance,
      editDistance: false,
      ppPath: ''
    };
  },

  methods: {
    saveDistance() {
      this.global.user.settings.liftMaxDistance = this.distance;
    }
  },
  mounted() {
    buildGetRequestUrl(
      GET_USER_PROFILE_PIC,
      { fbid: this.$store.getters["auth/user"].uid },
      url => (this.ppPath = url)
    );
  }
};
</script>