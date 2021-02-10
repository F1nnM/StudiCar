<template>
  <div class="q-ma-md">
    <div v-if="!view" class="text-negative">- ungültige Anfrage -</div>

    <div v-else-if="!loaded">
      <div style="height: 40vh" class="text-center column justify-center">
        <q-circular-progress
          show-value
          indeterminate
          size="15vw"
          :thickness="0.05"
          :value="100"
          color="primary"
          class="q-ma-md full-width"
        >
          <q-icon name="contact_support" color="dark" size="md" />
        </q-circular-progress>
        <span class="text-subtitle1">Daten werden geladen</span>
      </div>
    </div>
    <div class="overflow-hidden" ref="text_anchor">
      <!-- content goes here after downloading -->
    </div>
  </div>
</template>

<script>
import { sendApiRequest, GET_LEGAL } from "../ApiAccess";

export default {
  name: "legal",
  components: {},
  data() {
    return {
      content: "",
      loaded: false,
      view: null
    };
  },
  watch: {
    $route(to) {
      this.recomputeView();
    },
    view: function(newValue, old) {
      if (old != newValue) this.setMode(newValue);
    }
  },
  methods: {
    recomputeView() {
      var locArr = window.location.href.split("?view=");
      if (locArr.length > 1) this.view = locArr[1];
      // you can control the view via url
    },

    getContent(force) {
      const isViewContentStored = this.$store.getters["getLegalViews"].includes(
        this.view
      );
      if (isViewContentStored && !force) {
        // already some content
        this.$refs.text_anchor.innerHTML = this.$store.state.legal[this.view];
        this.loaded = true;
      } else {
        this.loaded = false;
        this.$refs.text_anchor.innerHTML = "";
        sendApiRequest(
          GET_LEGAL,
          {
            view: this.view
          },
          data => {
            this.loaded = true;
            this.$refs.text_anchor.innerHTML = data.text;
            var obj = {};
            obj[this.view] = data.text;
            this.$store.commit("addToLegal", obj);
          },
          err => {
            alert("Fehler: " + err);
          }
        );
      }
    },

    setMode(value) {
      var pageName = null,
        view;
      switch (value) {
        case "agb":
          pageName = "Nutzungsbedingungen";
          view = "agb";
          break;
        case "datenschutz":
          pageName = "Datenschutz";
          view = "dataSec";
          break;
      }
      if (pageName) {
        this.$store.commit("setPage", {
          name: pageName
        });
        this.view = view;
        this.getContent();
      }
    },

    refreshContent(res) {
      this.getContent(true);
      res();
    }
  },
  mounted() {
    this.$store.commit("setPage", {
      name: ""
    });
    this.recomputeView();
  }
};
</script>

<style lang="scss">
// no h1 tags there so far
h2 {
  font-size: 1.7em !important;
  font-weight: normal !important;
  line-height: 1.2em !important;
}
h3 {
  font-size: 1.3em !important;
  font-weight: bold !important;
  line-height: 1.2em !important;
}
</style>