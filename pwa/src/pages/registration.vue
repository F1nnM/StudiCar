<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md" style="max-width: 600px">
      <br />
      <br />
      <div class="text-h4">Registrierung</div>
      <hr />
      <br />Bitte erstelle einen Account, damit wir dich in unser System aufnehmen können.
      <br />
      <p>
        <a href="/#/anmeldung">Bist du bereits registriert?</a>
      </p>
    </div>

    <q-dialog v-model="dialog" full-height full-width>
      <q-card class="column full-height full-width">
        <p class="text-h5 text-weight-medium text-center" style="padding: 10px;">Nutzungsbedingungen</p>
        <q-stepper v-model="step" vertical color="primary" animated>
          <q-step :name="1" title="Allgemeines" icon="stay_current_portrait" :done="step > 1">
            {{general}}
            <q-stepper-navigation>
              <q-btn @click="step = 2" color="primary" label="Weiter" />
            </q-stepper-navigation>
          </q-step>

          <q-step :name="2" title="Datenschutz" icon="security" :done="step > 2">
            {{privacy}}
            <q-stepper-navigation>
              <q-btn @click="step = 3" color="primary" label="Weiter" />
              <q-btn flat @click="step = 1" color="primary" label="Zurück" class="q-ml-sm" />
            </q-stepper-navigation>
          </q-step>

          <q-step :name="3" title="Rechtliches" icon="sort">
            {{lawful}}
            <q-stepper-navigation>
              <q-btn flat @click="step = 2" color="primary" label="Zurück" class="q-ml-sm" />
              <q-btn @click="accept = true" color="primary" label="Ok, akzeptiert" v-close-popup />
            </q-stepper-navigation>
          </q-step>
        </q-stepper>
        <q-card-actions align="right" class="bg-white text-teal"></q-card-actions>
      </q-card>
    </q-dialog>

    <q-form @submit="onSubmit" class="q-gutter-md">
      <q-input
        filled
        v-model="username"
        label="Benutzername"
        hint="Wie willst du in der App heißen?"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Der Benutzername ist ein Schlüssel fürs System...']"
      />

      <q-input
        filled
        type="password"
        v-model="pwd"
        label="Passwort"
        hint="Gib ein sicheres Passwort ein"
        lazy-rules
        :rules="[
          val => val !== null && val !== '' || 'Du musst deinen Account mit einem Passwort sichern.'
        ]"
      />
      <q-separator spaced />
      <q-checkbox v-model="accept" disable color="primary" />Ich bin mit den
      <span
        @click="dialog = true"
        style="text-decoration: underline; padding: 0 5px;"
      >Nutzungsbedingungen</span>einverstanden.
      <small>
        <br />(Hinweis: Das Häkchen wird dann gesetzt, wenn du sie gelesen hast.)
      </small>
      <q-separator spaced />
      <div>
        <q-btn label="Weiter" type="submit" color="primary" />
      </div>
    </q-form>
  </div>
</template>

<script>

export default {
  data(){
    return{
      username: null,
      pwd: null,
      accept: false,
      dialog: false,
      terms_opened: false,
      step: 1,
      general: 'Hier steht das allgemeine Zeug',
      lawful: 'Hier stehen dann die rechtlichen Sachen',
      privacy: 'Hier stehen dann die Sachen, die mit dem Datenschutz zu tun haben',
      slide: 1
    }
  },

  methods: {
    onSubmit () {
      if (this.accept !== true) {
        this.$q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message: 'Du musst erst den Nutzungsbedingungen und AGBs zustimmen. Du findest sie über dem Registrierungs-Button.'
        })
      }
      else {
        this.$q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'Submitted'
        })
      }
    }
  }
}

// prototype for general:
/*
Zur Nutzung deines Accounts musst du einen Benutzernamen und ein Passwort vergeben. Wie das gespeichert und verarbeitet wird, kannst du gleich beim Datenschutz lesen.
Der Benutzername ist ein Schlüssel im System. Solltest du ihn nicht mehr wissen, kannst du nicht mehr auf deinen Account zugreifen. Merke ihn dir daher gut
oder schreib ihn dir am besten irgendwo auf.
Dein Passwort benötigst du, um dich in der App anzumelden. Solltest du es vergessen haben, kannst du in den Einstellungen dein Passwort zurücksetzen lassen,
allerdings senden wir dir dein neues, automatisch generiertes Passwort per Mail zu, du musst deine Mailadresse also im Voraus in der App eingegeben haben.
Sollte dies nicht der Fall sein, wirst du dir leider einen neuen Account erstellen müssen.

*/
</script>