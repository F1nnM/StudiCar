<template>
  <div>
    <q-img v-if="true" :src="randomImage" style="height: 35vh;">
      <div class="row full-width q-pa-md">
        <div class="text-h6 col-10 text-weight-light">{{greeting.full}}</div>
        <q-icon size="sm" class="col-2" :name="greetingIcon" />
      </div>
      <div class="full-width absolute-bottom-left text-caption">{{quotation}}</div>
    </q-img>
  </div>
</template>

<script>

const Parser = require('rss-parser');
const parser = new Parser();

export default {
	name: 'drawerWelcomeImage',
	props: {
			timeText: {
					type: String,
					required: true
			}
	},


	computed: {
		randomImage(){

		if(this.$store.getters["auth/user"].dataSaver){
			switch(this.timeText){
				case 'Guten Morgen':
				img = 'morning/sunrise'
				break
				case 'Willkommen':
					img = 'day/sun'
				break
				case 'Guten Abend':
					img = 'day/moon'
				break
				default:
					error = true
						
			}
			if(error){
				return require('../assets/sad.svg')
			}
			return require('../assets/drawer_images/' + img + '.svg')
		}

		var morningMax = 9
		var dayMax = 15
		var eveningMax = 14
		var error = false

		var img

		switch(this.timeText){
				case 'Guten Morgen':
				img = 'morning/' + Math.floor(Math.random() * morningMax)
				break
				case 'Willkommen':
					img = 'day/' + Math.floor(Math.random() * dayMax)
				break
				case 'Guten Abend':
					img = 'evening/' + Math.floor(Math.random() * eveningMax)
				break
				default:
					error = true
						
			}
			if(error){
				return require('../assets/sad.svg')
			}
			return require('../assets/drawer_images/' + img + '.jpg')
		},

		greeting(){
			return {
				full: this.timeText + ', ' + this.$store.getters['auth/user'].name.split(' ')[0],
				time: this.timeText
			}
		},

		greetingIcon(){
			switch(this.timeText){
					case 'Guten Abend':
					return 'nights_stay'
					break
					case 'Willkommen':
					return 'report_problem'
					break
					case 'Guten Morgen': 
					return 'wb_sunny'
					break
					default:
					return 'brightness_7'
			}
		},

		quotation(){
			return 'Hier wird Ihr geistreiches Zitat oder ein Newsletter vom Postillon stehen'
		}
	},
	methods: {
		randomArrayItem(array){
			return array[Math.floor(Math.random() * array.length)]
		}
	}

}
</script>

<style lang="scss" scoped>
</style>