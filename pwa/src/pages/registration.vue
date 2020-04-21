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
            hint="Bitte gib deinen Vornamen ein"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Bitte gib deinen Namen ein, damit wir wisen, mit wem wir es zu tun haben.']"
            v-model="username"
            label="Vorname"
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
          <br />

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

              <div v-if="false">
                <q-stepper
                  v-model="step"
                  vertical
                  color="primary"
                  animated
                  style="max-width: 80vw;"
                >
                  <q-step
                    :name="1"
                    title="Allgemeines"
                    icon="stay_current_portrait"
                    :done="step > 1"
                  >
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
                      <q-btn
                        v-close-popup
                        color="primary"
                        label="Ok, akzeptiert"
                        @click="onSubmit"
                      />
                    </q-stepper-navigation>
                  </q-step>
                </q-stepper>
              </div>
              <div class="q-pa-md">
                <p>Laut der DSGVO sind wir verpflichtet, unsere Methoden der Datenspeicherung offenzulegen und den Schutz der Daten eines jeden Benutzers zu gewährleisten.</p>
                <p>
                  Da es ziemlich unmöglich ist, jene Menge an Informationen in diesen doch kleinen Bereich zu verpacken, verweisen wir an dieser Stelle auf die dafür eingerichtete
                  <a
                    @click="viewAGBs()"
                    href="https://mi.com"
                  >Datenschutz-Seite</a>.
                </p>
                <br />
                <br />

                <div class="q-px-xl q-pb-xs">
                  <q-btn
                    v-close-popup
                    color="primary"
                    label="Ich akzeptiere die Nutzungsbedingungen"
                    @click="onSubmit()"
                  />
                </div>
              </div>
            </q-card>
          </q-dialog>
          <q-dialog v-model="confirmDialog" persistent position="bottom">
            <q-card>
              <q-card-section class="row items-center">
                <p>Du hast dir die Bestimmungen nicht mal angesehen. Willst du trotzdem zustimmen?</p>
              </q-card-section>

              <q-card-actions align="right">
                <q-btn flat label="AGBs ansehen" @click="viewAGBs()" color="primary" v-close-popup />
                <q-btn
                  flat
                  label="Trotzdem zustimmen"
                  @click="onSubmit(true)"
                  color="primary"
                  v-close-popup
                />
              </q-card-actions>
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

import { openURL } from 'quasar'
import { Dialog } from 'quasar'

export default {
  data(){
    return{
      agbs: false,
      username: '',
      pwd: '',
      dialog: false,
      confirmDialog: false,
      step: 1
    }
  },

  methods: {
    onSubmit (force) {
      if(!this.agbs && !force){
        this.confirmDialog = true
      }
      else {
        alert('SUBMITTED');
      }
    },

    viewAGBs(){
      this.agbs = true
      openURL('https://mi.com')
    }
  }
}

</script>