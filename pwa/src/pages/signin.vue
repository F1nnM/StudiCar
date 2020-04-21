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
        <a href="/#/auth/registrierung">Bist du noch nicht registriert?</a>
      </p>
      <q-separator />
      <GoogleSignInButton />
      <br />
      <span>oder verwende deine Email</span>
      <q-separator />
      <template>
        <div class="q-pa-md">
          <q-form @submit="onSubmit" class="q-gutter-md">
            <q-input
              v-model="email"
              label="Email"
              hint="Bitte gib deine Email-Adresse ein"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Ohne Mail-Adresse wird die Anmeldung schwierig...']"
            />

            <q-input
              type="password"
              v-model="password"
              label="Passwort"
              hint="Bitte gib auch dein Passwort ein"
              lazy-rules
              :rules="[
          val => val !== null && val !== '' || 'Bitte gib dein richtiges Passwort ein.'
        ]"
            />
            <br />

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
import GoogleSignInButton from '../components/GoogleButton'
export default {
  components: {
    GoogleSignInButton
  },
  data () {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    onSubmit() {
      this.$router.replace({name: 'marketplace'}).catch(() => {})
      /*
      let credentials = {
        email: this.email,
        password: this.password
      }
      this.$store.dispatch('auth/signIn', credentials)
        .then(user => {
          this.$router.replace({ name: 'dashboard' }).catch(() => {})
        })
        .catch(error => {
          this.$q.notify('Invalid Login!')
          console.error(`Not signed in: ${error.message}`)
        })
        */
    }
  }
}
</script>