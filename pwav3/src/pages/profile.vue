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

<script>
import { defineComponent } from "vue";
import { date } from "quasar";

import ProfileUserData from "components/ProfileUserData";
import ProfileOtherData from "components/ProfileOtherData";

import TitleButtonAnchor from "components/TitleButtonAnchor";
import { mdiAccountGroupOutline } from "@quasar/extras/mdi-v5";

export default defineComponent({
  components: {
    ProfileUserData,
    ProfileOtherData,
    TitleButtonAnchor
  },

  data() {
    return {
      stats: this.$store.getters["auth/user"].stats,
      username: this.$store.getters["auth/user"].name.split(" ")[0],
      newLiftMaxDistance: 0, // basic profile settings
      editDistance: false,
      genderOptions: ["Männlich", "Weiblich", "Divers"],

      groupIcon: mdiAccountGroupOutline,

      tab: "data" // vue models which doesn't belong to specific function
    };
  },
  computed: {
    gender: {
      get() {
        switch (this.$store.getters["auth/user"].gender) {
          case "W":
            return "Weiblich";
          case "M":
            return "Männlich";
          case "D":
            return "Divers";
          case "X":
            return "Keine Angabe";
          default:
            return "Ein Fehler ist aufgetreten";
        }
      },
      set(value) {
        this.$store.dispatch("auth/updateGender", value);
      }
    },

    liftMaxDistance: {
      get() {
        return this.$store.getters["auth/user"].settings.liftMaxDistance;
      },
      set(value) {
        this.$store.dispatch("auth/updateLiftMaxDistance", value);
      }
    },

    dataSaver: {
      get() {
        return this.$store.getters["auth/user"].dataSaver;
      },
      set(value) {
        this.$store.dispatch("auth/updateDataSaver", value);
      }
    },

    meterModelBefore() {
      var a = this.stats;
      return a.liftsOffered / a.liftsAll;
    }
  },
  methods: {
    toggleEditLiftMaxDistance() {
      if (this.editDistance) {
        // already open
        this.liftMaxDistance = this.newLiftMaxDistance;
      } else {
        // still closed
        this.newLiftMaxDistance = this.liftMaxDistance;
      }
      this.editDistance = !this.editDistance;
    }
  },
  mounted() {
    var locArr = window.location.href.split("?tab=");
    this.tab = locArr.length > 1 ? locArr[1] : "data";

    this.$store.commit("setPage", {
      name: "Profil"
    });
  }
});
</script>
