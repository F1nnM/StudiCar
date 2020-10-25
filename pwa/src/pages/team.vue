<template>
  <div class="bg-grey-4 q-pa-sm full-height">
    <TitleButton>
      <q-tabs v-model="viewTab" dense no-caps inline-label class="bg-white text-dark">
        <q-tab name="altogether" label="Wir als Team" />
        <q-tab name="matrix" label="Bereiche" />
      </q-tabs>
    </TitleButton>
    <q-card class="bg-white q-px-none">
      <q-tab-panels
        v-model="viewTab"
        animated
        transition-prev="scale"
        transition-next="scale"
        class="q-px-none"
      >
        <q-tab-panel name="matrix" class="q-px-sm">
          <div class="row">
            <q-list class="col-6 q-mb-xl" v-for="m in team" :key="m.id">
              <q-item dense>
                <q-badge floating color="white">
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
                <q-item-section avatar class="q-ml-none">
                  <!-- <q-avatar> -->
                  <q-img
                    contain
                    :src="m.imageUrl ? m.imageUrl : 'https://cdn.pixabay.com/photo/2016/10/29/20/25/beard-1781443_960_720.png'"
                  />
                  <!-- </q-avatar> -->
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
          <p class="text-subtitle1">StudiCar stellt sich vor</p>
          <q-parallax :height="250" :speed="0.2">
            <template v-slot:media>
              <img src="https://cdn.quasar.dev/img/parallax1.jpg" />
            </template>
          </q-parallax>
          <p class="text-caption">Hier steht dann der Text</p>
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
              <q-img
                class="rounded-borders"
                :src="showMember.imageUrl ? showMember.imageUrl : 'https://cdn.pixabay.com/photo/2016/10/29/20/25/beard-1781443_960_720.png'"
              />
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
import { sendApiRequest } from "../ApiAccess";

export default {
  name: "team",
  components: { ExtHr, TitleButton },
  data() {
    return {
      team: this.$store.getters["auth/user"].team,
      viewTab: "matrix",
      showMember: null,
    };
  },
  computed: {
    dialogShowTransition() {
      if (true) return "jump-up";
      if (this.showMember) {
        if (this.team.indexOf(this.showMember) % 2 == 0) return "jump-right";
        // even index, so left side
        else return "jump-left";
      } else return "fade"; // actually wanted even the show transition to be dynamic, but didn't work. Left it anyway in code.
    },

    dialogHideTransition() {
      if (this.showMember) {
        if (this.team.indexOf(this.showMember) % 2 == 0) return "jump-left";
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

    var loc = document.location.href;
    if (loc.includes("?orgaId=")) {
      var id = loc.split("?orgaId=")[1];
      this.showMember = this.team.find((m) => {
        return m.id + "" == id;
      });
    }
  },
};
</script>

<style lang="scss" scoped>
</style>