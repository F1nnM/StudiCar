<template>
  <!-- just a pretty display header and scope for most of the settings -->
  <q-dialog
    :value="value"
    @input="emit"
    position="bottom"
    full-width
    persistent
    @show="emitShow"
    @hide="emitHide"
  >
    <div class="bg-white">
      <q-card>
        <q-toolbar class="q-pl-none">
          <q-toolbar-title class="text-h6 text-weight-light"
            ><q-btn
              flat
              dense
              size="lg"
              @click="help = !help"
              no-caps
              class="text-weight-light left-border-primary"
              >{{ property }}</q-btn
            >
          </q-toolbar-title>
          <!-- <q-btn
            round
            flat
            dense
            outline
            :disable="uploading"
            size="lg"
            @click="help = !help"
          >
            <span class="text-h6 text-weight-light">?</span>
          </q-btn> -->

          <q-btn
            flat
            round
            dense
            icon="close"
            size="md"
            color="grey-9"
            @click="emitHide"
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
              <span v-else
                >Noch deaktiviert, weil noch keine Werte verändert wurden</span
              >
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
          <div class="bg-white row " v-if="help && !uploading">
            <div class="q-px-lg col-2">
              <div class="text-primary text-h5 q-mt-md">›</div>
            </div>
            <div class="q-pa-xs q-pl-sm q-py-md col-10">
              <div class="text-weight-light text-subtitle2">
                <slot name="description"></slot>
                <span v-if="!hasDescriptionSlot && descriptionLabel">{{
                  descriptionLabel
                }}</span>
                <span v-else> {{ property }} bearbeiten </span>
              </div>
            </div>
          </div>
        </q-slide-transition>

        <q-card-section>
          <slot>
            <!-- here comes the actual setting form or whatever -->
          </slot>
        </q-card-section>
      </q-card>
    </div>
  </q-dialog>
</template>

<script>
import Tooltip from "components/Tooltip";
import { defineComponent } from "vue";

export default defineComponent({
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
  computed: {
    hasDescriptionSlot() {
      return !!this.$slots.description;
    }
  },
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
});
</script>

<style lang="scss" scoped>
.left-border-primary {
  border-left: 3px solid $primary;
  padding-left: 15px;
}

.shadow-primary {
  box-shadow: 0 0px 0px 0px $primary, 0 1px 0px $primary, 0 1px 6px $primary;
}
</style>
