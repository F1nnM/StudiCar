<template>
  <div v-if="showSuccess ? true : state != 2">
    <q-slide-transition>
      <div v-if="state == 1">
        <q-card-section>
          <p>{{ loadingText }}</p>

          <q-linear-progress indeterminate color="primary" class="q-mt-sm" />
        </q-card-section>
      </div>
      <q-card v-else-if="state == 2 && showSuccess">
        <q-card-section>
          <p>
            <q-icon name="check" size="md" color="primary" />
            {{ successText }}
          </p>
        </q-card-section>
      </q-card>
      <q-card v-else-if="state == -1">
        <q-card-section>
          <p>
            <q-icon name="error_outline" size="md" color="negative" />
            <span class="q-pl-sm">
              <span v-if="!errorText">
                Beim Download ist ein Fehler aufgetreten. Wenn das Problem öfter
                auftritt, dann
                <a href="#/support">schreib uns</a> bitte.
              </span>
              <span v-else>{{ errorText }}</span>
            </span>
          </p>
        </q-card-section>
      </q-card>
    </q-slide-transition>
  </div>
</template>

<script setup>
defineProps({
  state: {
    required: true,
  },
  successText: {
    type: String,
  },
  loadingText: {
    type: String,
    required: true,
  },
  errorText: {
    type: String,
    required: true,
  },
  showSuccess: {
    type: Boolean,
  },
});
</script>
