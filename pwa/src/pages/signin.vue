<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md">
      <div class="text-h4 q-mt-xl">Anmeldung</div>
      <hr />
      <span>Bitte melde dich an, um auf die Funktionen zugreifen zu können.</span>

      <q-separator />
      <GoogleSignInButton />
      <q-separator />
      <p>
        Oder verwende deine Email: (
        <a href="/#/auth/registrierung">Noch nicht registriert?</a>)
      </p>
      <div>
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
    </div>
  </div>
</template>

<script>
import GoogleSignInButton from "../components/GoogleButton";
export default {
  components: {
    GoogleSignInButton
  },
  data() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    onSubmit() {
      let credentials = {
        email: this.email,
        password: this.password
      }
      this.$store.dispatch('auth/signIn', credentials)
        .then(user => {
          this.$router.replace({ name: 'marketplace' }).catch(() => {})
        })
        .catch(error => {
          this.$q.notify('Invalid Login!')
          console.error(`Not signed in: ${error.message}`)
        })
        
    }
  }
};
</script>