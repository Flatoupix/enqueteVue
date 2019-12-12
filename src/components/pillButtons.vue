<template>
  <div class="buttonsHolder">
    <select
      v-tooltip="question.toolTip"
      @change="select(myValue)"
      v-if="question.responseChoices.length > 6"
      v-model="myValue"
      :id="question.id"
    >
      <option
        :key="response.id"
        v-for="response in question.responseChoices"
        :responseValue="response"
        :value="myValue"
        >{{ response.value }}</option
      >
    </select>

    <button
      v-else
      v-tooltip="question.toolTip"
      type="button"
      v-for="response in question.responseChoices"
      :key="response.id"
      :class="['pillBtn', currentChoice === response.id ? 'active' : '']"
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
      currentChoice: null
    };
  },
  methods: {
    select(response) {
      this.currentChoice = response.id;

      this.$emit("responseInput", {
        idQuestion: this.question.id,
        value: response.id
      });
    }
  },
  mounted() {
    if (this.question.response != null) {
      this.currentChoice = this.question.response.value;
      console.log(this.question.response.id);
    } else this.savedChoice = null;
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
