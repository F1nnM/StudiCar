<template>
  <div>
    <q-list>
      <q-item class="timeline-border border-bottom">
        <q-item-section>
          <q-item-label>{{ firstEntry.city }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-item-label header>bei {{ firstEntry.passengerName }}</q-item-label>
        </q-item-section>
        <q-item-section v-if="firstEntry.id != -1">
          <q-icon name="school" size="xs" />
        </q-item-section>
      </q-item>
      <q-expansion-item
        v-if="!middleEntries.length"
        v-model="showStations"
        dense
        label="Zwischenstopps"
      >
        <q-item dense v-for="s in middleEntries" :key="s.city + Math.random()">
          <q-item-section>
            <q-item-label>{{ s.city }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label header>bei {{ s.details }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-expansion-item>
      <q-item class="timeline-border border-top">
        <q-item-section>
          <q-item-label>{{ lastEntry.city }}</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label header>bei {{ lastEntry.details }}</q-item-label>
        </q-item-section>
        <q-item-section side v-if="lastEntry.id != -1">
          <q-icon name="school" size="xs" />
        </q-item-section>
      </q-item>
    </q-list>
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
  data() {
    return {
      showStations: false
    };
  },
  computed: {
    borderLeft() {
      return ""; //"padding-left: 7px; border-left: 1px solid " + (this.color || "black")
    },

    firstEntry() {
      return this.entries[0];
    },

    lastEntry() {
      var l = this.entries.length;
      if (!l) return null;
      else {
        return this.entries[l - 1];
      }
    },

    middleEntries() {
      var l = this.entries.length;
      if (l < 3) return [];
      else {
        var newEns = JSON.parse(JSON.stringify(this.entries));
        newEns.pop();
        newEns.shift();
        return newEns;
      }
    }
  },
  methods: {
    emit() {
      this.$emit("input", this.showStations);
    }
  }
};
</script>

<style lang="scss" scoped>
.timeline-border {
  position: relative;
  &::after {
    content: "";
    position: absolute;
    left: 0;
    border-left: 1px dashed $primary;
    height: 5px;
    width: 10px;
  }

  &.border-top {
    bottom: 80%;
  }

  &.border-bottom {
    top: 80%;
  }
}
</style>