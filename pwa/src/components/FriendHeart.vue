<template>
  <!-- this was my first custom component, it's still there because I don't wanna delete it -->
  <div>
    <q-btn @click="emit" flat dense :ripple="false">
      <q-avatar>
        <div class="relative-position">
          <q-icon
            class="absolute absolute-center"
            :size="size || 'md'"
            name="favorite"
            :color="backColor || 'grey-4'"
          />
          <q-icon
            dense
            flat
            v-if="left || right"
            :size="size || 'md'"
            name="favorite"
            style="z-index: 3000"
            :class="heartIconHalf + ' absolute absolute-center'"
            color="dark"
          />
        </div>
      </q-avatar>
    </q-btn>
  </div>
</template>

<script setup>
const props = defineProps({
  left: {
    type: Boolean,
    required: true,
  },
  right: {
    type: Boolean,
    required: true,
  },
  size: String,
  backColor: String,
});
const { left, right, backColor, size } = toRefs(props);

const heartIconHalf = () => {
  var l = left,
    r = right;
  if (l && !r) return 'only-left-half';
  else if (!l && r) return 'only-right-half';
  else return '';
};
function emit() {
  $emit('click');
}
</script>

<style scoped lang="scss">
.only-left-half {
  clip-path: polygon(
    50% 0%,
    50% 100%,
    0 100%,
    0 0
  ); // displays only half of the image
}

.only-right-half {
  clip-path: polygon(100% 0, 100% 100%, 50% 100%, 50% 0); // and only right half
}

.other-user-image {
  // the octagon
  -webkit-clip-path: polygon(
    10% 0%,
    90% 0%,
    100% 10%,
    100% 90%,
    90% 100%,
    10% 100%,
    0% 90%,
    0% 10%
  );
  clip-path: polygon(
    10% 0%,
    90% 0%,
    100% 10%,
    100% 90%,
    90% 100%,
    10% 100%,
    0% 90%,
    0% 10%
  );
}
</style>
