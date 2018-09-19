
<template>
  <div class="buttonsHolder">
    <select @change="select(monselect)" v-if="question.responseChoices.length > 6" v-model="monselect" :id="question.id">
      <option :key="response.id" v-for="response
        in question.responseChoices" :responseValue="response" :value="response">{{response.value}}</option>
    </select>

    <button v-else type="button" v-for="response in question.responseChoices" :key="response.id" :class="['pillBtn', (currentChoice === response.id ?
    'active' : '')]" :id="response.id" @click="select(response)">
      {{ response.value }}</button>
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
      responseValue: null,
      monselect: "",
      currentChoice: this.savedChoice
    };
  },
  methods: {
    select(response) {
      console.log(response);
      console.log(this.monselect);
      this.currentChoice = response.id;

      this.$emit("responseInput", {
        idQuestion: this.question.id,
        value: response.id
      });
    }
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
