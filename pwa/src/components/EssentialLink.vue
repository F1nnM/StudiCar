<template>
  <q-item v-if="!isDisabled" clickable tag="a" :href="link">
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  name: "EssentialLink",
  props: {
    title: {
      type: String,
      required: true
    },

    onlyDev: Boolean,

    caption: {
      type: String,
      default: ""
    },

    link: {
      type: String,
      default: "#"
    },

    icon: {
      type: String,
      default: ""
    }
  },
  computed: {
    isDisabled() {
      if (!process.env.DEV) return this.onlyDev;
      else return false;
    }
  }
};
</script>
