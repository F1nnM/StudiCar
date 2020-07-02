<template>
  <q-card class="row items-stretch">
    <div id="map" class="col-grow row"></div>
    <div class="col column q-pa-sm">
      <div class="row">
        <div class="col">
          <span>
            {{lift.city}}
            <small>({{lift.distance}}km entfernt)</small>
          </span>
        </div>
        <div class="col-auto">
          <span>{{lift.seats_occupied}} / {{lift.seats_offered}}</span>
          <q-icon id="seats" name="airline_seat_recline_normal" />
        </div>
      </div>
      <div v-if="lift.day_pattern" class="row q-pt-sm">
        <div
          v-for="(values, day) in lift.day_pattern"
          :key="day"
          class="drive_indicator"
          :class="'drive_indicator_'+(values[0]+values[1])"
          :title="day"
        >
          <q-tooltip anchor="top middle" self="bottom middle">{{day}}</q-tooltip>
          <q-icon name="unfold_more" v-if="values[0] && values[1]" />
          <q-icon name="arrow_upward" v-else-if="values[0]" />
          <q-icon name="arrow_downward" v-else-if="values[1]" />
          <q-icon name="close" v-else />
        </div>
      </div>
      <div v-else-if="date_single_drive[0]==date_single_drive[1]" class="row q-pt-sm">
        <div class="drive_indicator drive_indicator_2">
          <q-icon name="unfold_more" />
        </div>
        <span class="vertical_middle">{{date_single_drive[0]}}</span>
      </div>
      <div v-else class="row q-pt-sm">
        <div class="drive_indicator drive_indicator_1" v-if="date_single_drive[0]">
          <q-icon name="arrow_upward" />
        </div>
        <span class="vertical_middle" v-if="date_single_drive[0]">{{date_single_drive[0]}}</span>
        <div class="drive_indicator drive_indicator_1" v-if="date_single_drive[1]">
          <q-icon name="arrow_downward" />
        </div>
        <span class="vertical_middle" v-if="date_single_drive[1]">{{date_single_drive[1]}}</span>
      </div>
      <div class="row q-pt-sm">
        <div class="col-4">Redseligkeit</div>
        <div :class="'col-2 text-' + betterPrefColor(lift.driver.prefs.talk)">●</div>
        <div class="col-4">... am Morgen</div>
        <div :class="'col-2 text-' + betterPrefColor(lift.driver.prefs.talkMorning)">●</div>
        <div class="col-4">Rauchen</div>
        <div :class="'col-2 text-' + betterPrefColor(lift.driver.prefs.smoking)">●</div>
        <div class="col-4">Musik</div>
        <div :class="'col-2 text-' + betterPrefColor(lift.driver.prefs.music)">●</div>
      </div>
      <div class="row self-end">
        <span>
          Angeboten von
          <a v-bind:href="'#/benutzerinfo?'+lift.driver.fbid">{{lift.driver.name}}</a>
        </span>
      </div>
    </div>
  </q-card>
</template>

<script>
import { date } from 'quasar'
export default {
  name: 'LiftOffer',
  props: ['lift'],
  data() {
    return {
    }
  },
  computed: {
    date_single_drive() {
      if (!this.lift)
        return ""
      if (!this.lift.next_drive)
        return ""
      return [
        this.lift.next_drive[0] ? date.formatDate(this.lift.next_drive[0], 'DD. MM. YY') : null,
        this.lift.next_drive[1] ? date.formatDate(this.lift.next_drive[1], 'DD. MM. YY') : null
      ]
    }
  },
  methods:{
    betterPrefColor(color){
      if(color == 'GREEN') return 'green-8'
      else if(color == 'YELLOW') return 'orange'
      else return color.toLowerCase()
    }
  }
}
</script>

<style scoped>
#map {
  max-width: 200px;
  flex-basis: 15vw;
  overflow: hidden;
  position: relative;
  background-image: url("~assets/loremmap.png");
  background-size: cover;
  background-position: center;
}
#mapImg {
  position: absolute;
  transform: translate(-50%, -50%);
  left: 50%;
  top: 50%;
  /*max-width: 100%;*/
  min-height: 100%;
}
.drive_indicator {
  width: 30px;
  height: 30px;
  margin: 4px;
  border-radius: 100%;
  background-color: #888;
  text-align: center;
  line-height: 30px;
  font-size: larger;
}
.drive_indicator_0 {
  background-color: #ff000080;
}
.drive_indicator_1 {
  background-color: #ffa60080;
}
.drive_indicator_2 {
  background-color: #00ff0080;
}
#seats {
  font-size: larger;
}
.vertical_middle {
  line-height: 38px;
}
</style>