<template>
  <div>
    <div style="position: fixed; top: 0; width: 100vw; z-index: 2900;">
      <div class="row">
        <q-toolbar class="col-10 bg-primary">
          <q-btn flat dense clickable @click="goBack()" :label="'‹ ' +  lift.id" />
          <q-toolbar-title class="text-white">Title</q-toolbar-title>
          <q-btn flat round dense icon="search" />
        </q-toolbar>
        <q-toolbar class="col-2 bg-white text-primary">
          <q-btn
            clickable
            @click="lift_info = !lift_info"
            icon="info"
            flat
            round
            dense
            class="q-mr-sm"
          />
        </q-toolbar>
      </div>
    </div>
    <q-drawer
      v-model="lift_info"
      :width="300"
      :breakpoint="500"
      overlay
      side="right"
      bordered
      style="bg-gray-3 z-index: 9999"
    >
      <div class="q-pa-md">
        <p class="text-h6">Info</p>
        <q-separator spaced />
        <q-card flat bordered class="my-card bg-grey-1">
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-h6">{{lift.car.brand}} {{lift.car.model}}</div>
                <div class="text-subtitle2">{{lift.car.type}} - {{lift.car.color}}</div>
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
          <q-card-section>{{lift.car.number_plate}}</q-card-section>
          <q-separator />
        </q-card>
        <q-card class="my-card" flat bordered>
          <q-card-section horizontal>
            <q-card-section class="q-pt-xs">
              <div class="text-overline">Angeboten von</div>
              <div class="text-h5 q-mt-sm q-mb-xs">{{lift.created_by}}</div>
              <div class="text-caption text-grey">Lorem</div>
            </q-card-section>

            <q-card-section class="col-5 flex flex-center">
              <q-img class="rounded-borders" src="https://cdn.quasar.dev/img/parallax2.jpg" />
            </q-card-section>
          </q-card-section>

          <q-separator />
        </q-card>
        <q-list bordered>
          <q-item-label header>
            <p>
              Mitfahrer
              <span
                class="text-caption float-right"
              >({{lift.users.length}} von {{lift.car.seats}} möglichen)</span>
            </p>
          </q-item-label>
          <q-item v-for="item in lift.users" :key="item.uid">
            <q-item-section top avatar>
              <q-avatar>
                <img src="https://cdn.quasar.dev/img/avatar.png" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label>{{item.uid}}</q-item-label>
              <q-item-label caption lines="2">
                Musterstraße 4
                <br />84846 Holzheim
              </q-item-label>
            </q-item-section>

            <q-item-section side top>PRef</q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-drawer>

    <div class="q-pa-md bg-white" v-touch-swipe.mouse.right="goBack">
      <div v-for="item in lift.messages" :key="item.timestamp">
        <q-chat-message
          class="custom-chat-label"
          v-if="checkDayBreak(item) != ''"
          :label="checkDayBreak(item)"
          style="margin-top: 40px;"
        />
        <q-chat-message
          :name="item.sender == user ? '' : '' + item.sender"
          :sent="item.sender == user"
          size="8"
          :text="item.content"
          :stamp="formatDate(item)"
          :bg-color="getColor(item.sender)"
        />
      </div>
    </div>
    <div class="row" style="z-index: 2900; position: fixed; bottom: 0; left: 0; width: 100vw;">
      <q-toolbar class="col-10 bg-grey-3">
        <q-btn flat dense icon="call_split" v-if="false"></q-btn>
        <q-toolbar-title>
          <template>
            <div style="max-width: 400px;">
              <q-form @submit="sendMessage" class="q-gutter-md">
                <q-input
                  class="custom-input"
                  v-model="messageText"
                  placeholder="Schreibe etwas..."
                  style="border-left: 1px solid black; padding-left: 10px;"
                />
              </q-form>
            </div>
          </template>
        </q-toolbar-title>
      </q-toolbar>
      <q-toolbar class="col-2 bg-white">
        <q-btn
          @click="sendMessage()"
          icon="arrow_forward_ios"
          flat
          :disabled="!messageText"
          round
          dense
          class="q-mr-sm bg-green-10 text-white"
          style="transition: all .1s"
        />
      </q-toolbar>
    </div>
  </div>
</template>

<script>

import {dom } from 'quasar'
const { ready } = dom

ready(function(){
  window.scrollTo(0,1000000)
})

import { openURL } from 'quasar'

import { date } from 'quasar'



