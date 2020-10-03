<template>
  <div>
    <div class="relative-position q-ma-none q-pa-none">
      <div
        class="absolute"
        style="position: top: 0; right: 0; transform: translateY(-200%)"
      >
        <q-btn
          @click="click()"
          :label="label"
          :icon="icon"
          :flat="flat"
          :no-wrap="noWrap"
          :disable="disable"
          :size="size"
          :outline="outline"
          :rounded="rounded"
          :color="color"
          :text-color="textColor"
        />
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: 'TitleButton',
  props: {
    label: {
      type: String
    },
    icon: {
      type: String
    },
    flat: {
      type: Boolean
    },
    noWrap: {
      type: Boolean
    },
    disable: {
      type: Boolean
    },
    size: {
      type: String
    },
    outline: {
      type: Boolean
    },
    rounded: {
      type: Boolean
    },
    color: {
      type: String
    },
    textColor: {
      type: String
    }
  },
  methods: {
    click () {
      this.$emit('click')
    }
  }
}
</script>