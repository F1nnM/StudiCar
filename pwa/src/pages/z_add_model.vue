<template>
  <div class="q-pa-md">
    <p class="text-h4">Bitte wähle die Daten deines Modells aus</p>
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <q-input
        v-model="car.brand"
        label="Marke"
        hint
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Please type something']"
      />

      <q-input
        filled
        type="number"
        v-model="age"
        label="Your age *"
        lazy-rules
        :rules="[
          val => val !== null && val !== '' || 'Please type your age',
          val => val > 0 && val < 100 || 'Please type a real age'
        ]"
      />
      <p class="text-caption">
        Du solltest unsere
        <a href="https://mi.com">Nutzungsbedingungen</a> gelesen haben, bevor du etwas hochlädst.
      </p>

      <div>
        <q-btn label="Speichern" type="submit" flat color="primary" />
        <q-btn label="Abbrechen" type="reset" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      car: {
        brand: "",
        model: "",
        type: "",
        color: "",
        image: ""
      }
    };
  },

  computed: {
    title() {
      var greeting = this.$store.state.greeting;
      var name = this.$store.getters["auth/user"].name.split(" ")[0];
      return greeting + ", " + name;
    }
  },

  mounted() {
    this.$store.commit("setPage", {
      name: "Modell hinzufügen"
    });
  }
};
</script>