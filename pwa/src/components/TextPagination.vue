<template>
  <div class="row flex nowrap">
    <q-btn
      v-for="page in options"
      dense
      class="q-mx-xs"
      no-caps
      :flat="(page.val || page) != value"
      :key="page.val || page"
      :label="pageLabel(page)"
      :color="color || 'primary'"
      @click="emit(page.val || page)"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  value: String,
  options: Array,
  color: String,
  labelCapitalized: Boolean,
  specialLabel: Boolean,
});
const { value, options, color, labelCapitalized, specialLabel } = toRefs(props);

function emit(val) {
  $emit('input', val);
}

function pageLabel(page) {
  var text = page.label || page;
  if (specialLabel) {
    text = text.replace('/', '.') + '.'; // special label, needed for this use
  } else {
    if (labelCapitalized)
      text = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }
  return text;
}

const optionsComputed = computed(() => {
  if (options.length) {
    if (options[0].val) return options;
    else {
      var newOptions = [];
      options.forEach((page) =>
        newOptions.push({
          val: page,
        })
      );
      return newOptions;
    }
  } else return [];
});
</script>

<style lang="scss" scoped></style>
