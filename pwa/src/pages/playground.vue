<template>
  <div class="q-pa-md">
    <p>{{idToken}}</p>
    <q-toggle v-model="show" />
    <qrGenerator value="Johannes" :show="show" />
  </div>
</template>

<script>
import qrGenerator from "components/qrGenerator";

export default {
  components: {
    qrGenerator
  },
  data() {
    return {
      show: false,
      idToken: ''
    };
  },
  methods: {
    
  },
  mounted () {
      this.$firebase
        .auth()
        .currentUser.getIdToken(/* forceRefresh */ true)
        .then(idToken_ => {
          this.idToken = idToken_;
        })
        .catch(error => {
          this.idToken = "ERROR: "+error;
        });
    }
};
</script>