<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md">
      <div class="text-h4 q-mt-xl custom-underline c-u-l c-u-2 c-u-md q-mb-xl">
        Anmeldung
        <q-btn
          icon="help_outline"
          rounded
          flat
          @click="help = true"
          dense
          class="q-ml-md"
          size="md"
        />
      </div>
      <!-- <span class="text-caption">Bitte melde dich an, um auf die Funktionen zugreifen zu können</span> -->
      <div class="row justify-evenly">
        <GoogleButton class="col-5" />
        <q-btn
          dense
          no-caps
          class="col-5"
          to="/auth/registrierung"
          outline
          color="primary"
        >
          <q-avatar size="sm" class="q-mr-xs">
            <img src="~assets/app-icon.svg" />
          </q-avatar>
          <span class="text-dark">Registrierung</span>
        </q-btn>
      </div>
      <q-separator class="q-mb-xl" />
      <p>Oder verwende einen StudiCar Account:</p>
      <div>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            v-model="mail"
            label="Mail"
            hint="Bitte gib deine Mail-Adresse ein"
            lazy-rules
            :rules="[
              (val) =>
                (val && val.length > 0) ||
                'Ohne Mail-Adresse wird die Anmeldung schwierig...',
            ]"
          />

          <q-input
            type="password"
            v-model="password"
            label="Passwort"
            hint="Bitte gib auch dein Passwort ein"
            lazy-rules
            :rules="[
              (val) =>
                (val !== null && val !== '') || 'Bitte gib dein Passwort ein.',
            ]"
          />
          <br />

          <div>
            <q-btn label="Anmelden" type="submit" color="primary" />
          </div>
        </q-form>
      </div>
    </div>
    <q-dialog v-model="help">
      <q-card>
        <q-toolbar>
          <q-toolbar-title>Hilfe</q-toolbar-title>
          <q-btn flat dense v-close-popup icon="close" />
        </q-toolbar>
        <q-card-section>
          Bei StudiCar gibt es zwei Möglichkeiten, sich anzumelden:
          <ul>
            <li>
              Mit einem ganz normalen StudiCar Account. Dafür musst du dir
              zuerst über "Registrierung" einen StudiCar Account erstellen. Du
              brauchst dazu nur eine Mail, ein Passwort und deinen Namen. Wenn
              du registriert bist, kannst du loslegen.
            </li>
            <li>
              Mit einem Google-Account. Du gehst auf "über Google" und wählst im
              aufgehenden Fenster dann den Account aus, mit dem du dich anmelden
              willst. Deinen Namen und deine Mail frägt StudiCar dann bei Google
              ab.
            </li>
          </ul>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- <q-dialog maximized transition-show="fade" transition-hide="fade" v-model="help">
      <div class="text-white q-pa-xl text-subtitle1">haha</div>
    </q-dialog>-->
  </div>
</template>

<script setup>
import { useUserStore } from 'src/stores/user';
import { useAppStore } from 'src/stores/app';

let mail = '';
let password = '';
let help = false;

const userStore = useUserStore();
const appStore = useAppStore();

const $router = useRouter();

function onSubmit() {
  userStore
    .signInWithEmail(mail, password)
    .then(() => {
      if (appStore.nextPage) {
        $router.replace({ path: appStore.nextPage });
        appStore.resetWantedPage();
      } else $router.replace({ name: 'marketplace' });
    })
    .catch((error) => {
      $q.notify('Invalid Login!');
      console.error(`Not signed in: ${error.message}`);
    });
}
</script>
