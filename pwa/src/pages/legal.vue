<template>
  <div class="q-ma-md">
    <q-btn @click="getContent" label="reload" icon="reload" />

    <div class="q-mt-xl">
      <div v-show="downloading == 1">
        <q-card-section>
          <p>Inhalt wird geladen, bitte hab noch einen Moment Geduld...</p>

          <q-linear-progress indeterminate color="primary" class="q-mt-sm" />
        </q-card-section>
      </div>
      <!-- <q-card v-show="downloading == 2">
        <q-card-section>
          <p>
            <q-icon name="check" size="md" color="primary" />Success text
          </p>
        </q-card-section>
      </q-card>-->
      <q-card v-show="downloading == -1">
        <q-card-section>
          <p>
            <q-icon name="error_outline" size="md" color="negative" />Beim Download ist ein Fehler aufgetreten. Wenn das Problem öfter auftritt, dann
            <a
              href="#/contact"
            >schreib uns</a> bitte.
          </p>
        </q-card-section>
      </q-card>
    </div>
    <div id="anchor">
      <!-- here goes the content after downloading -->
    </div>
  </div>
</template>

<script>
import { sendApiRequest, GET_LEGAL } from "../ApiAccess";

export default {
  name: 'Contact',
  mounted(){
			this.$store.state.pageName = 'Rechtliches'
			this.getContent()
  },
  data(){
      return {
					downloading: 1, // 0 means not downloading, 1 means downloading, 2 means success and -1 means error
					legalText: null,
					started: false,
					converter: null
      }
	},
	methods: {
		getContent(){
			this.started = true
			this.downloading = 1
      sendApiRequest(GET_LEGAL, {}, html => {
        if(!html) alert('notiing')
        document.getElementById('anchor').innerHTML = html
        this.downloading = 2
			}, err => {
				this.downloading = -1
			})
		}
	}
	
}
</script>
