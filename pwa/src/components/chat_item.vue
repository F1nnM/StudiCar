<template>
  <div>
    <q-slide-item clickable @left="onLeft" @right="onRight">
      <q-separator inset="item" />
      <template v-slot:left>
        <q-icon name="delete_outline" backgroundColor="red" />
      </template>
      <template v-slot:right>
        <q-icon name="delete_outline" />
      </template>

      <q-item clickable tag="a" href="/#/chats/lift" v-ripple>
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

        <q-item-section side top>{{lift.time}}</q-item-section>
      </q-item>
    </q-slide-item>
  </div>
</template>

<script>

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
						type: String
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

			lift_click(item){
				this.page_trans = 'expand'
			},

			long_tab({e}){
				alert("LONG")
			},

			finalize (reset) {
			this.timer = setTimeout(() => {
							reset()
					}, 1000)
			}
	},
	data(){
		return{
			page_trans: 'expand'
		}
	}
    
  }

</script>
