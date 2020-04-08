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

    <q-form @submit="onSubmit" class="q-gutter-md">
      <q-field stack-label>
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">
            <q-input
              v-model="username"
              autofocus
              label="Benutzername"
              hint="Wie willst du in der App heißen?"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Der Benutzername ist ein Schlüssel fürs System...']"
            />
          </div>
        </template>
      </q-field>

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
      <q-separator spaced />

      <q-dialog v-model="dialog" full-height full-width>
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
          <q-stepper v-model="step" vertical color="primary" animated>
            <q-step :name="1" title="Allgemeines" icon="stay_current_portrait" :done="step > 1">
              <div v-for="n in 10" :key="n">{{general}}</div>
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
                <q-btn v-close-popup color="primary" label="Ok, akzeptiert" @click="onSubmit" />
              </q-stepper-navigation>
            </q-step>
          </q-stepper>
          <q-card-actions align="right" class="bg-white text-teal"></q-card-actions>
        </q-card>
      </q-dialog>
      <div>
        <q-btn label="Weiter" @click="dialog=true" color="primary" />
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
      dialog: false,
      hide_footer: true,
      step: 1,
      general: 'Hier steht das allgemeine Zeug',
      lawful: 'Hier stehen dann die rechtlichen Sachen',
      privacy: 'Hier stehen dann die Sachen, die mit dem Datenschutz zu tun haben'
    }
  },

  methods: {
    onSubmit () {
      alert("YEAH");
      submit();
    }
  }
}

// prototypes:
/*
GENERAL:
Zur Nutzung deines Accounts musst du einen Benutzernamen und ein Passwort vergeben. Wie das gespeichert und verarbeitet wird, kannst du gleich beim Datenschutz lesen.
Der Benutzername ist ein Schlüssel im System. Solltest du ihn nicht mehr wissen, kannst du nicht mehr auf deinen Account zugreifen. Merke ihn dir daher gut
oder schreib ihn dir am besten irgendwo auf.
Dein Passwort benötigst du, um dich in der App anzumelden. Solltest du es vergessen haben, kannst du in den Einstellungen dein Passwort zurücksetzen lassen,
allerdings senden wir dir dein neues, automatisch generiertes Passwort per Mail zu, du musst deine Mailadresse also im Voraus in der App eingegeben haben.
Sollte dies nicht der Fall sein, wirst du dir leider einen neuen Account erstellen müssen.

PRIVACY:
- Tom, Jules, Finn -

LAWFUL:
- Jules -

*/
</script>