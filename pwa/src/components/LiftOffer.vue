<template>
  <q-card class="row items-stretch">
    <div id="map" class="col-grow row"></div>
    <div class="col column q-pa-sm">
      <div class="row">
        <div class="col">
          <span>
            {{ lift.city }}
            <small>({{ lift.distance }}km entfernt)</small>
          </span>
        </div>
        <div class="col-auto">
          <q-icon v-if="lift.requested" name="chat_bubble_outline" size="sm" class="q-pr-lg" />
          <span>{{ lift.seatsOccupied }} / {{ lift.seatsOffered }}</span>
          <q-icon id="seats" name="person" />
        </div>
      </div>
      <div v-if="lift.dayPattern" class="row q-pt-sm">
        <div
          v-for="(values, day) in lift.dayPattern"
          :key="day"
          class="drive_indicator"
          :class="'drive_indicator_'+(values[0]+values[1])"
          :title="day"
        >
          <q-tooltip anchor="top middle" self="bottom middle">{{ day }}</q-tooltip>
          <q-icon name="unfold_more" v-if="values[0] && values[1]" />
          <q-icon name="arrow_upward" v-else-if="values[0]" />
          <q-icon name="arrow_downward" v-else-if="values[1]" />
          <q-icon name="close" v-else />
        </div>
      </div>
      <div v-else-if="dateSingleDrive[0]==dateSingleDrive[1]" class="row q-pt-sm">
        <div class="drive_indicator drive_indicator_2">
          <q-icon name="unfold_more" />
        </div>
        <span class="vertical_middle">{{ dateSingleDrive[0] }}</span>
      </div>
      <div v-else class="row q-pt-sm">
        <div class="drive_indicator drive_indicator_1" v-if="dateSingleDrive[0]">
          <q-icon name="arrow_upward" />
        </div>
        <span class="vertical_middle" v-if="dateSingleDrive[0]">{{ dateSingleDrive[0] }}</span>
        <div class="drive_indicator drive_indicator_1" v-if="dateSingleDrive[1]">
          <q-icon name="arrow_downward" />
        </div>
        <span class="vertical_middle" v-if="dateSingleDrive[1]">{{ dateSingleDrive[1] }}</span>
      </div>

      <div class="q-pt-md">
        <!-- <ExtendedHr color="grey-5" class="q-mt-md q-pl-lg" size="xs" /> -->

        <q-expansion-item dense-toggle dense expand-icon-toggle v-model="prefsExpanded">
          <template v-slot:header>
            <q-btn
              :to="'benutzerinfo?slId='+lift.driver.fbid"
              flat
              color="grey-9"
              no-caps
              full-width
              dense
              class="q-mr-md full-width"
            >
              <q-item class="link-border q-py-xs">
                <q-item-section class="text-right">
                  <span class="text-caption">Angeboten von</span>
                  {{ lift.driver.name }}
                </q-item-section>
                <q-item-section avatar>
                  <q-avatar>
                    <img :src="lift.driver.imageUrl" />
                  </q-avatar>
                </q-item-section>
              </q-item>
              <!-- <a v-bind:href="'#/benutzerinfo?'+lift.driver.fbid" /> -->
            </q-btn>
          </template>
          <q-card>
            <q-card-section>
              <p class="text-subtitle1 text-grey-7">
                Präferenzen
                <q-btn dense flat icon="info" @click="changePrefView" />
              </p>
              <q-tab-panels
                transition-prev="fade"
                transition-next="fade"
                v-model="prefViewTab"
                animated
              >
                <q-tab-panel name="short" class="q-pa-none">
                  <div class="row justify-evenly">
                    <div
                      class="text-center"
                      v-for="pref in [{
