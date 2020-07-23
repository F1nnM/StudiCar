<template>
  <div>
    <q-drawer
      v-model="open"
      :width="300"
      :breakpoint="500"
      overlay
      side="right"
      bordered
      style="bg-gray-3"
      @hide="$emit('close')"
    >
      <div class="q-pa-md">
        <p class="text-h6">Info</p>
        <q-separator spaced />
        <p class="q-mt-md" v-show="loading == 1">
          Daten werden geladen
          <q-circular-progress indeterminate size="40px" color="primary" class="q-ma-md" />
        </p>
        <q-card v-show="loading == -1">
          <q-card-section>
            <p>
              <q-icon name="error_outline" size="md" color="negative" />Es ist ein Fehler aufgetreten. Wenn das Problem öfter auftritt, dann
              <a
                href="#/contact"
              >schreib uns</a> bitte.
            </p>
          </q-card-section>
        </q-card>
        <q-card flat bordered class="my-card bg-grey-1">
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-h6">{{lift.car.brand}} {{lift.car.model}}</div>
                <div class="text-subtitle2">{{lift.car.type}}</div>
                <extHR :color="lift.car.color" size="xs" />
              </div>

              <div class="col-auto">
                <q-btn color="grey-7" round flat icon="more_vert">
                  <q-menu cover auto-close>
                    <q-btn flat clickable @click="viewCar()">Modell online ansehen</q-btn>
                  </q-menu>
                </q-btn>
              </div>
            </div>
          </q-card-section>
          <q-card-section>{{lift.car.licensePlate}}</q-card-section>
          <q-separator />
        </q-card>
        <!-- <q-card class="my-card" flat bordered>
          <q-card-section horizontal>
            <q-card-section class="q-pt-xs">
              <div class="text-overline">Angeboten von</div>
              <div class="text-h5 q-mt-sm q-mb-xs">{{messages.nameOfUser}}</div>
              <div class="text-caption text-grey">Lorem</div>
            </q-card-section>

            <q-card-section class="col-5 flex flex-center">
              <q-img class="rounded-borders" src="https://cdn.quasar.dev/img/parallax2.jpg" />
            </q-card-section>
          </q-card-section>

          <q-separator />
        </q-card>-->
        <q-list bordered>
          <q-item-label header>
            <p>
              Mitfahrer
              <span class="text-caption float-right">
                {{lift.passengers.lenth}} / {{lift.seats}}
                <q-icon name="airline_seat_recline_normal" size="md" />belegt
              </span>
            </p>
          </q-item-label>
          <q-item v-for="item in lift.passengers" :key="item.userId">
            <q-item-section top avatar>
              <q-avatar>
                <img :src="getImageOfUser(item.userId)" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label>{{item.nameOfUser}}</q-item-label>
              <q-item-label caption>
                <div class="row">
                  <div class="col-3" v-for="pref in item.prefs" :key="pref.name">
                    <p :class="'text-' + pref.color.toLowerCase()">●</p>
                  </div>
                </div>
              </q-item-label>
            </q-item-section>

            <q-item-section side top>
              <q-icon name="directions_car" v-if="item.userId == user" size="sm" />
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-drawer>
  </div>
</template>


<script>

import { openURL } from 'quasar'
import { date } from 'quasar'
import extHR from 'components/extended_hr'
import { sendApiRequest, SQL_GET_LIFT_INFO } from '../ApiAccess'


export default {
  name: 'liftInfoDrawer',
  components: {
    extHR
  },
  data(){
    return {
			user: this.$store.getters['auth/user'].id,
			lift: {
				car: {
					brand: '',
					model: '',
					color: '',
					type: '',
					licensePlate: ''
				},
				passengers: [],
				seats: 0 // all "empty" data just to avoid errors when calling variables
			},
			loading: 0 // as always: 0 means not loading, 1 means in progress, 2 means success and -1 error.
    }
  },
  props: {
    open: {
      type: Boolean,
      required: true
    },
		liftId: {
      type: Number,
      required: true
    }
  },
  mounted(){
		this.loading = 1
		sendApiRequest(SQL_GET_LIFT_INFO, {
				id: this.liftId
		}, data => {
			this.lift = data
			this.loading = 2
		}, error => {
			this.loading = -1
		})
  },
  computed: {
    
	},
	watch: {
		open: _=>{
			alert('changed')
		}
	},
  methods: {
		getImageOfUser(id){
			return require('~assets/sad.svg')
		}
  }
}