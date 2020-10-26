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

<script>
export default {
  name: "TextPagination",
  props: {
    value: String,
    options: Array,
    color: String,
    labelCapitalized: Boolean,
  },
  model: {
    prop: "value",
    event: "click",
  },
  methods: {
    emit(val) {
      this.$emit("click", val);
    },

    change(val) {},

    pageLabel(page) {
      var text = page.label || page;
      if (this.labelCapitalized)
        text = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
      return text;
    },
  },
  computed: {
    optionsComputed() {
      if (this.options.length) {
        if (this.options[0].val) return this.options;
        else {
          var newOptions = [];
          this.options.forEach((page) =>
            newOptions.push({
              val: page,
            })
          );
          return newOptions;
        }
      } else return [];
    },
  },
  data() {
    return {};
  },

  mounted() {},
};
</script>

<style lang="scss" scoped>
</style>