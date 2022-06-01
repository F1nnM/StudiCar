<template>
  <div>
    <q-list dense style="border: 1px solid gray" class="rounded-borders">
      <q-item dense class="q-pr-none">
        <q-item-section avatar>
          <q-avatar size="xl">
            <img :src="requestingUserImageUrl" />
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <div class="text-subtitle1">{{ requestingUser.name }}</div>
          <div>{{ requestingUser.surname }}</div>
          <div class="row full-width">
            <div
              v-for="(p, index) in requestingUser.prefs"
              :key="index"
              :class="`col-auto q-px-xs text-${betterPrefColor(p)}`"
            >
              ●
            </div>
          </div>
        </q-item-section>
        <q-item-section side class="q-px-none">
          <div class="row justify-between">
            <q-btn
              outline
              @click="respondLiftRequest(false)"
              no-caps
              class="q-px-xs q-mr-md"
              color="grey-7"
              dense
            >
              <q-icon color="negative" name="thumb_down" />
            </q-btn>
            <q-btn
              outline
              @click="respondLiftRequest(true)"
              no-caps
              :disable="acceptDisabled"
              color="grey-7"
              class="q-px-xs"
              dense
            >
              <q-icon name="thumb_up" color="positive" />
            </q-btn>
          </div>
        </q-item-section>
      </q-item>

      <q-card>
        <q-card-section class="q-px-sm q-py-xs">
          <q-item dense>
            <q-item-section>
              <q-item-label>Kurzbeschreibung</q-item-label>
              <q-item-label caption>{{
                requestingUser.bio || '- keine Beschreibung eingestellt -'
              }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn
                label="zum Profil"
                outline
                :to="'benutzerinfo?userFbId=' + requestingUser.id"
                no-caps
                class="q-px-xs q-mt-md"
                color="dark"
                dense
              />
            </q-item-section>
          </q-item>
        </q-card-section>
      </q-card>
    </q-list>
  </div>
</template>

<script setup>
import { useAppStore } from 'src/stores/app';
import { buildGetRequestUrl, GET_USER_PROFILE_PIC } from 'src/utils/ApiAccess';
import { toRef } from 'vue';

let requestingUserImageUrl = null;

const props = defineProps({
  requestingUser: Object,
  liftId: Number,
  acceptDisabled: Boolean,
});

const requestingUser = toRef(props, 'requestingUser');

const appStore = useAppStore();

function betterPrefColor(color) {
  if (color == 'GREEN') return 'green-8';
  else if (color == 'YELLOW') return 'orange';
  else return color.toLowerCase();
}

async function respondLiftRequest(accepted) {
  let responseReason = '';
  if (accepted == false)
    responseReason = await new Promise((res, rej) => {
      $q.dialog({
        title: 'Ablehnen',
        message: `Willst du die Anfrage von ${requestingUser.value.name} ablehnen?`,
        ok: {
          color: 'negative',
        },
        cancel: {
          color: 'positive',
        },
        cancel: true,
        persistent: true,
      })
        .onOk((data) => {
          res(data);
        })
        .onCancel(rej);
    });
  else {
    var confirmationRequired =
      appStore.settings.askAgainWhenAppreciatingNewPassenger;
    if (confirmationRequired)
      new Promise((res, rej) => {
        $q.dialog({
          title: 'Zusagen',
          message: `${requestingUser.value.name} in die Fahrgemeinschaft mit aufnehmen?`,
          ok: {
            color: 'positive',
          },
          cancel: {
            color: 'white',
          },
          /* options: {
                  type: "checkbox",
                  model: [],
                  // inline: true
                  items: [{ label: "Nicht mehr fragen", value: true }]
                }, */
          cancel: true,
          persistent: true,
        })
          .onOk((data) => {
            // res(true) to disable asking again
            res(false);
          })
          .onCancel(rej);
      }).then((dontAskAnymore) => {
        appStore.setAskAgainWhenAppreciatingNewPassenger(!dontAskAnymore);
      });
  }
  $emit('respond', {
    liftId: liftId,
    user: {
      // on purpose NOT copying user obj, because it's containing much not needed data
      id: requestingUser.value.id,
      name: requestingUser.value.name,
      surname: requestingUser.value.surname,
    },
    accepted: accepted,
    reason: responseReason || null,
  });
}

onMounted(() => {
  buildGetRequestUrl(GET_USER_PROFILE_PIC, {
    fbid: requestingUser.value.id,
  }).then((url) => {
    requestingUserImageUrl = url;
  });
});
</script>

<style scoped lang="scss"></style>
