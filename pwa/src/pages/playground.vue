<template>
  <div class="q-pa-md">
    <q-toggle v-model="show" />
    <qrGenerator value="Johannes" :show="show" />
  </div>
</template>

<script>
import qrGenerator from "components/qrGenerator";
import { sendApiRequest, SQL_UPDATE_PROFILE_PICTURE } from '../ApiAccess';

export default {
  components: {
    qrGenerator
  },
  data() {
    return {
      show: false
    };
  },
  methods: {
    updateProfilePicture() {
      sendApiRequest(SQL_UPDATE_PROFILE_PICTURE,
      {imageData: /*base64-string goes here */ ""},
      _ => alert("success"),
      error => {throw error})
    }
  },
  mounted () {
      
    }
};
</script>