<template>
  <div class="q-pa-md">
    <q-toggle v-model="show" />
    <qrGenerator value="Johannes" :show="show" />
  </div>
</template>

<script>

import qrGenerator from 'components/qrGenerator'

export default {

  components: {
    qrGenerator
  },
  data() {
    return {
      show: false
    };
  },
  methods: {}
};
</script>