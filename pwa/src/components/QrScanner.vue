<template>
  <!-- explaining by itself, had to play around a lot to get it work pretty with MainLayout and Navbar
Is not really a module/component by nature as it is that hard connected to MainLayout -->
  <div>
    <div :class="'bg-primary scanner-container' + (open ? ' open' : '')">
      <q-slide-transition>
        <div class="scanning-overlay">
          <qrcode-stream
            :style="
              'height: 100vh; transition: .5s; opacity:' +
              (scannerReady ? 1 : 0)
            "
            v-if="open"
            @init="onInit"
            @decode="decoded"
            v-touch-swipe.mouse="swiped"
          >
            <q-dialog
              v-model="otherQR"
              transition-show="jump-up"
              transition-hide="jump-up"
            >
              <div class="text-no-wrap text-h5 q-pa-xl bg-black text-primary">
                kein StudiCar Code
              </div>
            </q-dialog>
            <div class="overlay-inner">
              <p>
                <b>StudiCar</b> Code
                <!-- <q-btn round flat size="sm" icon="help_outline" @click="scannerHelp = true" /> -->
              </p>
              <p>
                <small>Bitte halte dein Gerät ruhig</small>
              </p>
              <div></div>
            </div>
          </qrcode-stream>
        </div>
      </q-slide-transition>
      <div v-if="!open" style="height: 100vh"></div>
      <q-dialog v-model="scannerHelp">
        <q-card>
          <q-card-section class="row items-center q-pa-md">
            <div class="text-h6">Hilfe zum Code</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>

          <q-card-section class="q-pa-md">
            Der StudiCar Code kann benutzt werden, um Fahrtangebote zu teilen
            oder andere Benutzerprofile anzusehen. Um einen Code zu erzeugen,
            geh einfach in deinem Profil auf eine deiner Fahrten und tipp auf
            das kleine Code-Symbol. Diesen Code kann dann ein anderer StudiCar
            Benutzer scannen und sieht direkt den geteilten Inhalt.
            <br />Du musst den Code übrigens nicht besonders genau platzieren.
            Es reicht, wenn er vollständig im Bild und gut zu sehen ist.
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script setup>
defineProps({
  open: {
    type: Boolean,
    required: true,
  },
});

let result = '';
let otherQR = false;
let error = '';
let scannerReady = false;
let scannerHelp = false;

watch(
  open,
  (newValue, oldValue) => {
    if (newValue == true && oldValue == false) scannerReady = false; // so that we always have fade animation on scanner init
  },
  { immediate: true }
);

function emit() {
  $emit('input', open);
}

async function onInit(promise) {
  promise
    .then((_) => {
      scannerReady = true;
    })
    .catch((error) => {
      scannerReady = false;
      var errObj = ((_) => {
        switch (error.name) {
          case 'NotAllowedError':
            return {
              m: 'Zugriff blockiert',
              c: 'Du hast StudiCar verboten, auf die Kamera zuzugreifen. Für dieses Problem haben wir im Support Lösungen bereitgestellt.',
            };
          case 'NotFoundError':
            return {
              m: 'Keine Kamera',
              c: 'StudiCar konnte keine Kamera finden',
            };
          case 'NotSupportedError':
            return {
              m: 'Zertifikatsfehler',
              c: 'Bitte melde dich beim Support, wenn das Problem weiterhin besteht',
            };
          case 'NotReadableError':
            return {
              m: 'Zugriff verweigert',
              c: 'Deine Kamera wird im Moment von einem anderen Prozess verwendet',
            };
          case 'OverconstrainedError':
            return {
              m: 'Nicht kompatibel',
              c: 'Deine Kamera scheint nicht kompatibel zu sein. Bitte schreibe dem Support dein Gerätemodell',
            };
          case 'StreamApiNotSupportedError':
            return {
              m: 'Stream API Fehler',
              c: 'Dein Browser unterstützt die Stream API nicht. Probier es bitte mit einem anderen Browser',
            };
          default:
            return {
              m: 'Fehler aufgetreten',
              c: error.toString(),
            };
        }
      })();

      errorMessage(errObj);
      emit();
    });
}
function errorMessage(errObj) {
  $q.notify({
    type: 'negative',
    message: errObj.m,
    caption: errObj.c || '', // when no caption set, empty string
  });
}
function decoded(res) {
  const type = res.slice(0, 1),
    key = res.slice(1);

  if ('ul'.includes(type))
    $emit('result', {
      type: type,
      res: key,
    });
  else {
    otherQR = true;
    setTimeout(() => {
      otherQR = false;
    }, 1500);
  }
}
function swiped(info) {
  $emit('swipe', info);
}

onMounted(() => {
  scannerReady = false;
});
</script>

<style lang="scss">
.scanning {
  position: relative;
  &:after {
    content: '';
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
    content: '';
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
    content: '';
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
        content: '';
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
