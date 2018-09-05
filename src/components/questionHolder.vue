<template>
  <div class="questionsHolder">
    <h3> {{ question.question }}</h3>
    <slot></slot>
  </div>
</template>


<script>
export default {
  props: {
    question: {
      type: Object,
      default: () => {}
    }
  }
};
</script>

<style>
</style>
