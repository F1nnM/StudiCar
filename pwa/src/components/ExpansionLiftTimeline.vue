<template>
  <div>
    <q-timeline :color="color || 'primary'" layout="comfortable">
      <div :style="borderLeft" clickable @click="value = !value">
        <q-timeline-entry :avatar="entries[0].avatar" :icon="entries[0].icon" v-if="entries[0]">
          <template v-slot:title>{{ entries[0].title }}</template>
          <template v-slot:subtitle>{{ entries[0].subtitle }}</template>

          <div v-if="entries[0].text">{{ entries[0].text }}</div>
        </q-timeline-entry>

        <!--   <slot name="header"></slot> -->
        <q-slide-transition>
          <div v-if="value">
            <q-timeline-entry
              v-for="e in middleEntries"
              :key="e.title"
              :avatar="e.avatar"
              :icon="e.icon"
            >
              <template v-slot:title>{{ e.title }}</template>
              <template v-slot:subtitle>{{ e.subtitle }}</template>

              <div v-if="e.text">{{ e.text }}</div>
            </q-timeline-entry>
          </div>
        </q-slide-transition>
      </div>
      <div :style="borderLeft">
        <q-timeline-entry :avatar="lastEntry.avatar" :icon="lastEntry.icon" v-if="lastEntry">
          <template v-slot:title>{{ lastEntry.title }}</template>
          <template v-slot:subtitle>{{ lastEntry.subtitle }}</template>

          <div v-if="lastEntry.text">{{ lastEntry.text }}</div>
        </q-timeline-entry>
      </div>
    </q-timeline>
  </div>
</template>

<script>
import { date } from "quasar";

export default {
  name: "ExpansionTimeline",
  props: {
    color: String,
    entries: Array
  },
  data(){
    return {
      value: false
    }
  },
  computed: {
    borderLeft() {
      return (
        '' //"padding-left: 7px; border-left: 1px solid " + (this.color || "black")
      );
    },

    lastEntry(){
      var l = this.entries.length
      if(!l) return null
      else {
        return this.entries[l-1]
      }
    },

    middleEntries(){
      var l = this.entries.length
      if(l<3) return []
      else {
        var newEns = JSON.parse(JSON.stringify(this.entries))
        newEns.pop()
        newEns.shift()
        return newEns
      }
    }
  },
  methods: {
    emit() {
      this.$emit("input", this.value);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>