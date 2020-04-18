<template>
  <div class="q-pa-md">
    <p>TESTESTESTSETLorem ipsum dolor, sit amet consectetur adipisicing elit. Autem qui sequi voluptates perspiciatis tempore obcaecati hic, esse ipsum corrupti corporis molestiae debitis porro omnis, sapiente non delectus placeat ipsa cupiditate.</p>
    <pre>{{sqlTestData}}</pre>
    <input v-model="field"><br>
    <button @click="writeTestData();">Add Data</button>
    <button @click="getTestData();">Load Data</button>
  </div>
</template>

<script>
import { sendApiRequest, SQL_TEST_READ, SQL_TEST_ADD } from "../ApiAccess";
export default {
  data() {
    return {
      chats: "play",
      logged: false,
      scrolled: false,
      value: "Hallo",
      sqlTestData: "",
      field: ""
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
    }
  },
  mounted() {
    this.getTestData();
  }
};
</script>