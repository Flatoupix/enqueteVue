<template>
  <div>

    <vue-slider :tooltip="'hover'"
    :tooltipStyle="{backgroundColor:'#bb1515',borderColor: '#bb1515'}"
    :processStyle="{backgroundColor:'#bb1515'}" :step="question.step"
    :max="question.max" :min="question.min"
    @input="select(inputRange,question.id)" 
    v-model="inputRange"  :piecewiseLabel="true">
    </vue-slider>
 
  </div>
</template>

<script>
import vueSlider from "vue-slider-component";

export default {
  components: {
    vueSlider
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
      this.savedChoice = parseInt(this.question.min);
    }
    return {
      inputRange: this.savedChoice
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
.maxRange {
  width: 10%;
}
.minRange {
  width: 10%;
}
vue-slider {
  width: 80%;
}
</style>

