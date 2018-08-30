<template>
  <div class="rangeContainer">
    <input class="customRange" type="range" :step="question.step" :max="question.max" :min="question.min" @input="select(inputRange,question.id)" v-model="inputRange" />
  </div>
</template>

<script>
export default {
  name: "Range",
  props: {
    question: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    if (this.question.reponse != "") {
      this.savedChoice = parseInt(this.question.response.value);
    } else {
      this.savedChoice = null;
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
div.rangeContainer {
  margin: 0 20px;
  vertical-align: 40px;
  position: relative;
}
input.customRange[type="range"] {
  -webkit-appearance: inherit;
  border: none;
  height: 0em;
  width: 20em;
  cursor: pointer;
}
input.customRange[type="range"]::-webkit-slider-runnable-track {
  box-shadow: none;
  border: none;
  background: transparent;
  -webkit-appearance: none;
}

input.customRange[type="range"]::-moz-range-track {
  box-shadow: none;
  border: none;
  background: transparent;
}

input.customRange[type="range"]::-moz-focus-outer {
  border: 0;
}

input.customRange[type="range"]::-webkit-slider-thumb {
  width: 1.5em;
  height: 1.5em;
  border: 0;
  border-radius: 100%;
  background-color: #bb1515;
  box-shadow: 0 0 1px 0px rgba(0, 0, 0, 0.1);
  -webkit-appearance: none;
}
</style>