val: 'talk', icon: 'record_voice_over'
                    },
                    {
val: 'talkMorning', icon: 'alarm'
                    },
                    {
val: 'smoking', icon: 'smoking_rooms'
                    },
                    {
val: 'music', icon: 'music_note'
                    }]"
                      :key="pref.val"
                    >
                      <q-icon
                        :name="pref.icon"
                        :color="betterPrefColor(lift.driver.prefs[pref.val])"
                        size="sm"
                      />
                    </div>
                  </div>
                </q-tab-panel>

                <q-tab-panel name="legend" class="q-pa-none">
                  <p class="text-caption">
                    <q-icon
                      name="record_voice_over"
                      :color="betterPrefColor(lift.driver.prefs.talk)"
                      size="xs"
                      class="q-mb-xs q-mr-xs"
                    />
                    {{ prefsDocu.talk[lift.driver.prefs.talk.toLowerCase()] }}
                  </p>
                  <p class="text-caption">
                    <q-icon
                      name="alarm"
                      :color="betterPrefColor(lift.driver.prefs.talkMorning)"
                      size="xs"
                      class="q-mb-xs q-mr-xs"
                    />
                    {{ prefsDocu.talkMorning[lift.driver.prefs.talkMorning.toLowerCase()] }}
                  </p>
                  <p class="text-caption">
                    <q-icon
                      name="smoking_rooms"
                      :color="betterPrefColor(lift.driver.prefs.smoking)"
                      size="xs"
                      class="q-mb-xs q-mr-xs"
                    />
                    {{ prefsDocu.smoking[lift.driver.prefs.smoking.toLowerCase()] }}
                  </p>
                  <p class="text-caption">
                    <q-icon
                      name="music_note"
                      :color="betterPrefColor(lift.driver.prefs.music)"
                      size="xs"
                      class="q-mb-xs q-mr-xs"
                    />
                    {{ prefsDocu.music[lift.driver.prefs.music.toLowerCase()] }}
                  </p>
                </q-tab-panel>
              </q-tab-panels>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </div>
    </div>
  </q-card>
</template>

<script>
import { date } from "quasar";
import ExtendedHr from "components/ExtendedHr";
import {
  buildGetRequestUrl,
  sendApiRequest,
  GET_USER_PROFILE_PIC,
} from "../ApiAccess";

export default {
  name: "LiftOffer",
  components: {},
  props: {
    lift: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      prefViewTab: "short",
      prefsDocu: this.$store.state.prefsDocu,
      prefsExpanded: false,
      imageUrl: "",
    };
  },
  computed: {
    dateSingleDrive() {
      if (!this.lift) return "";
      if (!this.lift.next_drive) return "";
      return [
        this.lift.next_drive[0]
          ? date.formatDate(this.lift.next_drive[0], "DD. MM. YY")
          : null,
        this.lift.next_drive[1]
          ? date.formatDate(this.lift.next_drive[1], "DD. MM. YY")
          : null,
      ];
    },
  },
  methods: {
    betterPrefColor(color) {
      if (color == "GREEN") return "green-8";
      else if (color == "YELLOW") return "orange";
      else return color.toLowerCase();
    },

    changePrefView() {
      if (this.prefViewTab != "legend") {
        this.prefViewTab = "legend";
        this.prefsExpanded = false;
        setTimeout((_) => {
          this.prefsExpanded = true;
        }, 50);
      } else {
        this.prefViewTab = "short";
        this.prefsExpanded = false;

        setTimeout((_) => {
          this.prefsExpanded = true;
        }, 0); // just that we have a transition, otherwise there would be no pretty scaling effect
      }
    },
  },
  mounted() {},
};
</script>

<style scoped>
#map {
  max-width: 200px;
  flex-basis: 15vw;
  overflow: hidden;
  position: relative;
  background-image: url("~assets/loremmap.png");
  background-size: cover;
  background-position: center;
}
#mapImg {
  position: absolute;
  transform: translate(-50%, -50%);
  left: 50%;
  top: 50%;
  /*max-width: 100%;*/
  min-height: 100%;
}
.drive_indicator {
  width: 30px;
  height: 30px;
  margin: 4px;
  border-radius: 100%;
  background-color: #888;
  text-align: center;
  line-height: 30px;
  font-size: larger;
}
.drive_indicator_0 {
  background-color: #ff000080;
}
.drive_indicator_1 {
  background-color: #ffa60080;
}
.drive_indicator_2 {
  background-color: #00ff0080;
}
#seats {
  font-size: larger;
}
.vertical_middle {
  line-height: 38px;
}

/* .q-expansion-item > div > .q-item {
  display: none;
  visibility: hidden;
} */

.link-border {
  border-radius: 4px;
  border: 1px solid rgba(19, 70, 21, 0.671);
}
</style>