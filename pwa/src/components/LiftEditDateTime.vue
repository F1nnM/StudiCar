<template>
  <div>
    <q-list>
      <q-item>
        <q-item-section avatar>
          <q-item-label header>Tag</q-item-label>
        </q-item-section>

        <q-item-section>
          <q-btn-toggle
            :modelValue="modelValue.dateTab"
            @update:modelValue="dateTabChanged($event)"
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
                if (modelValue.dateTab == 'fix') $refs.datepicker.toggle();
                else $refs.datepicker.showPopup();
              }
            "
            borderless
            readonly
            :modelValue="
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
                    :modelValue="modelValue.date"
                    @update:modelValue="
                      dateChanged($event);
                      $refs.datepicker.hide();
                    "
                    :events="[todayString]"
                    :options="dateOptions"
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
                  :modelValue="modelValue.date"
                  @update:modelValue="dateChanged($event)"
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
            :modelValue="modelValue.timeTab"
            @update:modelValue="timeTabChanged($event)"
            no-caps
            rounded
            unelevated
            :disable="false"
            class="q-ma-none q-mb-sm"
            outline
            toggle-color="primary"
            color="white"
            text-color="grey-5"
            :options="[
              { label: 'Ankunft um', value: 'arrive' },
              { label: 'Abfahrt um', value: 'depart' },
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
              :modelValue="modelValue.time || '- Zeit -'"
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
                      :modelValue="null"
                      @update:modelValue="timeChanged($event); $refs.timepicker.toggle()"
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

<script setup>
const emit = defineEmits(['update:modelValue']);
const props = defineProps({
  modelValue: Object,
});
const { modelValue } = toRefs(props);
import { date } from 'quasar';

const getWeekDayFromIndex = computed(() => {
  // getter for display while editing
  var day = getRepeatingDayOptions.value.find(
    (d) => d.value == modelValue.value.date
  );
  return day ? day.label : null;
});
const todayString = computed(() => {
  return date.formatDate(new Date(), 'YYYY/MM/DD');
});
const getRepeatingDayOptions = computed(() => {
  return [
    'Montag',
    'Dienstag',
    'Mittwoch',
    'Donnerstag',
    'Freitag',
    'Samstag',
  ].map((val, index) => ({
    label: val,
    value: index + 1,
  }));
});

function dateChanged($event) {
  const updated = {
    ...modelValue.value,
    date: $event,
  };
  emit('update:modelValue', updated);
}

function dateTabChanged($event) {
  const updated = {
    ...modelValue.value,
    dateTab: $event,
  };

  if ($event == 'weekly') updated.date = 1;
  // default on monday
  else updated.date = date.formatDate(new Date(), 'YYYY-MM-DD');
  
  emit('update:modelValue', updated);
}

function timeChanged($event) {
  const updated = {
    ...modelValue.value,
    time: $event,
  };
  emit('update:modelValue', updated);
}

function timeTabChanged($event) {
  const updated = {
    ...modelValue.value,
    timeTab: $event,
  };
  emit('update:modelValue', updated);
}


function dateOptions(d) {
  const limit = 30;

  var a = date.getDateDiff(d, new Date(), 'days');
  a = a < limit && a >= 0;
  return a;
}
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
