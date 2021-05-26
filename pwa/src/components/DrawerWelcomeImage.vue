<template>
  <!-- this is a fun component to make the left drawer prettier -->
  <div>
    <q-img
      v-if="true"
      :src="randomImage"
      style="height: 35vh;"
      class="text-white"
    >
      <div class="row full-width q-pa-md">
        <div class="text-h6 col-10 text-weight-light">{{ greeting.full }}</div>
        <q-icon size="sm" class="col-2" :name="greetingIcon" />
      </div>
      <div
        v-if="caption && showTicker"
        class="full-width absolute-bottom-left text-caption"
      >
        {{ caption }}
        <!-- <small>
          <br />bezogen von
          <a class="text-white" href="https://der-postillon.com"
            >der Postillon</a
          >
        </small> -->
      </div>
    </q-img>
  </div>
</template>

<script>
export default {
  name: "DrawerWelcomeImage",
  props: {
    timeText: {
      type: String,
      required: true
    },
    caption: String
  },
  data() {
    return {};
  },

  computed: {
    showTicker() {
      return this.$store.state.settings.enablePostillonNewsFeed;
    },

    randomImage() {
      /* if (this.$store.getters["auth/user"].dataSaver) {
        switch (this.timeText) {
          case "Guten Morgen":
            img = "morning/sunrise";
            break;
          case "Willkommen":
            img = "day/sun";
            break;
          case "Guten Abend":
            img = "day/moon";
            break;
          default:
            error = true;
        }
        if (error) {
          return require("../assets/sad.svg");
        }
        return require("../assets/drawer_images/" + img + ".svg");
      } */

      var morningMax = 8;
      var dayMax = 14;
      var eveningMax = 13; // currently hard coded, could be optimized by automatically reading all files from dir
      var error = false;

      var imgPath;

      switch (this.timeText) {
        case "Guten Morgen":
          imgPath = "morning/m" + Math.floor(Math.random() * morningMax);
          break;
        case "Willkommen":
          imgPath = "day/d" + Math.floor(Math.random() * dayMax);
          break;
        case "Guten Abend":
          imgPath = "evening/e" + Math.floor(Math.random() * eveningMax);
          break;
        default:
          error = true;
      }
      if (error) return require("../assets/sad.svg");
      else return require("../assets/drawer_images/" + imgPath + ".jpg");
    },

    greeting() {
      return {
        full:
          this.timeText +
          ", " +
          this.$store.getters["auth/user"].name.split(" ")[0],
        time: this.timeText
      };
    },

    greetingIcon() {
      switch (this.timeText) {
        case "Guten Abend":
          return "nights_stay";
          break;
        case "Willkommen":
          return "brightness_7";
          break;
        case "Guten Morgen":
          return "wb_sunny";
          break;
        default:
          return "report_problem";
      }
    }
  },
  methods: {
    randomArrayItem(array) {
      return array[Math.floor(Math.random() * array.length)];
    }
  }
};
</script>
