<template>
  <div>
    <Stars
      ref="stars"
      inactive-color="#efefef"
      active-color="#bb1515"
      :max-rating="question.number"
      @mouseover.native="print()"
      @rating-selected="select($event, question.id)"
    />
  </div>
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
    if (this.question.response != null) {
      this.savedChoice = parseInt(this.question.response.value);
    } else {
      this.savedChoice = null;
    }
    return {
      lastRate: 0
    };
  },
  methods: {
    print() {
      this.lastRate = this.$refs.stars.selectedRating;
    },
    select(response, id) {
      if (this.lastRate == this.$refs.stars.currentRating) {
        this.$refs.stars.selectedRating = this.$refs.stars.currentRating = 0;
      }

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
