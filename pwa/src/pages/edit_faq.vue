<template>
  <q-page class="q-pa-md">
    <div>
      <p class="text-h5">FAQ bearbeiten</p>

      <q-expansion-item icon="search" label="Liste filtern">
        <q-card>
          <q-card-section>
            <q-select
              rounded
              outlined
              v-model="filter.visibility"
              transition-show="jump-up"
              transition-hide="jump-down"
              :options="filterOptions"
              map-options
              label="nach Sichtbarkeit filtern"
            >
              <template v-slot:prepend>
                <q-icon name="filter_list" size="sm" />
              </template>
            </q-select>
            <q-checkbox
              rounded
              outlined
              v-model="filter.notAnswered"
              label="nur unbeantwortete Fragen anzeigen"
            >
              <template v-slot:prepend>
                <q-icon name="done" size="sm" />
              </template>
            </q-checkbox>
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <q-tabs
        v-model="catTab"
        dense
        active-color="primary"
        indicator-color="primary"
        align="justify"
      >
        <q-tab
          v-for="cat in Object.keys(faq)"
          :key="cat"
          :name="cat"
          :label="cat"
        />
      </q-tabs>

      <q-tab-panels v-model="catTab" animated>
        <q-tab-panel :name="catTab">
          <q-list
            v-for="q in getCurrentList"
            class="q-pt-sm q-mb-none"
            :key="q.id"
          >
            <q-slide-item
              @right="showHideQuestion(q.id, q.isPublic)"
              class="q-pa-none"
              right-color="white"
            >
              <template v-slot:right>
                <div class="row items-center text-black">
                  {{ q.isPublic ? 'Verstecken' : 'Veröffentlichen' }}
                </div>
              </template>
              <div>
                <p>{{ q.question }}</p>

                <q-expansion-item
                  dense
                  group="accord"
                  class="q-mb-sm"
                  expand-separator
                >
                  <template v-slot:header>
                    <q-item-section avatar>
                      <q-icon
                        :name="q.answer ? 'done' : 'help_outline'"
                        size="sm"
                        :color="q.answer ? 'black' : 'red'"
                      />
                    </q-item-section>

                    <q-item-section caption>{{ q.askedBy }}</q-item-section>

                    <q-item-section side>
                      <div>
                        <q-icon v-if="q.isPublic" name="visibility" size="sm" />
                      </div>
                    </q-item-section>
                  </template>
                  <q-card>
                    <q-card-section class="q-pb-none q-pl-md">
                      <div v-if="q.answer">
                        {{ q.answer }}
                        <small>
                          <q-item class="text-right">
                            <q-item-section>
                              <q-item-label caption>
                                letzte Änderung von {{ q.answeredBy }}
                                <br />
                                ({{ formatDateForLastChange(q.lastChange) }})
                              </q-item-label>
                            </q-item-section>
                          </q-item>
                        </small>
                      </div>
                      <div v-else>
                        <q-form @submit="updateQuestion(q.id)">
                          <q-input
                            v-model="updatedQuestion.answer"
                            label="Schreibe eine Antwort"
                            lazy-rules
                            :rules="[
                              (val) =>
                                (val && val.length > 0) ||
                                'Du musst wenn dann schon was schreiben',
                            ]"
                          >
                            <template v-slot:before>
                              <q-btn
                                rounded
                                @click="
                                  updatedQuestion.instantPublish =
                                    !updatedQuestion.instantPublish
                                "
                                :icon="
                                  updatedQuestion.instantPublish
                                    ? 'visibility'
                                    : 'visibility_off'
                                "
                                size="md"
                                :flat="updatedQuestion.instantPublish"
                              />
                            </template>
                          </q-input>
                          <p
                            class="text-red"
                            v-if="updatedQuestion.instantPublish"
                          >
                            Frage wird direkt veröffentlicht, bitte schreib was
                            Gescheites!
                          </p>
                          <br />

                          <q-btn type="submit" label="Aktualisieren" />
                        </q-form>
                      </div>
                    </q-card-section>
                  </q-card>
                </q-expansion-item>
              </div>
            </q-slide-item>

            <q-separator spaced />
          </q-list>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted } from 'vue';

const filter = ref({
  visibility: {
    label: 'Alle anzeigen',
    value: 'all',
  }, // show all questions by default
  notAnswered: true, // show only already answered questions by default
});
const catTab = ref('bedienung');
const updatedQuestion = ref({
  answer: '',
  instantPublish: false,
});
const faq = ref({
  bedienung: [],
  sonstiges: [],
});
const filterOptions = ref([
  {
    label: 'Nur bereits veröffentlichte',
    value: 'published',
  },
  {
    label: 'Nur nicht öffentliche',
    value: 'private',
  },
  {
    label: 'Alle anzeigen',
    value: 'all',
  },
]);

const getCurrentList = computed(() => {
  return faq[catTab.value].value.filter((e) => {
    var ok1 = () => {
      switch (filter.value.visibility.value) {
        case 'all':
          return true;
          break;
        case 'published':
          return e.isPublic;
          break;
        case 'private':
          return !e.isPublic;
          break;
      }
    };
    var ok2 = () => {
      if (filter.value.notAnswered) return !e.answer;
      return true;
    };

    return ok1() && ok2();
  });
});

function formatDateForLastChange(dateObj) {
  return date.formatDate(dateObj, 'DD.MM., H:mm') + ' Uhr';
}
function showHideQuestion(id, isPublic) {
  api.sendApiRequest(
    api.SQL_UPDATE_FAQ_QUESTION,
    {
      data: {
        newValue: !isPublic,
        id: id,
      },
      mode: 2, // special mode, just invert public value
    },
    () => {
      faq[catTab.value].value.map((el) => {
        if (el.id != id) return el;
        else
          return Object.assign(el, {
            // just merging the new and the old object (and additional changing time to current)
            isPublic: !isPublic,
            lastChange: Date.now(),
          });
      });
    },
    (err) => {
      alert(err);
    }
  );
}
function updateQuestion(id) {
  api.sendApiRequest(
    api.SQL_UPDATE_FAQ_QUESTION,
    {
      data: {
        id: id,
        answer: updatedQuestion.value.answer,
        instantPublish: updatedQuestion.value.instantPublish,
        orgaId: 1,
      },
      mode: 1, // normal mode, just update question
    },
    (data) => {
      var index = faq[catTab.value].value.map((el) => {
        if (el.id != id) return el;
        else
          return Object.assign(el, {
            // just merging the new and the old object (and additional changing time to current)
            answer: updatedQuestion.value.answer,
            isPublic: updatedQuestion.value.instantPublish,
            orgaId: 1,
            lastChange: Date.now(),
          });
      });
    }
  );
}

onMounted(() => {
  api.sendApiRequest(
    api.SQL_GET_ALL_FAQ,
    {},
    (faq_) => {
      //everything fine
      faq = faq_;
    },
    (err) => {
      alert(err);
    }
  );
});
</script>
