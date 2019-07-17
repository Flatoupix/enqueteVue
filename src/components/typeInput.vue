<template>
  <div>
    <input
      v-tooltip="question.toolTip"
      :placeholder="question.watermark"
      v-if="question.type == 'TEXT'"
      class="textField"
      type="text"
      @input="select(input, question.id)"
      v-model="input"
    />
    <input
      v-tooltip="question.toolTip"
      :placeholder="question.watermark"
      v-if="question.type == 'NUM'"
      type="number"
      @input="select(input, question.id)"
      v-model="input"
    />
    <textarea
      v-tooltip="question.toolTip"
      :placeholder="question.watermark"
      v-if="question.type == 'MEMO'"
      class="textField"
      @input="select(input, question.id)"
      v-model="input"
    />
  </div>
</template>

<script>
export default {
  props: {
    question: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    if (this.question.response != null) {
      this.savedChoice = this.question.response.value;
    } else {
      this.savedChoice = null;
    }
    return {
      input: this.savedChoice
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
.textField {
  width: 81vw;
  text-align: left;
  text-indent: 0.5em;
  font-family: Cabin, sans-serif;
}
input[type="Number"] {
  font-size: 1.5em;
  width: 3.5em;
  padding: 0.2em 0.2em;
}
</style>
