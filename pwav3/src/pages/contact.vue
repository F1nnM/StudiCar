<template>
  <div class="flex flex-center q-ma-md">
    <p>Bis jetzt bist du halt hilflos, wenn du ein Problem hast. Find dich damit ab.</p>
  </div>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: 'Contact',
  mounted(){
      this.$store.state.pageName = 'Kontakt'
  }
});
</script>
