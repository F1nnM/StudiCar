<template>
  <div class="q-ma-md">
    <div v-if="!faq">
      <div style="height: 40vh" class="text-center column justify-center">
        <q-circular-progress
          show-value
          :indeterminate="!notFound"
          size="15vw"
          :thickness="0.05"
          :value="100"
          color="primary"
          class="q-ma-md full-width"
        >
          <q-icon name="contact_support" color="dark" size="md" />
        </q-circular-progress>
        <span class="text-subtitle1">FAQ werden geladen</span>
      </div>
    </div>
    <q-tabs
      v-else
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
          {label: 'FAQ', value: 'faq', icon: 'playlist_add_check'},
          {label: 'Frage', value: 'question', icon: 'help'},
          {label: 'Tutorials', value: 'tutorials', icon: 'slideshow'}
        ]"
        :key="item.value"
        :label="item.label"
        :name="item.value"
        :icon="item.icon"
      />
    </q-tabs>
    <q-tab-panels v-model="tab" animated transition-prev="jump-right" transition-next="jump-left">
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
            <q-card-section
              class="text-caption"
            >Hier findest du alle Fragen beantwortet, die häufig gestellt wurden.</q-card-section>
          </q-card>
        </q-expansion-item>
        <div v-if="faq.length">
          <q-expansion-item
            style="border-radius: 30px"
            class="bg-red-1 overflow-hidden q-mb-sm"
            v-for="q in faq"
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
                          <q-item-label caption>Antwort von {{ q.answeredBy.name }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </template>
                    <q-item-label caption class="text-right q-pb-sm">
                      <p>({{ q.answeredBy.function }})</p>
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
            <q-card-section
              class="text-caption"
            >Wenn du deine Frage in den FAQ nicht gefunden hast, kannst du hier selber fragen.</q-card-section>
          </q-card>
        </q-expansion-item>
        <div v-if="sendProgress == 1">
          <q-card-section>
            <p>Deine Anfrage wird hochgeladen, bitte hab einen Moment Geduld</p>

            <q-linear-progress indeterminate color="primary" class="q-mt-sm" />
          </q-card-section>
        </div>
        <q-card v-else-if="sendProgress == -1">
          <q-card-section>
            <p>
              <q-icon name="error_outline" size="md" color="negative" />Beim Laden ist ein Fehler aufgetreten. Wenn das Problem öfter auftritt, dann
              <a
                href="#/support"
              >schreib uns</a> bitte.
            </p>
          </q-card-section>
        </q-card>
        <q-card v-else-if="sendProgress == 2">
          <q-card-section>
            <p>
              <q-icon name="done" size="md" color="primary" />Wir haben deine Anfrage ins System aufgenommen. Die Antwort kriegst du dann per Mitteilung.
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
            :rules="[ val => val && val.length > 0 || 'Auf keine Frage können wir auch keine Antwort geben']"
          />

          <q-select
            :rules="[ val => val || 'Bitte gib eine Kategorie an']"
            transition-show="jump-up"
            transition-hide="jump-up"
            v-model="category"
            :options="categories"
            label="Kategorie"
          >
            <template v-slot:hint>Versuche, dein Anliegen einzuordnen</template>
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                <q-item-section avatar>
                  <q-icon :name="scope.opt.icon" />
                </q-item-section>
                <q-item-section>
                  <q-item-label v-html="scope.opt.label" />
                  <q-item-label caption>{{ scope.opt.description }}</q-item-label>
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
        <q-expansion-item dense class="q-my-md">
          <template v-slot:header>
            <q-item dense class="q-px-none">
              <q-item-section class="text-h5">Video-Tutorials</q-item-section>
              <q-item-section side>
                <q-icon name="help_outline" size="sm" />
              </q-item-section>
            </q-item>
          </template>
          <q-card>
            <q-card-section
              class="text-caption"
            >Wir haben zu allen wichtigen Sachen Video-Tutorials erstellt.</q-card-section>
          </q-card>
        </q-expansion-item>
        <q-video
          v-for="v in [{
          src: 'https://www.youtube.com/embed/k3_tw44QsZQ?rel=0&d'
        },
        {
          src: 'https://www.youtube.com/embed/k3_tw44QsZQ?rel=0&e'
        },
        {
          src: 'https://www.youtube.com/embed/k3_tw44QsZQ?rel=0&d'
        }]"
          :key="v.src"
          :ratio="v.ratio || 16/9"
          :src="v.src"
          class="q-mb-lg rounded-borders"
        />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import { sendApiRequest, SQL_ADD_QUESTION, SQL_GET_FAQ } from "../ApiAccess";

export default {
  name: "Support",
  components: {},
  data() {
    return {
      tab: "faq",
      publicAccepted: false,
      FAQloading: 1,
      question: "",
      category: null,
      categories: [
        {
          label: "Bedienung",
          icon: "smartphone",
          description: "Alles, was mit der Benutzeroberfläche zu tun hat"
        },
        {
          label: "Sonstiges",
          icon: "help_outline",
          description: "Wenn du partout nicht einordnen kannst"
        }
      ],
      faqLoaded: 0, // as always: 0 is neutral, 1 is loading, 2 means success and -1 means error
      faq: this.$store.getters["getFAQ"],
      sendProgress: 0, // same procedure as above
      wantedId: null
    };
  },
  watch: {
    tab: function(newValue) {
      switch (newValue) {
        case "faq":
          this.loadFAQ();
          break;
      }
    }
  },
  methods: {
    sendQuestion() {
      this.sendProgress = 1;
      sendApiRequest(
        SQL_ADD_QUESTION,
        {
          question: this.question,
          category: this.category.label,
          fbid: this.$store.getters["auth/user"].uid
        },
        _ => {
          this.sendProgress = 2;
        },
        _ => {
          this.sendProgress = -1;
        }
      );
    },
    loadFAQ() {
      if (this.tab == "faq" && !this.$store.getters["getFAQ"].length) {
        this.FAQloading = 1;

        sendApiRequest(
          SQL_GET_FAQ,
          {},
          data => {
            data.faq.forEach(item => {
              item.icon = this.categories.find(el => {
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
            this.faq = newFAQ;
            this.$store.commit("setFAQ", newFAQ);

            const arr = document.location.href.split("faq-id=");
            if (arr.length > 0) {
              this.tab = "faq"; // just to be sure
              setTimeout(_ => {
                const vueRef = "answer" + parseInt(arr[1]),
                  vueEl = this.$refs[vueRef][0];
                setTimeout(_ => {
                  vueEl.$el.scrollIntoView();
                  vueEl.$el.classList.add("mark-item");
                  vueEl.show();
                }, 100);
              }, 100); // wait 100ms until rendered
            }
          },
          error => {}
        );
      } else {
      }
    }
  },
  mounted() {
    if (this.tab == "faq") this.loadFAQ();
    this.$store.commit("setPage", {
      name: "Support",
      onlyInNav: true
    });
  }
};
</script>

<style scoped lang="scss">
.tab-border {
  border: 1px solid $primary;
}
</style>