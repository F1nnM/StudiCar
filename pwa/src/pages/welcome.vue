<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md" style="max-width: 600px">
      <br />
      <br />
      <div class="text-h4"></div>
      <hr />
      <br />
      Hi {{user.name}}! Schön, dass du hier bist! Bevor du loslegst, haben wir noch ein paar Informationen für dich:
      <br />
      <h3>Allgemeine Informationen</h3>
      <q-layout>
        <q-page-container>
          <q-page padding style="padding-top: 66px">
            <p
              v-for="n in 15"
              :key="n"
            >Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit nihil praesentium molestias a adipisci, dolore vitae odit, quidem consequatur optio voluptates asperiores pariatur eos numquam rerum delectus commodi perferendis voluptate?</p>

            <!-- place QPageSticky at end of page -->
            <q-page-sticky expand position="top">
              <q-toolbar class="bg-accent text-white">
                <q-avatar>
                  <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg" />
                </q-avatar>
                <q-toolbar-title>Page Title</q-toolbar-title>
              </q-toolbar>
            </q-page-sticky>
          </q-page>
        </q-page-container>
      </q-layout>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      user: {
        name: 'Irgendwer'
      }
    }
  }
}
</script>