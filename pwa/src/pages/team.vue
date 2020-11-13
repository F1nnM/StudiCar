<template>
  <div class="q-pa-sm full-height bg-white">
    <TitleButton>
      <q-tabs v-model="viewTab" dense no-caps inline-label class="text-dark">
        <q-tab name="altogether" label="Wir als Team" />
        <q-tab name="matrix" label="Bereiche" />
      </q-tabs>
    </TitleButton>
    <q-card class="bg-white q-px-none" v-if="teamLoading == 2">
      <q-tab-panels
        v-model="viewTab"
        animated
        transition-prev="scale"
        transition-next="scale"
        class="q-px-none"
      >
        <q-tab-panel name="matrix" class="q-pa-none">
          <div class="row q-px-sm q-pt-sm shadow-up-5">
            <q-list class="col-6 q-mb-xl" v-for="m in info.team" :key="m.id">
              <q-item dense clickable @click="showMember = m" class="q-pl-sm">
                <q-badge floating transparent color="white">
                  <q-btn
                    dense
                    outline
                    rounded
                    icon="keyboard_arrow_right"
                    size="sm"
                    color="dark"
                    @click="showMember = m"
                  />
                </q-badge>
                <q-item-section avatar class="q-ml-none column justify-top">
                  <q-avatar size="60px">
                    <TeamPicture headFocused :imageUrl="m.name + ' ' + m.surname" />
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <p class="text-h6 q-mb-none">{{ m.name }}</p>
                  <p class="text-subtitle1 q-pl-xs text-weight-light text-grey-9">{{ m.surname }}</p>
                </q-item-section>
                <!-- <q-item-section side>
                 
                </q-item-section>-->
              </q-item>
              <ExtHr color="grey-5" size="xs" />
              <q-item dense>
                <q-item-section class="q-ml-lg">
                  <q-item-label
                    class="text-overline q-pt-sm text-uppercase text-center"
                  >{{ m.funcShort ? m.funcShort : m.function }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-tab-panel>
        <q-tab-panel name="altogether">
          <q-parallax :height="250">
            <template v-slot:media>
              <img src="https://cdn.quasar.dev/img/parallax1.jpg" />
            </template>
          </q-parallax>
          <p class="text-caption" id="anchor"></p>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
    <q-dialog
      style="width: 60vw;"
      v-model="dialogOpen"
      :transition-show="dialogShowTransition"
      :transition-hide="dialogHideTransition"
    >
      <q-card flat bordered v-if="dialogOpen">
        <q-card-section class="q-pt-xs">
          <q-toolbar class="q-px-none">
            <q-toolbar-title class="text-subtitle1">{{ showMember.function }}</q-toolbar-title>
            <q-btn icon="close" flat round dense v-close-popup />
          </q-toolbar>
          <q-separator />
          <br />
          <div class="row">
            <div class="col-6 q-pl-lg flex">
              <span class="text-h5 q-mt-sm q-mb-xs">
                {{ showMember.name }}
                <br />
                <small class="text-grey-7">{{ showMember.surname }}</small>
              </span>
            </div>
            <div class="col-5 flex flex-center">
              <q-avatar size="35vw">
                <TeamPicture :imageUrl="showMember.name + ' ' + showMember.surname" />
              </q-avatar>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <p class="text-caption">Beschreibung</p>
          <p>{{ showMember.bio }}</p>
        </q-card-section>

        <!-- <q-card-actions>
          <q-btn flat round icon="event" />
          <q-btn flat>7:30PM</q-btn>
          <q-btn flat color="primary">Reserve</q-btn>
        </q-card-actions>-->
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import ExtHr from "components/ExtendedHr";
import TitleButton from "components/TitleButtonAnchor";
import TeamPicture from "components/TeamPicture";
import { sendApiRequest, SQL_GET_TEAM } from "../ApiAccess";

export default {
  name: "team",
  components: { ExtHr, TitleButton,TeamPicture },
  data() {
    return {
      info: this.$store.getters["getStudiCarInfo"],
      htmlText: "",
      viewTab: "matrix",
      showMember: null,
      teamLoading: 0,
    };
  },
  watch: {
    viewTab: function (newv) {
      if (newv != "matrix") {
        setTimeout(
          (_) => (document.getElementById("anchor").innerHTML = this.htmlText),
          100
        );
      }
    },
  },
  computed: {
    dialogShowTransition() {
      if (true) return "jump-up";
      if (this.showMember) {
        if (this.info.team.indexOf(this.showMember) % 2 == 0) return "jump-right";
        // even index, so left side
        else return "jump-left";
      } else return "fade"; // actually wanted even the show transition to be dynamic, but didn't work. Left it anyway in code.
    },

    dialogHideTransition() {
      if (this.showMember) {
        if (this.info.team.indexOf(this.showMember) % 2 == 0) return "jump-left";
        // even index, so left side
        else return "jump-right";
      } else return "fade";
    },

    dialogOpen: {
      get() {
        return !!this.showMember;
      },
      set() {
        this.showMember = null;
      },
    },
  },
  methods: {},

  mounted() {
    this.$store.commit("setPage", "Das Team");
    this.$store.commit("setPageTrans", "slide");

    if (!this.$store.getters["getStudiCarInfo"]) {
      this.teamLoading = 1;
      sendApiRequest(
        SQL_GET_TEAM,
        {},
        (data) => {
          this.$store.commit("setInfo", data);
          this.info = data;
          this.teamLoading = 2;

          var loc = document.location.href; // check whether specific member should be visited
          if (loc.includes("?orgaId=")) {
            var id = loc.split("?orgaId=")[1];
            this.showMember = this.team.find((m) => {
              return m.id + "" == id;
            });
          }

          this.htmlText = data.about.text;
        },
        (error) => {
          this.teamLoading = -1;
        }
      );
    } else {
      this.info = this.$store.getters["getStudiCarInfo"];
      this.teamLoading = 2; // just to be sure
    }
  },
};
</script>

<style lang="scss" scoped>
</style>