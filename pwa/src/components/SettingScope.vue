<template>
  <q-dialog
    :value="value"
    @input="emit"
    position="bottom"
    persistent
    @show="emitShow"
    @hide="emitHide"
  >
    <div class="bg-white q-mx-sm">
      <q-toolbar class="bg-white shadow-primary">
        <q-btn round flat dense outline :disable="uploading" size="lg" @click="help = !help">
          <span class="text-h6 text-weight-light">?</span>
        </q-btn>
        <span v-if="!help" class="text-weight-light left-border-primary">{{ property }}</span>
        <q-space />
        <q-btn
          flat
          round
          dense
          icon="close"
          size="md"
          color="grey-9"
          v-close-popup
          class="q-mr-lg q-pr-sm"
        >
          <Tooltip>Abbrechen und aktuelle Werte beibehalten</Tooltip>
        </q-btn>
        <q-btn
          flat
          round
          dense
          icon="done"
          :disable="disableSave"
          size="md"
          :color="!disableSave ? 'positive' : 'grey-3'"
          @click="save"
        >
          <Tooltip>
            <span v-if="!disableSave">Neu eingestellte Werte übernehmen</span>
            <span v-else>Noch deaktiviert, weil noch keine Werte verändert wurden</span>
          </Tooltip>
        </q-btn>
      </q-toolbar>
      <q-linear-progress
        v-if="value && uploading && !hasBeenSaved"
        :indeterminate="uploading"
        :value="100"
        track-color="white"
      />
      <q-slide-transition>
        <div class="bg-white row justify-start" v-if="help && !uploading">
          <div class="bg-primary q-px-lg" />
          <div class="q-pa-xs q-pl-sm q-py-md">
            <div class="text-weight-light text-h6">
              <span v-if="descriptionLabel">{{ descriptionLabel }}</span>
              <span v-else>{{ property }} bearbeiten</span>
            </div>
            <div class="text-caption text-grey-9">
              <slot name="description"></slot>
            </div>
          </div>
        </div>
      </q-slide-transition>

      <div class="q-pa-xs bg-white">
        <slot></slot>
      </div>
    </div>
  </q-dialog>
</template>

<script>
import Tooltip from "components/Tooltip";

export default {
  name: "SettingScope",
  components: {
    Tooltip
  },
  props: {
    value: {
      type: Boolean,
      required: true
    },
    disableSave: Boolean,
    uploading: Boolean,
    property: {
      type: String,
      required: true
    },
    descriptionLabel: String
  },
  data() {
    return {
      help: false,
      hasBeenSaved: false
    };
  },
  watch: {
    value: function(val) {
      if (val == true) this.hasBeenSaved = false; // reset when re-opening
    }
  },
  computed: {},
  methods: {
    emit(val) {
      this.$emit("input", val);
    },

    emitShow() {
      this.$emit("show");
    },

    emitHide() {
      this.$emit("hide");
    },

    save() {
      this.hasBeenSaved = true;
      this.$emit("save");
    }
  }
};
</script>

<style lang="scss" scoped>
.left-border-primary {
  border-left: 1px solid $primary;
  padding-left: 15px;
}

.shadow-primary {
  box-shadow: 0 0px 0px 0px $primary, 0 1px 0px $primary, 0 1px 6px $primary;
}
</style>