<template>
  <div>
    <q-slide-transition class="q-pa-md">
      <p v-if="result">{{result}}</p>
    </q-slide-transition>

    <q-slide-transition>
      <div class="q-pa-xl" v-if="!result">
        <div :class="built? 'scanning-border relative' : ''">
          <qrcode-stream @init="onInit" @decode="decoded"></qrcode-stream>
          <p
            v-if="!result"
            class="text-h6 text-uppercase text-weight-light text-white absolute-center"
          >StudiCar Scan</p>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </q-slide-transition>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from "vue-qrcode-reader";

export default defineComponent({
  components: { QrcodeStream },

  mounted() {
    this.$store.commit("setPage", {
      name: "Scanner",
      onlyInNav: true,
      transition: "swipe-away"
    });
  },

  data() {
    return {
      code: "",
      video: [],
      result: "",
      error: "",
      built: false
    };
  },
  methods: {
    help() {
      alert("BIG ");
    },

    async onInit(promise) {
      this.built = true;
      try {
        await promise;
      } catch (error) {
        if (error.name === "NotAllowedError") {
          this.error = "ERROR: you need to grant camera access permisson";
        } else if (error.name === "NotFoundError") {
          this.error = "ERROR: no camera on this device";
        } else if (error.name === "NotSupportedError") {
          this.error = "ERROR: secure context required (HTTPS, localhost)";
        } else if (error.name === "NotReadableError") {
          this.error = "ERROR: is the camera already in use?";
        } else if (error.name === "OverconstrainedError") {
          this.error = "ERROR: installed cameras are not suitable";
        } else if (error.name === "StreamApiNotSupportedError") {
          this.error = "ERROR: Stream API is not supported in this browser";
        }
        this.message(error);
      }
    },
    decoded(res) {
      this.result = res;
    },
    message(error) {
      this.$q
        .dialog({
          dark: true,
          title: "Fehler",
          message: "" + error
        })
        .onOk(() => {
          // console.log('OK')
        })
        .onCancel(() => {
          // console.log('Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    },

    newScan() {
      this.result = "";
    }
  }
});
</script>

<style lang="scss">
</style>