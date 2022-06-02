<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md">
      <div class="text-h4 q-mt-xl custom-underline c-u-l c-u-2 c-u-md q-mb-xl">
        Registrierung
        <q-btn
          icon="first_page"
          to="/auth/anmeldung"
          class="float-right"
          label="Anmeldung"
          dense
          no-caps
          outline
          rounded
        />
      </div>
      <span
        >Erstelle einen Account, damit StudiCar dich ins System aufnehmen
        kann.</span
      >
    </div>
    <div class="q-mt-xl">
      <q-form @submit="dialog = true" class="q-gutter-md">
        <q-input
          hint="Gib deinen Vornamen ein"
          lazy-rules
          :rules="[
            (val) =>
              isValidName(val) || 'Bitte gib einen gültigen Vornamen ein.',
          ]"
          v-model="name"
          label="Name"
        />

        <q-input
          hint="Bitte gib auch deinen Nachnamen ein, damit dich andere erkennen können."
          lazy-rules
          :rules="[
            (val) =>
              isValidName(val) || 'Bitte gib einen gültigen Nachnamen ein.',
          ]"
          v-model="surname"
          label="Nachname"
        />

        <q-input
          hint="Unter welcher Email können wir dich erreichen?"
          lazy-rules
          :rules="[
            (val) =>
              (val && val.length > 0 && val.length <= 255) ||
              'Wir brauchen deine Mailadresse, um dich ggf. erreichen zu können.',
          ]"
          v-model="email"
          label="Mail"
        />

        <q-input
          type="password"
          v-model="password"
          label="Passwort"
          hint="Gib ein sicheres Passwort ein"
          lazy-rules
          :rules="[
            (val) =>
              (val !== '' && val.length >= 6) ||
              'Dein Passwort muss mindestens 6 Zeichen lang sein.',
          ]"
        />

        <q-slide-transition>
          <div v-if="password.length">
            <q-input
              type="password"
              v-model="passwordConfirm"
              label="Passwort"
              hint="Wiederhole das obige Passwort"
              lazy-rules
              :rules="[
                (val) =>
                  val === password || 'Passwörter stimmen nicht überein.',
              ]"
            />
          </div>
          />
        </q-slide-transition>
        <div>
          <q-btn
            label="Weiter"
            type="submit"
            @click="dialog = true"
            color="primary"
          />
        </div>
      </q-form>
      <q-dialog v-model="dialog" position="bottom" class="q-mx-sm">
        <q-card class="column">
          <q-toolbar>
            <q-avatar>
              <img src="~assets/app-icon.svg" />
            </q-avatar>

            <q-toolbar-title>
              <small>Nutzungsbedingungen</small>
            </q-toolbar-title>

            <q-btn flat round dense icon="close" v-close-popup />
          </q-toolbar>

          <div class="q-pa-md">
            <p>
              Wir legen unsere Datenschutzpolitik und unsere Allgemeinen
              Geschäftsbedingungen offen.
            </p>

            <div class="q-pr-md q-pb-xs row justify-evenly text-right">
              <q-btn @click="openAGB = true" label="Anzeigen" outline />
              <q-btn
                v-close-popup
                color="primary"
                label="Ich akzeptiere"
                @click="onSubmit"
              />
            </div>
          </div>
        </q-card>
        <q-dialog v-model="openAGB" full-height full-width>
          <q-card>
            <q-card-section class="row items-center q-pb-none">
              <div class="text-h6">Rechtliches</div>
              <q-space />
              <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>
            <q-card-section>
              <q-tabs
                v-model="agbTab"
                dense
                align="justify"
                class="bg-white text-primary"
                :breakpoint="0"
              >
                <q-tab name="agb" label="AGB" />
                <q-tab name="dataSec" label="Datenschutz" />
              </q-tabs>
              <q-tab-panels v-model="agbTab" class="q-py-sm q-px-none">
                <q-tab-panel
                  name="agb"
                  class="q-pa-none"
                  ref="agb_anchor"
                ></q-tab-panel>
                <q-tab-panel
                  name="dataSec"
                  class="q-pa-none"
                  ref="dataSec_anchor"
                ></q-tab-panel>
              </q-tab-panels>
            </q-card-section>
          </q-card>
        </q-dialog>
      </q-dialog>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from 'src/stores/user';

let email = '';
let password = '';
let passwordConfirm = '';
let name = '';
let surname = '';
let dialog = false;
let openAGB = false;
let agbTab = 'agb';
let step = 1;

const userStore = useUserStore();

const $router = useRouter();

watch(agbTab, (newv) => {
  setTimeout(() => {
    var a = $refs[newv + '_anchor'];

    a.$el.innerHTML = this[newv];
  }, 50);
});

function isValidName(text) {
  if (!(text.length > 0 && text.length <= 255)) return false;
  const pattern =
    /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
  if (!text.match(pattern)) return false;
  return true;
}

function onSubmit() {
  userStore
    .registerWithEmail(email, password, name, surname)
    .then((user) => {
      $router.replace({ name: 'marketplace' });
    })
    .catch((error) => {
      $q.notify('Invalid Login!');
      console.error(`Not signed in: ${error.message}`);
    });
}
</script>
