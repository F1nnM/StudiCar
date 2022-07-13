<template>
  <div class="q-pa-sm full-height bg-white">
    <TitleButton class="q-pt-md">
      <q-tabs
        v-if="!!info"
        v-model="viewTab"
        dense
        no-caps
        inline-label
        class="text-dark"
      >
        <q-tab name="altogether" label="Wir als Team" />
        <q-tab name="matrix" label="Bereiche" />
      </q-tabs>
    </TitleButton>
    <div v-if="!info">
      <div style="height: 40vh" class="text-center column justify-center">
        <p>
          <q-circular-progress
            show-value
            indeterminate
            size="15vw"
            :thickness="0.05"
            :value="100"
            color="primary"
            class="q-ma-md full-width"
          >
            <q-icon name="emoji_people" color="dark" size="md" />
          </q-circular-progress>
          <span class="text-subtitle1">Informationen werden geladen</span>
        </p>
      </div>
    </div>
    <div v-else class="bg-white q-px-none">
      <q-tab-panels
        v-model="viewTab"
        animated
        transition-prev="scale"
        transition-next="scale"
        class="q-px-none"
      >
        <q-tab-panel name="matrix" class="q-pa-none">
          <div class="col-12 text-right text-caption">
            Tippe jeweils für mehr Info
          </div>
          <div class="row q-px-sm q-mt-sm q-pt-xs shadow-up-5">
            <q-list class="col-6 q-mb-xl" v-for="m in info.team" :key="m.id">
              <q-item dense clickable @click="showMember = m" class="q-pl-sm">
                <!-- <q-badge floating transparent color="white">
                  <q-btn
                    dense
                    outline
                    rounded
                    icon="keyboard_arrow_right"
                    size="sm"
                    color="dark"
                    @click="showMember = m"
                  />
                </q-badge>-->
                <q-item-section avatar class="q-ml-none column justify-top">
                  <q-avatar size="60px">
                    <TeamPicture headFocused :imageUrl="m.picture" />
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <p class="text-h6 q-mb-none">{{ m.name }}</p>
                  <p
                    class="text-subtitle1 q-pl-xs text-weight-light text-grey-9"
                  >
                    {{ m.surname }}
                  </p>
                </q-item-section>
                <!-- <q-item-section side>
                 
                </q-item-section>-->
              </q-item>
              <ExtHr color="grey-5" size="xs" />
              <q-item dense>
                <q-item-section class="q-ml-lg">
                  <q-item-label
                    class="text-overline q-pt-sm text-uppercase text-center"
                    >{{ m.funcShort ? m.funcShort : m.function }}</q-item-label
                  >
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-tab-panel>
        <q-tab-panel name="altogether">
          <!-- <q-parallax :height="250">
            <template v-slot:media>
              <img src="https://cdn.quasar.dev/img/parallax1.jpg" />
            </template>
          </q-parallax>-->
          <div class="about-anchor" ref="anchor"></div>
        </q-tab-panel>
      </q-tab-panels>
    </div>
    <q-dialog
      style="width: 60vw"
      v-model="dialogOpen"
      :transition-show="dialogShowTransition"
      :transition-hide="dialogHideTransition"
    >
      <q-card flat bordered v-if="dialogOpen">
        <q-card-section class="q-pt-xs">
          <q-toolbar class="q-px-none">
            <q-toolbar-title class="text-subtitle1">{{
              showMember.function
            }}</q-toolbar-title>
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
              <q-avatar rounded size="35vw">
                <TeamPicture :imageData="showMember.picture" />
              </q-avatar>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <p>Über mich</p>
          <p class="text-caption">
            {{ showMember.bio || '- noch keine Beschreibung hinterlegt -' }}
          </p>
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

<script setup>
import { useAppStore } from 'src/stores/app';
import { onMounted } from 'vue';

const appStore = useAppStore();

let info = appStore.info;
let htmlText = '';
let viewTab = 'matrix';
let showMember = null;

watch(viewTab, (newv) => {
  if (newv == 'altogether') {
    setTimeout((_) => {
      $refs.anchor.innerHTML = htmlText;
    }, 50);
  }
});

const dialogShowTransition = computed(() => {
  if (true) return 'jump-up';
  if (showMember) {
    if (info.team.indexOf(showMember) % 2 == 0) return 'jump-right';
    // even index, so left side
    else return 'jump-left';
  } else return 'fade'; // actually wanted even the show transition to be dynamic, but didn't work. Left it anyway in code.
});

const dialogHideTransition = computed(() => {
  if (showMember) {
    if (info.team.indexOf(showMember) % 2 == 0) return 'jump-left';
    // even index, so left side
    else return 'jump-right';
  } else return 'fade';
});

const dialogOpen = computed({
  get() {
    return !!showMember;
  },
  set() {
    showMember = null;
  },
});

async function refreshContent(res, rej) {
  api.sendApiRequest(api.SQL_GET_TEAM, {}, (data) => {
    appStore.setInfo(data);
    info = data;

    htmlText = data.infoText;
    res();
  });
}

onMounted(() => {
  appStore.setPage({
    name: 'Das Team',
  });

  if (!appStore.info) {
    api.sendApiRequest(
      api.SQL_GET_TEAM,
      {},
      (data) => {
        appStore.setInfo(data);
        info = data;

        var loc = document.location.href; // check whether specific member should be visited
        if (loc.includes('?orgaId=')) {
          var id = loc.split('?orgaId=')[1];
          showMember = team.find((m) => {
            return m.id + '' == id;
          });
        }

        htmlText = data.infoText;
      },
      (error) => {
        alert('Fehler aufgetreten: ' + error);
      }
    );
  } else {
    info = appStore.info;
    htmlText = info.infoText;
  }
});
</script>

<style lang="scss" scoped>
.about-anchor h2 {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
