<template>
  <!-- is a fun component to make the left drawer prettier -->
  <div>
    <q-img
      v-if="true"
      :src="randomImage"
      style="height: 35vh"
      class="text-white"
    >
      <div class="row full-width q-pa-md">
        <div class="text-h6 col-10 text-weight-light">{{ greetingFull }}</div>
        <q-icon size="sm" class="col-2" :name="greetingIcon" />
      </div>
      <div
        v-if="caption && appStore.settings.enablePostillonNewsFeed"
        class="full-width absolute-bottom-left text-caption"
      >
        {{ caption }}
        <!-- <small>
          <br />bezogen von
          <a class="text-white" href="https://der-postillon.com"
            >der Postillon</a
          >
        </small> -->
      </div>
    </q-img>
  </div>
</template>

<script setup>
import { useAppStore } from 'src/stores/app';
import { useUserStore } from 'src/stores/user';

const props = defineProps({
  caption: String,
});
const { caption } = toRefs(props);

const appStore = useAppStore();

const morningMax = 8;
const dayMax = 14;
const eveningMax = 13;
const images = computed(() => {
  let images = { morning: [], day: [], evening: [], error: null };
  for (let i = 0; i < morningMax; i++) {
    images.morning.push(`/drawer_images/morning/m${i}.jpg`);
  }
  for (let i = 0; i < dayMax; i++) {
    images.day.push(`/drawer_images/day/d${i}.jpg`);
  }
  for (let i = 0; i < eveningMax; i++) {
    images.evening.push(`/drawer_images/evening/e${i}.jpg`);
  }
  images.error = '/drawer_images/sad.svg';
  return images;
});

const random = Math.random();
const randomImage = computed(() => {
  let image;
  let error = false;
  console.log(images.value);
  switch (appStore.greeting) {
    case 'Guten Morgen':
      image = images.value.morning[Math.floor(random * morningMax)];
      break;
    case 'Willkommen':
      image = images.value.day[Math.floor(random * dayMax)];
      break;
    case 'Guten Abend':
      image = images.value.evening[Math.floor(random * eveningMax)];
      break;
    default:
      error = true;
  }
  if (error) return images.error;
  else return image;
});

const userStore = useUserStore();

const greetingFull = computed(() => {
  return appStore.greeting + ', ' + userStore.user.name.split(' ')[0];
});

const greetingIcon = computed(() => {
  switch (appStore.greeting) {
    case 'Guten Abend':
      return 'nights_stay';
      break;
    case 'Willkommen':
      return 'brightness_7';
      break;
    case 'Guten Morgen':
      return 'wb_sunny';
      break;
    default:
      return 'report_problem';
  }
});
</script>
