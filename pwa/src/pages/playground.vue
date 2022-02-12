<template>
  <div class="q-pa-md">
    <q-resize-observer :debounce="0"></q-resize-observer>
    <q-scroll-observer @scroll="scrollHandler" />
    <q-btn label="toggle" @click="test = !test" />
    <SettingScope
      v-model="test"
      descriptionLabel="cool"
      property="Fahrzeug hinzufügen"
      @save="alert"
    >
      here comes the setting
      <template v-slot:description>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti animi
        sit corporis! Inventore quisquam doloribus beatae repudiandae magni
        natus impedit quae incidunt iure iste ex facilis, alias, tempora
        voluptas laborum!
      </template>
    </SettingScope>
  </div>
</template>

<script>
import SettingScope from "components/SettingScope";
export default {
  components: {
    SettingScope
  },

  data() {
    return {
      test: true
    };
  },

  computed: {},

  methods: {},

  mounted() {
    this.$store.commit("setPage", "Spielplatz");
  }
};
</script>
