<template>
  <div class="buttonsHolder">
    <select
      v-if="question.responseChoices.length > 4"
      v-tooltip="question.toolTip"
      @change="select(myValue)"
      v-model="myValue"
      :id="question.id"
    >
      <option
        :key="response.id"
        v-for="response in question.responseChoices"
        :responseValue="response"
        :value="response"
        >{{ response.value }}</option
      >
    </select>

    <button
      v-else
      v-tooltip="question.toolTip"
      type="button"
      v-for="response in question.responseChoices"
      :key="response.id"
      :class="['pillBtn', myValue === response ? 'active' : '']"
      :id="response.id"
      @click="select(response)"
    >
      {{ response.value }}
    </button>
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
    return {
      responseValue: null,
      myValue: null,
    };
  },
  methods: {
    select(response) {
      this.myValue = response;
      this.$emit("responseInput", {
        idQuestion: this.question.id,
        value: response.id
      });
    }
  },
  mounted() {
    if (this.question.response != null)
      this.myValue = this.question.responseChoices.filter(
        item => item.id === this.question.response.value
      )[0];
    else this.myValue = null;
  }
};
</script>

<style>
button.pillBtn {
  background-color: rgba(63, 63, 63, 0.3);
  border: 0;
  font-size: 1.1em;
  color: #636363;
  padding: 0.6em 1.6em;
  cursor: pointer;
  font-family: cabin;
  font-size: 1.1em;
  padding: 0.6em 1.6em;
}
button.pillBtn.active {
  background-color: #bb1515;
  color: white;
  transition: background-color 0.25s;
}
</style>
