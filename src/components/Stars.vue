<template>
    <Stars :show-rating="false" inactive-color="#efefef" active-color="#bb1515" :max-rating="question.number" @rating-selected="select(starsValue,question.id)" v-model="starsValue" />
</template>

<script>
import Stars from "vue-star-rating";

export default {
  name: "VueStars",
  components: {
    Stars
  },
  props: {
    question: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      rating: null,
      starsValue:null
    };
  },
  methods: {
    select(response, id) {
      this.$emit("responseInput", {
        idQuestion: id,
        value: response
      });
    }
  }
};
</script>

<style>
.vue-star-rating {
  margin: 0 auto;
}
</style>

