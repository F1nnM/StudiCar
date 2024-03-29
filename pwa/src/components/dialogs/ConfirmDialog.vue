<template>
  <q-dialog
    :transition-show="animation || 'scale'"
    :transition-hide="animation || 'scale'"
    :persistent="persistent"
    ref="dialog"
    @hide="onDialogHide"
  >
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6" v-if="title">{{ title }}</div>
        <q-space />
        <!-- <q-tabs
          v-model="viewTab"
          dense
          v-if="details"
          class="bg-white text-grey-7"
          indicator-color="primary"
          narrow-indicator
        >
          <q-tab :ripple="false" name="info" icon="info" />
          <q-tab :ripple="false" name="details" icon="more_horiz" />
        </q-tabs>-->
        <q-btn v-if="!persistent" icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-tab-panels
        v-model="viewTab"
        animated
        vertical
        infinite
        :swipeable="!!details"
        class="q-pa-none"
        transition-next="jump-up"
        transition-prev="jump-down"
      >
        <q-tab-panel name="info" class="q-pa-none">
          <q-card-section class="row items-center">
            <q-avatar
              v-if="icon"
              :icon="icon"
              color="primary"
              class="q-mr-sm"
              text-color="white"
            />
            <span>{{ message }}</span>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              outline
              color="negative"
              class="q-mr-sm"
              @click="onCancelClick"
            >
              <span class="text-dark">{{ cancelLabel || 'Abbrechen' }}</span>
            </q-btn>
            <q-btn outline color="primary" @click="onOKClick">
              <span class="text-dark">{{ okLabel || 'Ok' }}</span>
            </q-btn>
            <!-- actually wanted to work with v-html, but did affect styling -->
          </q-card-actions>
        </q-tab-panel>
        <q-tab-panel
          name="details"
          class="q-pa-none"
          style="word-break: break-all"
        >
          <q-card-section>{{ details }}</q-card-section>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-dialog>
</template>

<script setup>
const props = defineProps({
  cancelLabel: String,
  okLabel: String,
  message: {
    type: String,
    required: true,
  },
  persistent: Boolean,
  title: String,
  icon: String,
  animation: String,
  details: String,
});
const {
  cancelLabel,
  okLabel,
  message,
  persistent,
  title,
  icon,
  animation,
  details,
} = toRefs(props);

let viewTab = 'info';

const dialog = ref(null);

// following method is REQUIRED
// (don't change its name --> "show")
function show() {
  dialog.show();
}

// following method is REQUIRED
// (don't change its name --> "hide")
function hide() {
  dialog.hide();
}

function onDialogHide() {
  // required to be emitted
  // when QDialog emits "hide" event
  $emit('hide');
}

function onOKClick() {
  // on OK, it is REQUIRED to
  // emit "ok" event (with optional payload)
  // before hiding the QDialog
  $emit('ok');
  // or with payload: $emit('ok', { ... })

  // then hiding dialog
  hide();
}

function onCancelClick() {
  // we just need to hide dialog
  hide();
}
</script>
