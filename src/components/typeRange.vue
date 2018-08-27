<template>
    <input type="range" :max="question.x" :min="question.min" @input="select(inputRange,question.id)" v-model="inputRange" />

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
    return {
      inputRange: null
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

.questionHolder > input[type="range"]::-webkit-slider-runnable-track {
    box-shadow: none;
    border: none;
    background: transparent;
    -webkit-appearance: none;
}

.questionHolder > input[type="range"]::-moz-range-track {
    box-shadow: none;
    border: none;
    background: transparent;
}

.questionHolder > input[type="range"]::-moz-focus-outer {
    border: 0;
}

.questionHolder > input[type="range"]::-webkit-slider-thumb {
    width: 20px;
    height: 20px;
    border: 0;
    background-color: #f89406;
    transform: rotate(45deg);
    box-shadow: 0 0 1px 0px rgba(0, 0, 0, 0.1);
    -webkit-appearance: none;
}

.questionHolder > input[type="range"]::-moz-range-thumb {
    width: 14px;
    height: 14px;
    border: 0;
    background: #fff;
    border-radius: 100%;
    box-shadow: 0 0 1px 0px rgba(0, 0, 0, 0.1);
}
</style>

