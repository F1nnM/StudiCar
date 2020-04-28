<template>
  <div>
    <div v-for="n in value" :key="n">
      <br />
    </div>
  </div>
</template>

<script>

export default {
  name: 'break_n',
  props: {
        value:{
            type: Number,
            required: true
        }
    }
  }
  

</script>
