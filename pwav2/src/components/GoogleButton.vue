<template>
  <!-- a beautiful Google Button Component, took thousands of hours to even get that damn borders in perfect gradients
I hope you appreciate my work xD -->
  <div class="zgoogle-btn">
    <div
      clickable
      v-ripple
      @click="doSignIn"
      class="box q-pa-xs row justify-around"
    >
      <q-avatar size="sm" class="self-center q-ml-xs">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
        />
      </q-avatar>
      <span class="text-grey-7 text-subtitle2">
        über
        <br />Google
      </span>
    </div>
    <!--  <div class="google-icon-wrapper">
      <img
        class="google-icon"
        src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
      />
    </div>
    <div class="btn-text">
      <p>Anmeldung</p>
    </div>-->
  </div>
</template>

<script>
import { defineComponent } from "vue";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

export default defineComponent({
  name: "GoogleSignInButton",
  methods: {
    doSignIn() {
      var provider = new firebase.auth.GoogleAuthProvider();

      firebase
        .auth()
        .signInWithPopup(provider)
        .then(_ => _)
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
        });
    }
  }
});
</script>

<style lang="scss" scoped>
$white: #fff;
$google-blue: #4285f4;
$button-active-blue: #1669f2;

.box {
  border: 1px solid;
  border-image-source: conic-gradient(
    rgba(255, 0, 0, 1) 17%,
    rgba(0, 35, 255, 1) 25%,
    rgba(45, 0, 255, 1) 32%,
    rgba(0, 168, 33, 1) 49%,
    rgba(0, 189, 19, 1) 67%,
    rgba(231, 255, 5, 1) 72%,
    rgba(250, 255, 0, 1) 78%,
    rgba(255, 0, 0, 1) 88%
  );
  border-image-slice: 1;
}

.google-btn {
  width: 200px;
  height: 42px;
  background-color: $google-blue;
  border-radius: 2px;
  box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.25);
  cursor: pointer;
  .google-icon-wrapper {
    position: absolute;
    margin-top: 1px;
    margin-left: 1px;
    width: 40px;
    height: 40px;
    border-radius: 2px;
    background-color: $white;
  }
  .google-icon {
    position: absolute;
    margin-top: 11px;
    margin-left: 11px;
    width: 18px;
    height: 18px;
  }
  .btn-text {
    float: right;
    margin: 11px 11px 0 0;
    color: $white;
    font-size: 14px;
    font-weight: 100;
    letter-spacing: 0.2px;
    font-family: "Roboto";
  }
  &:hover {
    box-shadow: 0 0 6px $google-blue;
  }
  &:active {
    background: $button-active-blue;
  }
}

@import url(https://fonts.googleapis.com/css?family=Roboto:500);
</style>
