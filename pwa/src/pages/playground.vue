<template>
  <div class="q-pa-md">
    <q-layout view="lHh Lpr lFf" container style="height: 400px" class="shadow-2 rounded-borders">
      <q-header reveal elevated>
        <q-toolbar>
          <q-btn flat round dense icon="menu" @click="drawerLeft = !drawerLeft" />

          <q-toolbar-title>
            <strong>Quasar</strong> Framework
          </q-toolbar-title>

          <q-btn flat round dense icon="menu" @click="drawerRight = !drawerRight" />
        </q-toolbar>
      </q-header>

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
</template>

<script>
export default {
  data () {
    return {
      
    }
  }
}
</script>