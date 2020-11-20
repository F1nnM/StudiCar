<template>
  <q-img :contain="!headFocused" :class="comClass" :src="src" />
</template>

<script>
export default {
  name: "TeamPicture",
  props: {
    headFocused: Boolean,
    imageUrl: String,
    cutBackground: Boolean
  },
  computed: {
    comClass(){
      var c = ''
      if(this.headFocused) c += ' head-focused'
      else c += ' body-focused'
      if(this.cutBackground) c += ' cut'
      return c
    },

    src(){
      const path = ''
      return require('../assets/team/' + this.imageUrl + '.jpg')
    }
  }
};
</script>

<style lang="scss" scoped>
.head-focused {
  transform: scale(2);
  transform-origin: center 8%;
  animation: all 0.2s ease-out;
}

.body-focused {
  transform: scale(0.8);
  border-radius: 10px;
  transform-origin: center top;
}

.cut {
  clip-path: inset(0 29% 52% 27%);
}
</style>
