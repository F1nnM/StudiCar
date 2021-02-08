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
        <q-btn v-if="!persistent" icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section class="row items-center">
        <q-avatar v-if="icon" :icon="icon" color="primary" text-color="white" />
        <span class="q-ml-sm">{{ message }}</span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn outline color="negative" class="q-mr-sm" @click="onCancelClick">
          <span class="text-dark">{{ cancelLabel || 'Abbrechen' }}</span>
        </q-btn>
        <q-btn outline color="primary" @click="onOKClick">
          <span class="text-dark">{{ okLabel || 'Ok' }}</span>
        </q-btn>
        <!-- actually wanted to work with v-html, but did affect styling -->
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  props: {
    cancelLabel: String,
    okLabel: String,
    message: {
      type: String,
      required: true
    },
    persistent: Boolean,
    title: String,
    icon: String,
    animation: String
  },

  methods: {
    // following method is REQUIRED
    // (don't change its name --> "show")
    show() {
      this.$refs.dialog.show();
    },

    // following method is REQUIRED
    // (don't change its name --> "hide")
    hide() {
      this.$refs.dialog.hide();
    },

    onDialogHide() {
      // required to be emitted
      // when QDialog emits "hide" event
      this.$emit("hide");
    },

    onOKClick() {
      // on OK, it is REQUIRED to
      // emit "ok" event (with optional payload)
      // before hiding the QDialog
      this.$emit("ok");
      // or with payload: this.$emit('ok', { ... })

      // then hiding dialog
      this.hide();
    },

    onCancelClick() {
      // we just need to hide dialog
      this.hide();
    }
  }
};
</script>