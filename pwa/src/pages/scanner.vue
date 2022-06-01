<template>
  <div>
    <q-slide-transition class="q-pa-md">
      <p v-if="result">{{ result }}</p>
    </q-slide-transition>

    <q-slide-transition>
      <div class="q-pa-xl" v-if="!result">
        <div :class="built ? 'scanning-border relative' : ''">
          <qrcode-stream @init="onInit" @decode="decoded"></qrcode-stream>
          <p
            v-if="!result"
            class="text-h6 text-uppercase text-weight-light text-white absolute-center"
          >
            StudiCar Scan
          </p>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </q-slide-transition>
  </div>
</template>

<script setup>
import { useAppStore } from 'src/stores/app';

let code = '';
let video = [];
let result = '';
let error = '';
let built = false;

const appStore = useAppStore();

async function onInit(promise) {
  built = true;
  try {
    await promise;
  } catch (error) {
    if (error.name === 'NotAllowedError') {
      error = 'ERROR: you need to grant camera access permisson';
    } else if (error.name === 'NotFoundError') {
      error = 'ERROR: no camera on this device';
    } else if (error.name === 'NotSupportedError') {
      error = 'ERROR: secure context required (HTTPS, localhost)';
    } else if (error.name === 'NotReadableError') {
      error = 'ERROR: is the camera already in use?';
    } else if (error.name === 'OverconstrainedError') {
      error = 'ERROR: installed cameras are not suitable';
    } else if (error.name === 'StreamApiNotSupportedError') {
      error = 'ERROR: Stream API is not supported in this browser';
    }
    message(error);
  }
}

function decoded(res) {
  result = res;
}

function message(error) {
  $q.dialog({
    dark: true,
    title: 'Fehler',
    message: '' + error,
  })
    .onOk(() => {
      // console.log('OK')
    })
    .onCancel(() => {
      // console.log('Cancel')
    })
    .onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    });
}

function newScan() {
  result = '';
}

onMounted(() => {
  appStore.setPage({
    name: 'Scanner',
    onlyInNav: true,
    transition: 'swipe-away',
  });
});
</script>

<style lang="scss"></style>
