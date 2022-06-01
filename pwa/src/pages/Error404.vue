<template>
  <div>
    <q-img
      class="fixed-center fixed-full"
      src="~assets/app-logo.svg"
      style="filter: blur(3px)"
    />
    <div
      class="fixed-center text-center"
      style="background-color: rgba(255, 255, 255, 0.8)"
    >
      <p class="text-h4 text-center text-weight-light q-pt-md q-mb-xl">
        Fehler 404
      </p>

      <br />
      <p class="text-h6 text-weight-light q-mt-md">
        Die angeforderte Seite existiert nicht. Bitte korrigiere deine Eingaben.
      </p>
      <q-btn class="q-mt-sm" color="primary" to="/" label="Zum Marktplatz" />
    </div>
  </div>
</template>

<script setup></script>
