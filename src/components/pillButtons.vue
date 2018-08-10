
<template>
  <div class="buttonsHolder">
    <button type="button" v-for="response in responsesChoices" :key="response.id"
    :class="['pillBtn', (currentChoice === response ? 'active' : '')]"
    :id="response.id" @click="select(response)">
      {{ response.value }}</button>
  </div>

</template>

<script>
export default {
  props: {
    responsesChoices: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      currentChoice: null
    }
  },
  methods: {
    select(response) {
  
    this.currentChoice = response
    this.$emit('responseInput',response)      
    }
  },
  computed: {

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
