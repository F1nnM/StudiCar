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
        <a href="/#/auth/anmeldung">Bist du bereits registriert?</a>
      </p>
    </div>
    <q-separator />

    <template>
      <div class="q-pa-md">
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            hint="Wie willst du in der App heißen?"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Der Benutzername ist ein Schlüssel fürs System...']"
            v-model="username"
            label="Benutzername"
          />

          <q-input
            type="password"
            v-model="pwd"
            label="Passwort"
            hint="Gib ein sicheres Passwort ein"
            lazy-rules
            :rules="[
          val => val !== null && val !== '' || 'Du musst deinen Account mit einem Passwort sichern.'
        ]"
          />
          <div v-for="n in 2" :key="n">
            <br />
          </div>

          <q-dialog v-model="dialog">
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

              <q-stepper v-model="step" vertical color="primary" animated style="max-width: 80vw;">
                <q-step :name="1" title="Allgemeines" icon="stay_current_portrait" :done="step > 1">
                  <q-card>
                    <q-card-section class="scroll">{{global.systemInfo.about.general}}</q-card-section>
                    <q-card-section style="max-height: 50vh" class="scroll">
                      <p
                        v-for="n in 15"
                        :key="n"
                      >Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis perferendis totam, ea at omnis vel numquam exercitationem aut, natus minima, porro labore.</p>
                    </q-card-section>
                  </q-card>
                  <q-stepper-navigation>
                    <q-btn @click="step = 2" color="primary" label="Weiter" />
                  </q-stepper-navigation>
                </q-step>

                <q-step :name="2" title="Datenschutz" icon="security" :done="step > 2">
                  {{global.systemInfo.about.privacy}}
                  <q-stepper-navigation>
                    <q-btn @click="step = 3" color="primary" label="Weiter" />
                    <q-btn flat @click="step = 1" color="primary" label="Zurück" class="q-ml-sm" />
                  </q-stepper-navigation>
                </q-step>

                <q-step :name="3" title="Rechtliches" icon="sort">
                  {{global.systemInfo.about.lawful}}
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
      step: 1
    }
  },

  methods: {
    onSubmit () {
      alert("YEAH");
      submit();
    }
  }
}

</script>