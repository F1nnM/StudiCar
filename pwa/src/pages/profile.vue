<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md" style="max-width: 600px">
      <div class="text-h4">Dein Profil</div>
      <hr />
      <br />
      <p>Hier siehst du alle wichtigen Infos zu deinem Profil.</p>
    </div>
    <q-img src="~assets/sad.svg" style="height: 200px; max-width: 50vw;" />
    <br />
    <div style="padding: 20px;">
      <p>Dabei seit: {{since}}</p>
      <p>Mitfahrangebote gesamt: {{lifts_all}}</p>
      <p>Wochendurchschnitt: {{avg_lifts_per_week}}</p>
    </div>
  </div>
</template>

<script>

export default {


data(){
  return{
    since: 'Datum',
    lifts_all: 45
  }
}
    
}
</script>