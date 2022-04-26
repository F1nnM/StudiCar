<template>
  <!-- obviously I had to play around a lot to get it work pretty with MainLayout and Navbar
Is not really a module/component by literal sense as it is very tight connected to MainLayout -->
  <q-dialog
    :model-value="modelValue"
    @update:model-value="emit"
    persistent
    maximized
    transition-show="slide-down"
    transition-hide="slide-up"
    class="bg-white"
  >
    <div>
      <q-toolbar :shrink="false" class="bg-primary text-white">
        <q-toolbar-title>StudiCar Code Scanner</q-toolbar-title>

        <q-btn dense flat size="md" icon="close" @click="closeScanner">
          <q-tooltip class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
      </q-toolbar>
      <div>
        <div class="scanning-overlay">
          <qrcode-stream
            :style="'transition .5s; opacity:' + (scannerReady ? 1 : 0)"
            v-if="modelValue"
            @init="onInit"
            @decode="onDecode"
            v-touch-swipe.mouse="swiped"
          >
          </qrcode-stream>
        </div>
      </div>
    </div>
  </q-dialog>
</template>

<script>
import { defineComponent } from "vue";
import {
  QrcodeStream,
  QrcodeDropZone,
  QrcodeCapture,
} from "vue3-qrcode-reader";

export default defineComponent({
  components: {
    QrcodeStream,
  },
  name: "QrScanner",

  props: {
    modelValue: Boolean,
  },
  emits: ["swipe", "result", "update:model-value"],

  data() {
    return {
      result: "",
      otherQR: false,
      error: "",
      scannerReady: false,
      scannerHelp: false,
    };
  },
  computed: {},
  watch: {
    modelValue: {
      immediate: true,
      handler(new_, old_) {
        if (new_ == true && old_ == false) this.scannerReady = false; // so that we always have fade animation on scanner init
      },
    },
  },
  methods: {
    emit() {
      this.$emit("update:model-value", this.modelValue);
    },

    closeScanner() {
      this.$emit("update:model-value", false);
    },

    async onInit(promise) {
      promise
        .then((_) => {
          this.scannerReady = true;
        })
        .catch((error) => {
          this.scannerReady = false;
          var errObj = ((_) => {
            switch (error.name) {
              case "NotAllowedError":
                return {
                  m: "Zugriff blockiert",
                  c: "Du hast StudiCar verboten, auf die Kamera zuzugreifen. Für dieses Problem haben wir im Support Lösungen bereitgestellt.",
                };
              case "NotFoundError":
                return {
                  m: "Keine Kamera",
                  c: "StudiCar konnte keine Kamera finden",
                };
              case "NotSupportedError":
                return {
                  m: "Zertifikatsfehler",
                  c: "Bitte melde dich beim Support, wenn das Problem weiterhin besteht",
                };
              case "NotReadableError":
                return {
                  m: "Zugriff verweigert",
                  c: "Deine Kamera wird im Moment von einem anderen Prozess verwendet",
                };
              case "OverconstrainedError":
                return {
                  m: "Nicht kompatibel",
                  c: "Deine Kamera scheint nicht kompatibel zu sein. Bitte schreibe dem Support dein Gerätemodell",
                };
              case "StreamApiNotSupportedError":
                return {
                  m: "Stream API Fehler",
                  c: "Dein Browser unterstützt die Stream API nicht. Probier es bitte mit einem anderen Browser",
                };
              default:
                return {
                  m: "Fehler aufgetreten",
                  c: error.toString(),
                };
            }
          })();

          this.errorMessage(errObj);
          this.emit();
        });
    },

    errorMessage(errObj) {
      this.$q.notify({
        type: "negative",
        message: errObj.m,
        caption: errObj.c || "",
      });
    },

    onDecode(res) {
      const type = res.slice(0, 1),
        key = res.slice(1);

      if ("ul".includes(type))
        this.$emit("result", {
          type: type,
          res: key,
        });
      else {
        this.otherQR = true;
        setTimeout(() => {
          this.otherQR = false;
        }, 1500);
      }
    },

    swiped(info) {
      this.$emit("swipe", info);
    },
  },

  ready() {
    this.scannerReady = false;
  },
});
</script>

<style lang="scss">
.scanning {
  position: relative;
  &:after {
    content: "";
    position: absolute;
    top: 0%;
    left: 0;
    width: 100%;
    height: 0px;
    border-bottom: 1px solid red;
    animation: scanner 2s alternate infinite;
  }

  @keyframes scanner {
    to {
      top: 100%;
    }
  }
}

.scanning-border {
  position: relative;
  height: 100%;
  width: 100%;
  &:after {
    content: "";
    position: absolute;
    width: 5px;
    height: 5px;
    background: linear-gradient(to right, white, red);
    animation: circle_border 2s infinite;
  }

  @keyframes circle_border {
    0%,
    100% {
      top: 0%;
      left: 0%;
    }
    25% {
      left: 99%;
      top: 0%;
    }
    50% {
      top: 99%;
      left: 99%;
    }
    75% {
      top: 99%;
      left: 0%;
    }
  }
}

.scanner-container {
  visibility: hidden;
  transition: 0.35s;
  max-height: 0vh;
  position: relative;
  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgb(0, 0, 0);
    background: linear-gradient(
      0deg,
      $primary 0%,
      $primary 12%,
      transparent 21%,
      transparent 96%,
      $primary 100%
    );
  }

  &.open {
    visibility: visible;
    transition-duration: 0.5s;
    max-height: 100vh;
  }
}

.four-equal-children > * {
  width: 25%;
}

.scanning-overlay {
  position: relative;
  display: inline-block;
  width: 100%;
  height: 100%;

  .strobo {
    color: transparent;
    animation: strobo 0.4s reverse infinite;

    @keyframes strobo {
      to {
        color: red;
      }
    }
  }

  & .overlay-inner {
    position: absolute;
    white-space: nowrap;
    font-weight: 200;
    font-size: 1.4em;
    text-align: center;
    padding-bottom: 0;
    border-bottom: 1px solid white;
    left: 50%;
    bottom: 20%;
    transform: translateX(-50%);
    max-height: 50%;
    width: 70%;
    background-color: transparent;
    color: white;
    & > div {
      position: relative;
      &:after {
        position: absolute;
        content: "";
        bottom: 0;
        left: 0;
        display: block;
        width: 100%;
        min-height: 40px;
        border-right: 1px solid white;
        border-left: 1px solid white;
      }
    }
  }
}
</style>
