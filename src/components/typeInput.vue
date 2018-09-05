<template>
  <div>
    <input v-if="question.type=='TEXT'" class="textField" type="text" @input="select(input,question.id)" v-model="input" />
    <input v-if="question.type=='NUM'" type="number" @input="select(input,question.id)" v-model="input" />
    <textarea v-if="question.type=='MEMO'" @input="select(input,question.id)" v-model="input" />
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
  width: 40em;
  text-align: left;
  text-indent: 0.5em;
}
input[type="Number"] {
  font-size: 1.5em;
  width: 2.5em;
  padding: 0.2em 0.2em;
}
textarea {
  text-align: left;
  width: 100%;
  height: 3em;
  font-size: 1.5em;
}
</style>
