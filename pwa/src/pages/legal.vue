<template>
  <div class="q-ma-md">
    <div v-if="!view" class="text-negative">- ungültige Anfrage -</div>

    <div v-else-if="!loaded">
      <div style="height: 40vh" class="text-center column justify-center">
        <q-circular-progress
          show-value
          indeterminate
          size="15vw"
          :thickness="0.05"
          :value="100"
          color="primary"
          class="q-ma-md full-width"
        >
          <q-icon name="contact_support" color="dark" size="md" />
        </q-circular-progress>
        <span class="text-subtitle1">Daten werden geladen</span>
      </div>
    </div>
    <div class="overflow-hidden" ref="text_anchor">
      <!-- content goes here after downloading -->
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from 'src/stores/app';
import { onMounted } from 'vue';

const appStore = useAppStore();

let content = '';
let loaded = false;
let view = null;

const $route = useRoute();

watch($route, (to) => {
  recomputeView();
});
watch(view, (newValue, old) => {
  if (old != newValue) setMode(newValue);
});

function recomputeView() {
  var locArr = window.location.href.split('?view=');
  if (locArr.length > 1) view = locArr[1];
  // you can control the view via url
}

function getContent(force) {
  const isViewContentStored = appStore.getLegalViews().includes(view);
  if (isViewContentStored && !force) {
    // already some content
    $refs.text_anchor.innerHTML = appStore.legal[view];
    loaded = true;
  } else {
    loaded = false;
    $refs.text_anchor.innerHTML = '';
    api.sendApiRequest(
      api.GET_LEGAL,
      {
        view: view,
      },
      (data) => {
        loaded = true;
        $refs.text_anchor.innerHTML = data.text;
        var obj = {};
        obj[view] = data.text;
        appStore.addToLegal(obj);
      },
      (err) => {
        alert('Fehler: ' + err);
      }
    );
  }
}

function setMode(value) {
  var pageName = null,
    view;
  switch (value) {
    case 'agb':
      pageName = 'Nutzungsbedingungen';
      view = 'agb';
      break;
    case 'datenschutz':
      pageName = 'Datenschutz';
      view = 'dataSec';
      break;
  }
  if (pageName) {
    appStore.setPage({
      name: pageName,
    });
    getContent();
  }
}

function refreshContent(res) {
  getContent(true);
  res();
}

onMounted(() => {
  appStore.setPage({
    name: '',
  });
  recomputeView();
});
</script>

<style lang="scss">
// no h1 tags there so far
h2 {
  font-size: 1.7em !important;
  font-weight: normal !important;
  line-height: 1.2em !important;
}
h3 {
  font-size: 1.3em !important;
  font-weight: bold !important;
  line-height: 1.2em !important;
}
</style>
