<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md" style="max-width: 600px">
      <div class="text-h4">App-Einstellungen</div>
      <hr />
      <br />
      <p>Mach dir deine App so, wie du sie willst.</p>

      <div class="q-pa-md">
        <p>Wie weit soll deine Mitfahrgelegenheit maximal von dir weg sein?</p>

        <q-slider
          v-model="value"
          :min="5"
          :max="40"
          :step="5"
          snap
          label-always
          :label-value="value+'km'"
          color="primary"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      value: 10
    }
  }
}
</script>