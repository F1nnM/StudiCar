<template>
  <div class="q-pa-md">
    <p>TESTESTESTSET</p>
    <pre>{{sqlTestData}}</pre>
    <input v-model="field" />
    <br />
    <button @click="writeTestData();">Add Data</button>
    <button @click="getTestData();">Load Data</button>
    <button @click="tryUserAdd();">Try User Add</button>
    <div>
      <p class="error">{{ error }}</p>

      <p class="decode-result">
        Last result:
        <b>{{ result }}</b>
      </p>
      <qrcode-stream @decode="onDecode" @init="onInit" />
    </div>
  </div>
</template>

<script>
import { sendApiRequest, SQL_TEST_READ, SQL_TEST_ADD, SQL_USER_ADD } from "../ApiAccess";
import { QrcodeStream } from "vue-qrcode-reader";
export default {
  components: { QrcodeStream },
  data() {
    return {
      sqlTestData: "",
      field: "",
      result: "",
      error: ""
    };
  },
  methods: {
    getTestData() {
      sendApiRequest(
        SQL_TEST_READ,
        null,
        data => (this.sqlTestData += JSON.stringify(data) + "\n"),
        error => (this.sqlTestData += "ERROR: " + JSON.stringify(error) + "\n")
      );
    },
    writeTestData() {
      sendApiRequest(
        SQL_TEST_ADD,
        { data: this.field },
        data => (this.sqlTestData += JSON.stringify(data) + "\n"),
        error => (this.sqlTestData += "ERROR: " + JSON.stringify(error) + "\n")
      );
    },
    tryUserAdd(){
      sendApiRequest(
        SQL_USER_ADD,
        {},
        data => (this.sqlTestData += JSON.stringify(data) + "\n"),
        error => (this.sqlTestData += "ERROR: " + JSON.stringify(error) + "\n")
      )
    },
    onDecode(result) {
      this.result = result;
    },
    async onInit(promise) {
      try {
        await promise;
      } catch (error) {
        if (error.name === "NotAllowedError") {
          this.error = "ERROR: you need to grant camera access permisson";
        } else if (error.name === "NotFoundError") {
          this.error = "ERROR: no camera on this device";
        } else if (error.name === "NotSupportedError") {
          this.error = "ERROR: secure context required (HTTPS, localhost)";
        } else if (error.name === "NotReadableError") {
          this.error = "ERROR: is the camera already in use?";
        } else if (error.name === "OverconstrainedError") {
          this.error = "ERROR: installed cameras are not suitable";
        } else if (error.name === "StreamApiNotSupportedError") {
          this.error = "ERROR: Stream API is not supported in this browser";
        }
      }
    }
  },
  mounted() {
    this.getTestData();
  }
};
</script>