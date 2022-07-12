<template>
  <!-- is a fun component to make the left drawer prettier -->
  <div>
    <q-img
      v-if="true"
      :src="randomImage.value"
      style="height: 35vh"
      class="text-white"
    >
      <div class="row full-width q-pa-md">
        <div class="text-h6 col-10 text-weight-light">{{ greetingFull }}</div>
        <q-icon size="sm" class="col-2" :name="greetingIcon.value" />
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

const randomImage = computed(async () => {
  var morningMax = 8;
  var dayMax = 14;
  var eveningMax = 13; // currently hard coded, could be optimized by automatically reading all files from dir
  var error = false;

  var imgPath;

  switch (appStore.greeting) {
    case 'Guten Morgen':
      imgPath = 'morning/m' + Math.floor(Math.random() * morningMax);
      break;
    case 'Willkommen':
      imgPath = 'day/d' + Math.floor(Math.random() * dayMax);
      break;
    case 'Guten Abend':
      imgPath = 'evening/e' + Math.floor(Math.random() * eveningMax);
      break;
    default:
      error = true;
  }
  if (error) return import('../assets/sad.svg');
  else return import('../assets/drawer_images/' + imgPath + '.jpg');
});

const userStore = useUserStore();

const greetingFull = computed(() => {
  return appStore.greeting + ', ' + userStore.user.name.split(' ')[0];
});

const greetingIcon = () => {
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
};
</script>
