
<template>
<transition name="component-slide" mode="out-in">
    <div class="pageHolder" :id="page.number" @click="select(page.number)">
      <slot></slot>
  </div>
</transition>
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
.slide-enter-active, .slide-leave-active {
  transition: transform .5s;
}
.slide-enter, .slide-leave-to /* .slide-leave-active below version 2.1.8 */ {
  transform:translateX(-5em);
}
</style>
