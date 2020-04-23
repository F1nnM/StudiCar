<template>
  <div>
    <q-slide-item clickable="true" @click="liftClick" @left="onLeft" @right="onRight">
      <q-separator inset="item" />
      <template v-slot:left>
        <q-icon name="delete_outline" backgroundColor="red" />
      </template>
      <template v-slot:right>
        <q-icon name="delete_outline" />
      </template>

      <q-item tag="a" href="/#/chats/lift" @click="pageTrans = 'slide'" v-ripple>
        <q-item-section avatar>
          <q-avatar>
            <img :src="lift.url ? lift.url : 'https://cdn.quasar.dev/img/avatar2.jpg'" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label lines="1">{{lift.title}}</q-item-label>
          <q-item-label caption lines="3">
            <span class="text-weight-bold">{{lift.last.user}}</span>
            - {{lift.last.message}}
          </q-item-label>
        </q-item-section>

        <q-item-section side top>{{generate_time_string(lift.time)}}</q-item-section>
      </q-item>
    </q-slide-item>
  </div>
</template>

<script>

import { date } from 'quasar'

export default {
  name: 'chat_item',
  props: {
		lift:{
			type: Object,
			required: true,
				id: {
						type: Number,
						required: true
				},
				title:{
						type: String,
						required: true
				},
				time: {
						type: Number
				},
				last: {
					type: Object,
					user:{
							type: String,
							required: true
					},
					last_message: {
							type: String,
							required: true
					}
				}
			}
    },

    methods: {
			onLeft ({ reset }) {
				alert("SWIPED LEFT")
			
			this.finalize(reset)
			},

			onRight ({ reset }) {
				alert("SWIPED RIGHT")
			
			this.finalize(reset)
			},

			liftClick(item){
				this.$emit('pagetrans_zoom')
				this.$emit('pagetrans_y', Math.round(item.pageY/window.innerHeight*100))
				try{
					this.pageTrans = 'liftToChats'
				}
				catch(e){}
				//alert()
			},

			long_tab({e}){
				alert('LONG TAPPED')
			},

			generate_time_string(time){
				var display_text;
				time = new Date(time) // conversion to JS Date Object we can work with
				if(diff('minutes') <= 2){
					display_text = 'gerade eben'
				}
				else if(diff('minutes') <= 30){
					display_text = 'vor ' + diff('minutes') + ' Minuten'
				}
				else if(was_today()){ // checks whether message was still today
					display_text = date.formatDate(time, 'HH:mm')
				}
				else if(diff('days') == 1){ // else checks whether message was yesterday
					display_text = 'gestern um ' + date.formatDate(time, 'HH:mm')
				}
				else if(diff('days') == 2){ // else checks whether message was the day before yesterday
					display_text = 'vorgestern um ' + date.formatDate(time, 'HH:mm')
				}
				else if(diff('days') < 7){
					display_text = 'vor ' + diff('days') + ' Tagen'
				}
				else{
					display_text = 'Vor über einer Woche'
				}

				return display_text

				function diff(unit){
					console.warn(date.getDateDiff(new Date(), time, unit))
					return date.getDateDiff(new Date(), time, unit)
				}

				function was_today(){
					var this_day = date.isSameDate(time, new Date(), 'day')
					var this_month = date.isSameDate(time, new Date(), 'month')
					var this_year = date.isSameDate(time, new Date(), 'year')
					if(this_day && this_month && this_year){
						return true
					}
					else{
						return false
					}
				}
			},

			finalize (reset) {
			this.timer = setTimeout(() => {
							reset()
					}, 1000)
			}
	},
	data(){
		return{
			
		}
	}
    
  }

</script>
