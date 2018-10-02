
<template>
  <div id="pageHolder" class="pageHolder">
    <div v-if="page" :id="page.number" @click="select(page.number)">
      <slot></slot>
    </div>
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
    select(response) {
      this.currentChoice = response;
    }
  }
};
</script>

<style>
</style>
