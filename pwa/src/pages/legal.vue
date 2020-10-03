<template>
  <div class="q-ma-md">
    <TitleButton @click="getContent(true)" icon="refresh" size="md" flat />
    <div v-show="downloading == 2" class="overflow-hidden" id="text">
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
import TitleButton from "components/TitleButton";

export default {
  name: "legal",
  components: {
    LoadingDisplay,
    TitleButton,
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
        document.getElementById("text").innerHTML = currentLegal;
        this.downloading = 2;
      } else {
        this.downloading = 1;
        sendApiRequest(
          GET_LEGAL,
          {},
          (data) => {
            switch (data.code) {
              case 0: // fine
                document.getElementById("text").innerHTML = data.html;
                this.$store.commit("setLegal", data.html);
                this.downloading = 2;
                break;
              case 1: // error while reading file
                alert("File error, err as warning in console");
                console.warn(data.html);
                this.downloading = -1;
                break;
              case 2: // convertion error
                alert("Convertion error, err as warning in console");
                console.warn(data.html);
                this.downloading = -1;
                break;
              default:
                alert("other error: " + data.html);
                this.downloading = -1;
            }
          },
          (err) => {
            this.downloading = -1;
          }
        );
      }
    },
  },
};
</script>
