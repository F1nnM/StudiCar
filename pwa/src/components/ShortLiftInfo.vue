<template>
  <div>
    <q-dialog :value="open" @input="emit" full-width position="bottom" style="min-height: 50vh">
      <q-card v-if="open">
        <q-card-section class="q-pl-sm">
          <q-splitter :value="9" disable>
            <template v-slot:before>
              <q-tabs v-model="viewTab" vertical class="text-primary text-center">
                <q-tab name="info" icon="info" />
                <q-tab name="qr" icon="select_all" />
              </q-tabs>
            </template>
            <template v-slot:after>
              <q-tab-panels
                v-model="viewTab"
                vertical
                animated
                infinite
                swipeable
                transition-prev="slide-down"
                transition-next="slide-up"
              >
                <q-tab-panel name="info" class="q-pa-sm">
                  <q-toolbar>
                    <q-toolbar-title>
                      {{ lift.start.name }}
                      <span class="q-mx-sm">&rsaquo;</span>
                      {{ lift.destination.name }}
                    </q-toolbar-title>
                  </q-toolbar>

                  <div class="q-mt-xl row">
                    <div class="col-7">
                      <q-timeline layout="comfortable" side="left">
                        <q-timeline-entry>
                          <template v-slot:title>
                            <q-icon
                              :name="lift.start.id > 3 ? 'home' : 'school'"
                              size="sm"
                              color="dark"
                            />
                          </template>
                          <template v-slot:subtitle class="q-px-none">
                            <span class="text-dark text-subtitle1">{{ formatAsTime(lift.departAt) }}</span>
                          </template>
                        </q-timeline-entry>
                        <q-timeline-entry>
                          <template v-slot:title>
                            <q-icon
                              :name="lift.destination.id > 3 ? 'home' : 'school'"
                              size="sm"
                              color="dark"
                            />
                          </template>
                          <template v-slot:subtitle>
                            <span class="text-dark text-subtitle1">{{ formatAsTime(lift.arriveBy) }}</span>
                          </template>
                        </q-timeline-entry>
                      </q-timeline>
                    </div>
                    <div class="col-5 text-right">
                      <q-tab-panels
                        animated
                        swipeable
                        transition-prev="slide-right"
                        transition-next="slide-left"
                        v-model="infoTab"
                        class="q-pa-none"
                        style="min-height: 30vh"
                      >
                        <q-tab-panel name="people" class="q-pa-none">
                          <q-list>
                            <q-item dense>
                              <q-item-section>
                                <q-item-label>
                                  <q-icon
                                    dense
                                    name="directions_car"
                                    class="q-mr-xs"
                                    size="xs"
                                    color="grey-9"
                                  />
                                  {{ lift.driver.name }}
                                </q-item-label>
                              </q-item-section>
                            </q-item>
                            <q-item dense v-for="p in lift.passengers" :key="p.id">
                              <q-item-section>
                                <q-item-label>{{ p.name }}</q-item-label>
                              </q-item-section>
                            </q-item>
                          </q-list>
                        </q-tab-panel>
                        <q-tab-panel name="car" class="q-pa-none">
                          <q-item>
                            <q-item-section>
                              <q-item-label
                                class="text-h6 text-weight-light q-ml-lg q-mb-xs row justify-evenly vertical-bottom"
                                :style="'border-bottom: 1px solid ' + lift.car.color"
                              >
                                <span>{{ lift.car.brand }}</span>
                                <div class="text-subtitle2">{{ lift.car.model }}</div>
                              </q-item-label>
                              <q-item-label caption class="text-right">
                                <div class="q-my-xs">Baujahr {{ lift.car.built }}</div>
                                <div>{{ lift.car.licensePlate }}</div>
                              </q-item-label>
                            </q-item-section>
                          </q-item>
                          <q-item dense class="q-mt-md">
                            <q-item-section class="row justify-end">
                              <q-knob
                                show-value
                                readonly
                                font-size="16px"
                                class="text-dark q-mx-sm"
                                :value="(lift.passengers.length + 1) / lift.car.allSeats * 100"
                                size="70px"
                                :thickness="0.05"
                                :color="(lift.passengers.length + 1) == lift.car.allSeats ? 'positive' : 'dark'"
                                track-color="grey-3"
                              >
                                {{ lift.passengers.length + 1 }} / {{ lift.car.allSeats }}
                                <q-icon
                                  name="person"
                                  color="grey-9"
                                  style="margin-left: 1px"
                                  size="xs"
                                />
                              </q-knob>
                            </q-item-section>
                          </q-item>
                        </q-tab-panel>
                      </q-tab-panels>
                      <q-tabs v-model="infoTab" dense class="bg-white text-primary">
                        <q-tab name="people" />
                        <q-tab name="car" />
                      </q-tabs>
                    </div>
                  </div>
                </q-tab-panel>

                <q-tab-panel name="qr">
                  <div class="overflow-hidden row justify-end">
                    <div
                      :class="`relative-position  text-center studicar-code ${viewTab == 'qr' ? 'show' : ''}`"
                    >
                      <VueQrcode
                        :width="200"
                        :color="{
                          dark: '#000000',
                          light: '#FFFFFF'
                          }"
                        errorCorrectionLevel="H"
                        :value="'l' + lift.qr"
                      />
                      <q-img
                        src="~assets/app-icon_from_web_filled.png"
                        class="absolute-center qrcode-image"
                      />
                    </div>
                    <div class="q-pl-sm column justify-start">
                      <div class="q-my-md">
                        <q-btn icon="share" size="md" color="dark" dense flat disable />
                      </div>
                      <!-- <div>
                        <q-btn icon="fullscreen" size="md" color="dark" dense flat />
                      </div>-->
                    </div>
                  </div>
                  <ExtHR color="primary" size="xs" />
                  <p
                    class="text-grey-7 q-pt-sm q-mb-none text-center"
                  >Teile deine Mitfahrgelegenheit über den StudiCar Code</p>
                  <p></p>
                </q-tab-panel>
              </q-tab-panels>
            </template>
          </q-splitter>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { date } from "quasar";
import VueQrcode from "vue-qrcode";
import ExtHR from "components/ExtendedHr";

export default {
  name: "ShortLiftInfo",
  components: {
    VueQrcode,
    ExtHR,
  },
  model: {
    prop: "open",
    event: "input",
  },
  props: {
    lift: Object,
    open: Boolean,
  },
  data() {
    return {
      viewTab: "info",
      infoTab: "people",
    };
  },
  methods: {
    emit(val) {
      this.$emit("input", val);
    },

    formatAsTime(time) {
      return date.formatDate(new Date(time), "H:mm");
    },
  },
  computed: {
    dateDiff() {
      var now = new Date(),
        liftDate = this.lift.date,
        diff = date.getDateDiff(liftDate, now, "days");
      switch (diff) {
        case 0:
          return "Heute";
          break;
        case 1:
          return "Morgen";
          break;
        case 2:
          return "Übermorgen";
          break;
        default:
          return "Da ist noch hin";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.studicar-code {
  transform: translateY(150%);
  transition-delay: 0.6s;
  transition-timing-function: cubic-bezier(0, 1, 0.42, 0.99);
  overflow-y: hidden;
  &.show {
    animation: rise 0.4s forwards ease-out;

    @keyframes rise {
      to {
        transform: translateY(0);
      }
    }
  }
}

.qrcode-image {
  width: 45px;
  height: 45px;
  background: transparent;
}
</style>