<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md" style="max-width: 600px">
      <div class="text-h4">{{ greeting }}, {{ user.name }}</div>
      <hr />
      <br />
      <p>
        Der Marktplatz ist so etwas wie das Schwarze Brett von StudiCar. Hier siehst du alle Angebote Mitfahrgelegenheiten, aufsteigend nach Entfernung geordnet.
        Aktuell sind {{users_online}} unserer {{users_all}} Benutzer online ({{Math.round(users_online/users_all*100)}}%).
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    var hours = new Date().getHours();
    var greeting = "Willkommen";
    if (hours > 18) {
      greeting = "Guten Abend";
    } else if (hours < 8) {
      greeting = "Guten Morgen";
    }
    return {
      users_online: 21,
      users_all: 224,
      greeting: greeting,
      user: {
        name: "Bernd"
        
      }
    };
  }
};
</script>