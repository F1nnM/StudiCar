<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md" style="max-width: 600px">
      <div class="text-h4">Dein Profil</div>
      <hr />
      <br />
      <p>Hier siehst du alle wichtigen Infos zu deinem Profil.</p>
    </div>
    <q-img
      transition-show="slide-left"
      src="~assets/sad.svg"
      style="height: 200px; max-width: 50vw;"
    >
      <template v-slot:loading>
        <div class="absolute-full flex flex-center text-black">
          <q-inner-loading
            transition-show="slide-down"
            transition-hide="slide-down"
            size="50px"
            color="light-blue"
            class="q-ma-md"
          />
        </div>
      </template>
      <template v-slot:error>
        <div
          class="absolute-full flex flex-center text-white"
        >Bild kann leider nicht geladen werden. Bitte Internetverbindung überprüfen.</div>
      </template>
    </q-img>

    <br />
    <div style="padding: 20px;">
      <p>Dabei seit: {{since}}</p>
      <p>Mitfahrangebote gesamt: {{lifts_all}}</p>
      <p>Wochendurchschnitt: {{avg_lifts_per_week}}</p>
    </div>

    <p>Wie weit soll deine Mitfahrgelegenheit maximal von dir weg sein?</p>

    <q-slider
      v-model="distance"
      :min="5"
      :max="40"
      :step="5"
      snap
      label-always
      :label-value="distance+'km'"
      color="primary"
    />
  </div>
</template>

<script>

export default {


data(){
  return{
    since: 'Datum',
    avg_lifts_per_week: 1,
    lifts_all: 45,
    distance: 20
  }
}
    
}
</script>