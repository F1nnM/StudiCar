<template>
  <div>
    <q-badge
      v-if="(courseStations.length > 2)"
      class="q-ml-md"
    >noch {{ courseStations.length - 2 }} Zwischenstopp{{ courseStations.length > 3 ? 's' : '' }}</q-badge>
    <q-chip :label="'jeden ' + getRepeatingWeekday" icon="refresh" v-if="lift.repeatsOn" />

    <q-list>
      <q-item class="q-mb-sm">
        <q-item-section>
          <q-item-label>{{ firstEntry.city }}</q-item-label>
          <!-- </q-item-section>
          <q-item-section>-->
          <q-item-label caption>
            <span v-if="firstEntry.id == -1">bei</span>
            {{ firstEntry.details }}
            <q-icon class="q-ml-sm" v-if="firstEntry.id != -1" name="school" size="1em" />
          </q-item-label>
        </q-item-section>
        <q-item-section class="text-center">
          <q-item-label>
            <div v-if="isDeparting" class="text-primary">
              <span class="text-subtitle2">|</span>
              <q-icon name="arrow_forward" size="xs" />
            </div>
            <q-icon v-else name="keyboard_tab" color="primary" size="xs" />
          </q-item-label>
          <q-item-label caption>
            {{ isDeparting ? 'Abfahrt' : 'Ankunft' }}
            <br />
            um {{ timeToDepartOrArrive }}
          </q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ lastEntry.city }}</q-item-label>
          <!-- </q-item-section>
          <q-item-section>-->
          <q-item-label caption>
            <span v-if="lastEntry.id == -1">bei</span>
            {{ lastEntry.details }}
            <q-icon class="q-ml-md" v-if="lastEntry.id != -1" name="school" size="xs" />
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-expansion-item
        v-if="middleEntries.length"
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
    </q-list>
  </div>
</template>

<script>
import { date } from "quasar";

export default {
  name: "ExpansionTimeline",
  props: {
    lift: Object
  },
  data() {
    return {
      showStations: false
    };
  },
  computed: {
    isDeparting() {
      return this.lift.departAt != "00:00:00";
    },

    timeToDepartOrArrive() {
      return (this.isDeparting
        ? this.lift.departAt
        : this.lift.arriveBy
      ).substr(0, 5);
    },

    courseStations() {
      var arr = [],
        start = this.lift.start,
        dest = this.lift.destination,
        startsAtSchool = this.lift.start.id != -1,
        username = this.$store.getters["auth/user"].name;
      arr.push({
        id: start.id,
        city: start.name,
        details: startsAtSchool
          ? this.getStationLabel(start.id, start.name)
          : username // when starts not at school, it starts at home adress of this user
      });

      if (this.lift.stations)
        this.lift.stations.forEach(station => {
          arr.push({
            id: -1, // cannot be a school
            city: station.city,
            passengerName: station.passengerName
          });
        });
      arr.push({
        city: dest.name,
        id: dest.id,
        details: startsAtSchool
          ? username
          : this.getStationLabel(dest.id, dest.name) // when starts at school, it ends at home adress of this user
      });

      return arr;
    },

    firstEntry() {
      return this.courseStations[0];
    },

    lastEntry() {
      var l = this.courseStations.length;
      if (!l) return null;
      else {
        return this.courseStations[l - 1];
      }
    },

    middleEntries() {
      var l = this.courseStations.length;
      if (l < 3) return [];
      else {
        var newEns = JSON.parse(JSON.stringify(this.courseStations));
        newEns.pop();
        newEns.shift();
        return newEns;
      }
    }
  },
  methods: {
    emit() {
      this.$emit("input", this.showStations);
    },

    getStationLabel(adressId, locationName) {
      // locationName can be a city name or the username
      switch (adressId) {
        case 1:
          return "Würfel";
        case 2:
          return "Alte DH";
        case 3:
          return "Kloster";
        default:
          return locationName;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>