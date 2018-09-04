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
    },
    ifDisplay: {
      type: Array,
      default: () => []
    }
  },
  data() {
    if (this.question.lnkQuestion != null) {
      let ids = [];
      this.question.lnkResponse.forEach(element => {
        ids.push(element.id);
      });
      this.ifDisplay.push({
        id: this.question.id,
        lnkQuestion: this.question.lnkQuestion,
        lnkReponse: ids
      });

      this.currentState = true;
    } else {
      this.currentState = false;
    }
    return {};
  }
};
</script>

<style>
</style>
