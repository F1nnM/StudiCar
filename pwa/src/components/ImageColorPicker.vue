<template>
  <div>
    <div class="row">
      <div class="q-pr-xs col-xs-8">
        <q-tab-panels
          v-model="colorPicker.tab"
          animated
          transition-prev="fade"
          transition-next="fade"
        >
          <q-tab-panel name="field">
            <q-color v-model="colorPicker.color" no-header no-footer @input="emit()" />
          </q-tab-panel>

          <q-tab-panel name="palette">
            <q-color
              no-header
              no-footer
              v-model="colorPicker.color"
              default-view="palette"
              @input="emit()"
            />
          </q-tab-panel>
        </q-tab-panels>
        <q-tabs
          v-model="colorPicker.tab"
          dense
          class="text-dark"
          active-color="primary"
          indicator-color="primary"
          align="justify"
        >
          <q-tab name="field" label icon="video_label" />
          <q-tab name="palette" label icon="view_module" />
        </q-tabs>
      </div>
      <div
        class="color-preview rounded-bottom-borders col-xs-4"
        :style="`background-color: ${ colorPicker.color }`"
      >
        <q-img v-if="imageSrc" :src="imageSrcFromJS" />
        <div style="background: transparent" class="dotted-border"></div>
        <!-- when no src given or src not valid, preview field will span entire height -->
      </div>
    </div>
  </div>
</template>

<script>
import { date } from "quasar";

export default {
  name: "ImageColorPicker",
  props: {
    imageSrc: String,
  },
  methods: {
    emit() {
      this.$emit("input", this.colorPicker.color);
    },
  },
  computed: {
    imageSrcFromJS() {
      return require("../assets/" + this.imageSrc);
    },
  },
  data() {
    return {
      colorPicker: {
        tab: "field",
        color: "#FFFFF",
      },
    };
  },
};
</script>

<style lang="scss" scoped>
.rounded-bottom-borders {
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}
</style>