<template>
  <div>
    <q-list>
      <q-item>
        <q-item-section avatar>
          <q-item-label header>Tag</q-item-label>
        </q-item-section>

        <q-item-section>
          <q-btn-toggle
            v-bind:model-value="modelValue.dateTab"
            v-on:update:model-value="dateTabChanged($event)"
            @click="setDateTab"
            no-caps
            rounded
            unelevated
            outline
            toggle-color="primary"
            class="q-mb-xs"
            color="white"
            text-color="grey-5"
            :options="[
              { label: 'Einmalig', value: 'fix' },
              { label: 'Wöchentlich', value: 'weekly' },
            ]"
          />
          <q-input
            clickable
            @click="
              (_) => {
                if (this.modelValue.dateTab == 'fix') $refs.datepicker.toggle();
                else $refs.datepicker.showPopup();
              }
            "
            borderless
            readonly
            :model-value="
              modelValue.dateTab == 'fix'
                ? modelValue.date || '- Datum -'
                : getWeekDayFromIndex
            "
          >
            <template v-slot:append>
              <q-btn
                icon="edit"
                color="grey-9"
                flat
                @click="
                  (_) => {
                    if (modelValue.dateTab == 'weekly')
                      $refs.datepicker.showPopup();
                  }
                "
              >
                <q-menu
                  v-if="modelValue.dateTab == 'fix'"
                  ref="datepicker"
                  transition-show="jump-down"
                  transition-hide="jump-up"
                >
                  <q-date
                    title="Tag auswählen"
                    :subtitle="`Maximal 30 Tage im Voraus`"
                    event-color="primary"
                    mask="YYYY-MM-DD"
                    v-bind:model-value="modelValue.date"
                    v-on:update:model-value="dateChanged($event)"
                    :events="[todayString]"
                    :options="dateOptions"
                    @update:model-value="$refs.datepicker.hide()"
                  />
                </q-menu>
                <q-select
                  v-else
                  ref="datepicker"
                  class="hidden"
                  emit-value
                  label="Wochentag auswählen"
                  transition-show="jump-down"
                  transition-hide="jump-up"
                  v-bind:model-value="modelValue.date"
                  v-on:update:model-value="dateChanged($event)"
                  :options="getRepeatingDayOptions"
                />
              </q-btn>
            </template>
          </q-input>
        </q-item-section>
      </q-item>

      <q-separator spaced />

      <q-item>
        <q-item-section avatar>
          <q-item-label header>Zeit</q-item-label>
        </q-item-section>

        <q-item-section>
          <q-btn-toggle
            v-bind:model-value="modelValue.timeTab"
            v-on:update:model-value="dateChanged($event)"
            no-caps
            rounded
            unelevated
            :disable="false"
            class="q-ma-none q-mb-sm"
            outline
            toggle-color="primary"
            color="white"
            text-color="g rey-3"
            :options="[
              { label: 'Ankunft um', value: arriveValue },
              { label: 'Abfahrt um', value: departValue },
            ]"
          />
          <Tooltip rgba>
            Zu einer Fahrt gehört immer nur eine Zeit, nämlich die an der DHBW.
            Indem du Start und Ziel auswählst gibst du also auch ein, ob du die
            Abfahrts- oder Ankunftszeit eingibst.
          </Tooltip>
          <div>
            <q-input
              class="col-6"
              clickable
              @click="(_) => $refs.timepicker.toggle()"
              readonly
              borderless
              square
              :model-value="modelValue.time || '- Zeit -'"
            >
              <template v-slot:append>
                <q-btn icon="edit" color="grey-9" flat>
                  <q-menu
                    ref="timepicker"
                    transition-show="jump-down"
                    transition-hide="jump-up"
                  >
                    <q-time
                      format24h
                      v-bind:model-value="modelValue.time"
                      v-on:update:model-value="timeChanged($event)"
                      mask="HH:mm"
                      color="primary"
                    />
                  </q-menu>
                </q-btn>
              </template>
            </q-input>
          </div>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
import { date } from "quasar";
import Tooltip from "components/Tooltip";
import { defineComponent } from "vue";

export default defineComponent({
  name: "LiftEditDateTime",
  components: {
    Tooltip,
  },
  props: {
    modelValue: Object,
  },
  data() {
    return {
      localValue: this.modelValue,
    };
  },
  watch: {
    open: function (val) {},
  },
  computed: {
    getWeekDayFromIndex() {
      // getter for display while editing
      var day = this.getRepeatingDayOptions.find(
        (d) => d.value == this.modelValue.date
      );
      return day ? day.label : null;
    },

    todayString() {
      return date.formatDate(new Date(), "YYYY/MM/DD");
    },

    getRepeatingDayOptions() {
      return [
        "Montag",
        "Dienstag",
        "Mittwoch",
        "Donnerstag",
        "Freitag",
        "Samstag",
      ].map((val, index) => ({
        label: val,
        value: index + 1,
      }));
    },

    isDirectionValueCorrect() {
      const l = this.modelValue;
      return (
        (l.destination == "home" && l.timeTab == "depart") ||
        (l.destination == "school" && l.timeTab == "arrive")
      );
    },

    arriveValue() {
      return this.isDirectionValueCorrect ? "arrive" : "depart";
    },

    departValue() {
      return this.isDirectionValueCorrect ? "depart" : "arrive";
    },
  },
  methods: {
    dateChanged($event) {
      this.localValue.date = $event;
      this.$emit("input", this.localValue);
    },

    dateTabChanged($event) {
      this.localValue.dateTab = $event;
      this.$emit("input", this.localValue);
    },

    timeChanged($event) {
      this.localValue.time = $event;
      this.$emit("input", this.localValue);
    },

    timeTabChanged($event) {
      this.localValue.timeTab = $event;
      this.$emit("input", this.localValue);
    },

    emit(val) {
      this.$emit("input", val);
    },

    setDateTab() {
      var tab = this.modelValue.dateTab;
      if (tab == "weekly") this.localValue.date = 1;
      // default on monday
      else this.localValue.date = date.formatDate(new Date(), "YYYY-MM-DD");
      this.$emit("input", this.localValue);
    },

    dateOptions(d) {
      const limit = 30;

      var a = date.getDateDiff(d, new Date(), "days");
      a = a < limit && a >= 0;
      return a;
    },
  },
});
</script>

<style lang="scss" scoped>
.left-border-primary {
  border-left: 1px solid $primary;
  padding-left: 15px;
}

.shadow-primary {
  box-shadow: 0 0px 0px 0px $primary, 0 1px 0px $primary, 0 1px 6px $primary;
}
</style>
