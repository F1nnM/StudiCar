<template>
  <div>
    <div
      v-if="showLoadingScreen"
      :class="
        'loading-screen-background z-top fixed-full fullscreen ' +
        showLoadingScreen
          ? 'hide-screen'
          : ''
      "
    >
      <div class="text-caption full-width text-center q-mt-xl q-pt-xl">
        <p class="text-h4"><span class="text-primary">Studi</span>Car</p>
        <p>Green. Cheap. Social.</p>
      </div>
      <br />
      <br />
      <br />
      <div class="full-width q-mt-xl q-px-xl">
        <p class="col-9 q-ma-none">Bitte hab noch einen Moment Geduld</p>

        <q-linear-progress
          indeterminate
          rounded
          color="primary"
          class="q-mt-sm"
        />
      </div>
      <div class="fixed-bottom overflow-hidden-y q-mb-lg q-mx-lg text-center">
        <div class="branding-rise">
          Mit freundlicher Unterstützung des ADAC e.V.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from 'src/stores/user';

const userStore = useUserStore();
function showLoadingScreen() {
  return !userStore.loggedIn;
}
</script>

<style scoped lang="scss">
.loading-screen-background {
  background-color: red;
  transform: translateY(0%);
}
.hide-screen {
  transform: translateY(-100vw);
  transition: 0.2s;
}

.branding-rise {
  animation: rise 0.4s forwards;
  animation-delay: 0.3s;
  transform: translateY(-100%);

  @keyframes rise {
    to {
      transform: translateY(0);
    }
  }
}
</style>
