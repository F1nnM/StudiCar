<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md" style="max-width: 600px">
      <br />
      <br />
      <div class="text-h4">Anmeldung</div>
      <hr />

      <br />Bitte melde dich an, um auf die Funktionen zugreifen zu können.
      <br />
      <p>
        <a href="/#/registrierung">Bist du noch nicht registriert?</a>
      </p>
      <template></template>
      <q-separator />
      <template>
        <div class="q-pa-md">
          <q-form @submit="onSubmit" class="q-gutter-md">
            <q-input
              filled
              v-model="username"
              label="Benutzername"
              hint="Bitte gib deinen Benutzernamen ein"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Ohne Benutzername wird die Anmeldung schwierig...']"
            />

            <q-input
              filled
              type="password"
              v-model="pwd"
              label="Passwort"
              hint="Bitte gib auch dein Passwort ein"
              lazy-rules
              :rules="[
          val => val !== null && val !== '' || 'Bitte gib dein richtiges Passwort ein.'
        ]"
            />
            <q-separator spaced />

            <div>
              <q-btn label="Anmelden" type="submit" color="primary" />
            </div>
          </q-form>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      contentStyle: {
        backgroundColor: 'rgba(0,0,0,0.02)',
        color: '#555'
      },

      contentActiveStyle: {
        backgroundColor: '#eee',
        color: 'black'
      },

      thumbStyle: {
        right: '2px',
        borderRadius: '5px',
        backgroundColor: '#027be3',
        width: '5px',
        opacity: 0.75
      }
    }
  }
}
</script>