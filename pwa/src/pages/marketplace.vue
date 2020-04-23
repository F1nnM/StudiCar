<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md" style="max-width: 600px">
      <div
        class="text-h5 custom-underline c-u-l c-u-2 c-u-md"
      >{{global.systemInfo.greeting}}, {{$store.getters['auth/user'].name.split(' ')[0]}}</div>
      <br />
      <p>
        Der Marktplatz ist so etwas wie das Schwarze Brett von StudiCar. Hier siehst du alle aktuellen Mitfahrgelegenheiten, aufsteigend nach Entfernung geordnet.
        Aktuell sind übrigens {{global.systemInfo.usersOnline}} unserer {{global.systemInfo.usersAll}} Benutzer online (entspricht {{Math.round(global.systemInfo.usersOnline/global.systemInfo.usersAll*100)}}%).
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      
    };
  }
};
</script>