export default {
  data(){
    return{
      lift_info: false,
      messageText: '',
      user: 61668646,
      lift: {
        id: 64165,
        created_by: 61668646,
        created_at: 1573618642779,
        users: [
          {
            uid: 61668646
          },
          {
            uid: 65163163
          },
          {
            uid: 611655814
          },
          {
            uid: 61565165
          }
            
        ],
        car: {
            brand: "Audi",
            model: "A3",
            color: "grün",
            type: "Limousine",
            number_plate: "B-HU-569",
            seats: 4
        },
        messages: [
            {
                sender: 61668646,
                timestamp: 1580778889523,
                content: ['Dies ist ein relativ kurzer Text, reicht für seinen Zweck aber völlig aus']
            },
            {
                sender: 65163163,
                timestamp: 1581778889523,
                content: ['Dies ist ein relativ kurzer Text, reicht für seinen Zweck aber völlig aus']
            },{
                sender: 61565165,
                timestamp: 1582778889523,
                content: ['Dies ist ein relativ kurzer Text, reicht für seinen Zweck aber völlig aus','Dies ist ein relativ kurzer Text, reicht für seinen Zweck aber völlig aus']
            },
            {
                sender: 61668646,
                timestamp: 1583778889523,
                content: ['Dies ist ein relativ kurzer Text, reicht für seinen Zweck aber völlig aus']
            },
            {
                sender: 65163163,
                timestamp: 1584778889523,
                content: ['Dies ist ein relativ kurzer Text, reicht für seinen Zweck aber völlig aus']
            },{
                sender: 61668646,
                timestamp: 1585778889523,
                content: ['Dies ist ein relativ kurzer Text, reicht für seinen Zweck aber völlig aus']
            },
            {
                sender: 65163163,
                timestamp: 1586210889523,
                content: ['Dies ist ein relativ kurzer Text, reicht für seinen Zweck aber völlig aus','Dies ist ein relativ kurzer Text, reicht für seinen Zweck aber völlig aus']
            },
            {
                sender: 611655814,
                timestamp: 1586297289523,
                content: ['Dies ist ein relativ kurzer Text, reicht für seinen Zweck aber völlig aus']
            },{
                sender: 65163163,
                timestamp: 1586470089523,
                content: ['Dies ist ein relativ kurzer Text, reicht für seinen Zweck aber völlig aus','Dies ist ein relativ kurzer Text, reicht für seinen Zweck aber völlig aus']
            },
            {
                sender: 61668646,
                timestamp: 1586642889523,
                content: ['Dies ist ein relativ kurzer Text, reicht für seinen Zweck aber völlig aus']
            },
            {
                sender: 65163163,
                timestamp: 1586646489523,
                content: ['Dies ist ein relativ kurzer Text, reicht für seinen Zweck aber völlig aus']
            }
        ]
      }
    }
  },


  methods: {
    getColor(user){
      if(user == this.user){ // Sent messages have special color
        return 'light-blue-2'
      }
      else{
        /* just some standard colors from the quasar palette: */
        var dark = ['deep-purple-10', 'indigo-10', 'teal-10', 'lime-10', 'brown', 'grey-10', 'red-14', 'blue-grey-10'] // dark/colorful selection
        var light = ['red-3', 'indigo-3', 'purple-2', 'blue-1', 'green-3', 'yellow-3', 'orange-4', 'deep-orange-2', 'brown-4', 'grey-6']

        var colors = light
        
        var obj = this.lift.users.find(o => o.uid == user)
        var pos = this.lift.users.indexOf(obj)
        console.log(user + ': ' + pos)
        var color = 'black'
        try{
        color = colors[pos];
        } catch(e){
          console.warn('Fehler bei der Farbenabfrage für Benutzer' + user)
        }
        return color
      }
    },

    checkDayBreak(item){ // when a parameter is given, return true or false. When no parameter is given, returns the text of the label
      var pos = this.lift.messages.indexOf(item)
      
      var label = ''
      
      if(pos > 0){
        var preceder = this.lift.messages[pos-1]
        
        var same_day = date.isSameDate(new Date(item.timestamp), new Date(preceder.timestamp), 'day') // immer neuerer Zeitpunkt zuerst
        var same_month = date.isSameDate(new Date(item.timestamp), new Date(preceder.timestamp), 'month') // immer neuerer Zeitpunkt zuerst

        //console.warn('item: ' + item.sender + ', Vorgänger: ' + preceder.sender + ' is? : ' + (same_day && same_month))
          var diff = date.getDateDiff(new Date(), new Date(item.timestamp), 'days')
          if(!(same_day && same_month)){ // checks whether the item and its preceder are not the same day (and not the same month)
            if(diff == 0){
              label = 'Heute'
            }
            else if(diff == 1){
              label = 'Gestern'
            }
            else if(diff == 2){
              label = 'Vorgestern'
            }
            else{
              label = 'Vor ' + diff + ' Tagen'
            }
          }
      }

      //console.warn(label)

      return label
      
    },

    formatDate(item){
      return date.formatDate(item.timestamp, 'DD.MM.YYYY - H:mm')
    },

    sendMessage(){
      // check whether last message was from this user
      var lastMsg = this.lift.messages[this.lift.messages.length - 1]
      if(lastMsg.sender == this.user){
        // yes, last message was from this user
        lastMsg.content.push(this.text)
      }
      else{
        var newMsg = {
          sender: this.user,
          timestamp: (new Date()).getTime(),
          content: ['' + this.text]
        }
        this.lift.messages.push(newMsg)
      }
      this.messageText = ''
    },

    viewCar(){
      var car = this.lift.car
      var search = car.brand + '+' + car.model.replace(' ', '') + '+' + car.type + '+' + this.lift.car.color
      openURL('https://www.ecosia.org/images?q=' + search)
    },

    goBack(){
      this.$emit('pagetrans_slide')
      this.chatOpen = false
      window.location.href = '/#/chats'
    }
  }
}
</script>