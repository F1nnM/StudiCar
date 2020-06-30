<template>
  <div class="flex flex-center q-ma-md">
    <p>Bis jetzt bist du halt hilflos, wenn du ein Problem hast. Find dich damit ab.</p>
  </div>
</template>

<script>
export default {
  name: 'Contact',
  mounted(){
      this.$store.state.pageName = 'Kontakt'
  }
}
</script>
