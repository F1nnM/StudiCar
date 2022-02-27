<template>
  <div>
    <q-list>
      <q-item>
        <q-item-section avatar>
          <q-item-label header>Tag</q-item-label>
        </q-item-section>

        <q-item-section>
          <q-btn-toggle
            v-model="value.dateTab"
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
              { label: 'Wöchentlich', value: 'weekly' }
            ]"
          />
          <q-input
            clickable
            @click="
              _ => {
                if (this.value.dateTab == 'fix') $refs.datepicker.toggle();
                else $refs.datepicker.showPopup();
              }
            "
            borderless
            readonly
            :value="
              value.dateTab == 'fix'
                ? value.date || '- Datum -'
                : getWeekDayFromIndex
            "
          >
            <template v-slot:append>
              <q-btn
                icon="edit"
                color="grey-9"
                flat
                @click="
                  _ => {
                    if (value.dateTab == 'weekly') $refs.datepicker.showPopup();
                  }
                "
              >
                <q-menu
                  v-if="value.dateTab == 'fix'"
                  ref="datepicker"
                  transition-show="jump-down"
                  transition-hide="jump-up"
                >
                  <q-date
                    title="Tag auswählen"
                    :subtitle="`Maximal 30 Tage im Voraus`"
                    event-color="primary"
                    mask="YYYY-MM-DD"
                    v-model="value.date"
                    :events="[todayString]"
                    :options="dateOptions"
                    @input="$refs.datepicker.hide()"
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
                  v-model="value.date"
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
            v-model="value.timeTab"
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
              { label: 'Abfahrt um', value: departValue }
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
              @click="_ => $refs.timepicker.toggle()"
              readonly
              borderless
              square
              :value="value.time || '- Zeit -'"
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
                      v-model="value.time"
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
import ExtHR from "components/ExtendedHr";
import Tooltip from "components/Tooltip";
import { defineComponent } from "vue";

export default defineComponent({
  name: "LiftEditDateTime",
  components: {
    Tooltip
  },
  props: {
    value: Object
  },
  data() {
    return {};
  },
  watch: {
    open: function(val) {}
  },
  computed: {
    getWeekDayFromIndex() {
      // getter for display while editing
      var day = this.getRepeatingDayOptions.find(
        d => d.value == this.value.date
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
        "Samstag"
      ].map((val, index) => ({
        label: val,
        value: index + 1
      }));
    },

    isDirectionValueCorrect() {
      const l = this.value;
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
    }
  },
  methods: {
    emit(val) {
      this.$emit("input", val);
    },

    setDateTab() {
      var tab = this.value.dateTab;
      if (tab == "weekly") this.value.date = 1;
      // default on monday
      else this.value.date = date.formatDate(new Date(), "YYYY-MM-DD");
    },

    dateOptions(d) {
      const limit = 30;

      var a = date.getDateDiff(d, new Date(), "days");
      a = a < limit && a >= 0;
      return a;
    }
  }
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
