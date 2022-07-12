<template>
  <div class="q-ma-md">
    <div v-if="!supportData">
      <div style="height: 40vh" class="text-center column justify-center">
        <q-circular-progress
          show-value
          indeterminate
          size="15vw"
          :thickness="0.05"
          :value="100"
          color="primary"
          class="q-ma-md full-width"
        >
          <q-icon name="contact_support" color="dark" size="md" />
        </q-circular-progress>
        <span class="text-subtitle1">Daten werden geladen</span>
      </div>
    </div>
    <div v-else>
      <q-tabs
        v-model="tab"
        dense
        toggle-color="primary"
        color="white"
        inline-label
        no-caps
        text-color="primary"
      >
        <q-tab
          v-for="item in [
            { label: 'FAQ', value: 'faq', icon: 'playlist_add_check' },
            { label: 'Frage', value: 'question', icon: 'help' },
            { label: 'Tutorials', value: 'tutorials', icon: 'slideshow' },
          ]"
          :key="item.value"
          :label="item.label"
          :name="item.value"
          :icon="item.icon"
        />
      </q-tabs>
      <q-tab-panels
        v-model="tab"
        animated
        transition-prev="jump-right"
        transition-next="jump-left"
      >
        <q-tab-panel name="faq">
          <q-expansion-item dense class="q-my-md">
            <template v-slot:header>
              <q-item dense class="q-px-none">
                <q-item-section class="text-h5">Häufige Fragen</q-item-section>
                <q-item-section side>
                  <q-icon name="help_outline" size="sm" />
                </q-item-section>
              </q-item>
            </template>
            <q-card>
              <q-card-section class="text-caption"
                >Hier findest du alle Fragen beantwortet, die häufig gestellt
                wurden.</q-card-section
              >
            </q-card>
          </q-expansion-item>
          <div v-if="supportData.faq.length">
            <q-expansion-item
              style="border-radius: 30px"
              class="bg-red-1 overflow-hidden q-mb-sm"
              v-for="q in supportData.faq"
              :key="q.id"
              expand-separator
              :icon="q.icon"
              :label="q.question"
              :caption="q.category"
              :ref="'answer' + q.id"
            >
              <q-card class="bg-red-1 q-pb-none">
                <q-card-section class="q-pb-none q-pl-md">
                  {{ q.answer }}
                  <small>
                    <q-expansion-item
                      dense
                      expand-separator
                      dense-toggle
                      class="text-right full-width"
                    >
                      <template v-slot:header>
                        <q-item class="text-right full-width">
                          <q-item-section>
                            <q-item-label caption>
                              Antwort von {{ q.answeredBy.name }}
                              <small>({{ q.answeredBy.function }})</small>
                            </q-item-label>
                          </q-item-section>
                        </q-item>
                      </template>
                      <q-item-label caption class="text-right q-pb-sm">
                        <q-btn
                          :to="'/das-team?orgaId=' + q.answeredBy.id"
                          dense
                          outline
                          class="q-px-sm"
                          no-caps
                          label="Wer ist das?"
                        />
                      </q-item-label>
                    </q-expansion-item>
                  </small>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </div>
          <div v-else>- im Moment ist hier noch nichts zu sehen -</div>
        </q-tab-panel>
        <q-tab-panel name="question">
          <q-expansion-item dense class="q-my-md q-px-none">
            <template v-slot:header>
              <q-item dense>
                <q-item-section>
                  <div class="text-h5">Eine Frage stellen</div>
                </q-item-section>
                <q-item-section side>
                  <q-icon name="help_outline" size="sm" />
                </q-item-section>
              </q-item>
            </template>
            <q-card>
              <q-card-section class="text-caption"
                >Wenn du deine Frage in den FAQ nicht gefunden hast, kannst du
                hier selber fragen.</q-card-section
              >
            </q-card>
          </q-expansion-item>
          <div v-if="sendProgress == 1">
            <q-card-section>
              <p>
                Deine Anfrage wird hochgeladen, bitte hab einen Moment Geduld
              </p>

              <q-linear-progress
                indeterminate
                color="primary"
                class="q-mt-sm"
              />
            </q-card-section>
          </div>
          <q-card v-else-if="sendProgress == -1">
            <q-card-section>
              <p>
                <q-icon name="error_outline" size="md" color="negative" />Beim
                Laden ist ein Fehler aufgetreten. Wenn das Problem öfter
                auftritt, dann <a href="#/support">schreib uns</a> bitte.
              </p>
            </q-card-section>
          </q-card>
          <q-card v-else-if="sendProgress == 2">
            <q-card-section>
              <p>
                <q-icon name="done" size="md" color="primary" />Wir haben deine
                Anfrage ins System aufgenommen. Die Antwort kriegst du dann per
                Mitteilung.
              </p>
            </q-card-section>
          </q-card>
          <q-form v-else @submit="sendQuestion" class="q-gutter-md">
            <q-input
              v-model="question"
              autogrow
              label="Frage stellen"
              hint="Versuche, deine Frage kurz zu halten"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) ||
                  'Auf keine Frage können wir auch keine Antwort geben',
              ]"
            />

            <q-select
              :rules="[(val) => val || 'Bitte gib eine Kategorie an']"
              transition-show="jump-up"
              transition-hide="jump-up"
              v-model="category"
              :options="categories"
              label="Kategorie"
            >
              <template v-slot:hint
                >Versuche, dein Anliegen einzuordnen</template
              >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                  <q-item-section avatar>
                    <q-icon :name="scope.opt.icon" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label v-html="scope.opt.label" />
                    <q-item-label caption>{{
                      scope.opt.description
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <q-toggle
              v-model="publicAccepted"
              label="Ich bin damit einverstanden, dass meine Anfrage ohne Rücksprache mit mir in den FAQs veröffentlicht werden darf. Mein Name wird dabei nicht genannt."
            />

            <div>
              <q-btn
                :disable="!publicAccepted"
                label="Anfrage stellen"
                type="submit"
                color="primary"
              />
            </div>
          </q-form>
        </q-tab-panel>
        <q-tab-panel name="tutorials">
          <q-list>
            <q-expansion-item dense class="q-my-md">
              <template v-slot:header>
                <q-item dense class="q-px-none">
                  <q-item-section class="text-h5"
                    >Video-Tutorials</q-item-section
                  >
                  <q-item-section side>
                    <q-icon name="help_outline" size="sm" />
                  </q-item-section>
                </q-item>
              </template>
              <q-card>
                <q-card-section class="text-caption"
                  >Wir haben zu allen wichtigen Bereichen Video-Tutorials
                  erstellt.</q-card-section
                >
              </q-card>
            </q-expansion-item>
            <div
              class="rounded-borders"
              v-for="v in supportData.tutorials"
              :key="v.id"
            >
              <q-expansion-item style="width: 80vw">
                <template v-slot:header class="text-subtitle1 full-width">{{
                  v.title
                }}</template>
                <q-card>
                  <q-item v-if="v.caption" class="q-pb-md">
                    <q-item-section avatar>
                      <q-icon name="info" size="sm" outline />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label caption>{{ v.caption }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-video
                    :ratio="v.ratio || 16 / 9"
                    :src="v.url"
                    class="q-mb-lg rounded-borders"
                  />
                </q-card>
              </q-expansion-item>
              <q-separator />
            </div>
          </q-list>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from 'src/stores/app';
import { useUserStore } from 'src/stores/user';

const appStore = useAppStore();
const userStore = useUserStore();

let tab = 'faq';
let publicAccepted = false;
let question = '';
let category = null;
let categories = [
  {
    label: 'Bedienung',
    icon: 'smartphone',
    description: 'Alles, was mit der Benutzeroberfläche zu tun hat',
  },
  {
    label: 'Sonstiges',
    icon: 'help_outline',
    description: 'Wenn du partout nicht einordnen kannst',
  },
];
let supportData = appStore.supportData;
let sendProgress = 0; // same procedure as above
let wantedId = null;

watch(tab, (newValue) => {
  switch (newValue) {
    case 'faq':
      loadFAQ();
      break;
  }
});

function refreshContent(res) {
  loadFAQ(res);
}

function sendQuestion() {
  sendProgress = 1;
  sendApiRequest(
    SQL_ADD_QUESTION,
    {
      question: question,
      category: category.label,
      fbid: userStore.user.uid,
    },
    (_) => {
      sendProgress = 2;
    },
    (_) => {
      sendProgress = -1;
    }
  );
}
function loadFAQ(res) {
  if (tab == 'faq' && (!appStore.supportData || res)) {
    // when res give, then force and use it as resolver
    sendApiRequest(
      SQL_GET_SUPPORT_DATA,
      {},
      (data) => {
        data.faq.forEach((item) => {
          item.icon = categories.find((el) => {
            return el.label == item.category;
          }).icon;
        });

        var newFAQ = data.faq.sort((a, b) => {
          var categoryA = a.category;
          var categoryB = b.category;
          var qA = a.question;
          var qB = b.question;

          if (categoryA == categoryB) {
            return qA < qB ? -1 : qA > qB ? 1 : 0;
          } else {
            return categoryA < categoryB ? -1 : 1;
          }
        });
        supportData = {
          tutorials: data.tutorials,
          faq: newFAQ,
        };
        appStore.setSupportData(supportData);

        var arr = document.location.href.split('faq-id=');
        if (arr.length > 1) {
          tab = 'faq'; // just to be sure
          setTimeout((_) => {
            const vueRef = 'answer' + parseInt(arr[1]),
              vueEl = $refs[vueRef][0];
            setTimeout((_) => {
              vueEl.$el.scrollIntoView();
              vueEl.$el.classList.add('mark-item');
              vueEl.show();
            }, 100);
          }, 100); // wait 100ms until rendered
        }
        res();
      },
      (error) => {}
    );
  }
}

onMounted(() => {
  if (tab == 'faq') loadFAQ();

  appStore.setPage({
    name: 'Support',
    onlyInNav: true,
  });
});
</script>

<style scoped lang="scss">
.tab-border {
  border: 1px solid $primary;
}
</style>
