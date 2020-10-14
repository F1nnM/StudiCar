<template>
  <div class="q-ma-md">
    <TitleButtonAnchor>
      <q-btn @click="getContent(true)" icon="refresh" size="md" flat />
    </TitleButtonAnchor>
    <div v-show="downloading == 2" class="overflow-hidden" id="text_anchor">
      <!-- content goes here after downloading -->
    </div>
    <LoadingDisplay
      v-model="downloading"
      loadingText="Inhalt wird geladen"
      errorText="Ein Fehler ist aufgetreten. Bitte versuch es später noch mal"
    />
  </div>
</template>

<script>
import { sendApiRequest, GET_LEGAL } from "../ApiAccess";
import LoadingDisplay from "components/LoadingDisplay";
import TitleButtonAnchor from "components/TitleButtonAnchor";

export default {
  name: "legal",
  components: {
    LoadingDisplay,
    TitleButtonAnchor,
  },
  mounted() {
    this.$store.commit("setPage", "Rechtliches");
    this.$store.commit("setPageTrans", "slide");
    this.getContent();
  },
  data() {
    return {
      downloading: 0, // 0 means not downloading, 1 means downloading, 2 means success and -1 means error
      converter: null,
    };
  },
  methods: {
    getContent(force) {
      const currentLegal = this.$store.getters["getLegal"];
      if (currentLegal != "" && !force) {
        // already some content
        document.getElementById("text_anchor").innerHTML = currentLegal;
        this.downloading = 2;
      } else {
        this.downloading = 1;
        sendApiRequest(
          GET_LEGAL,
          {},
          (html_) => {
            document.getElementById("text_anchor").innerHTML = html_;
            this.$store.commit("setLegal", html_);
            this.downloading = 2;
          },
          (err) => {
            alert("Fehler: " + err);
            this.downloading = -1;
          }
        );
      }
    },
  },
};
</script>
