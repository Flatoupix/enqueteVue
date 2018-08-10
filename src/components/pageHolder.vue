
<template>

    <div class="pageHolder" :id="page.number" @click="select(page.number)">
      <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    page: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    select(reponse) {
      this.currentChoice = reponse
      // this.$emit('response', target)
    }
  },
  computed: {}
};
</script>

<style>
</style>
