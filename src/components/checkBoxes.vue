<template>
  <div class="chkBxHolder">
    <div @click="select(response)" 
        :key="response.id" 
        v-for="response in selections" 
        class="chkBxGrp">
      <div v-if="question.type=='MULTI'" :class="['resetPosition',
      (response.selected ? 'checked' : '')]">
          <div class="customTick">L</div>
      </div>
      <div v-if="question.type=='CHECKBOX'" :class="['resetPosition', (currentTarget ? 'checked' : '')]">
        <div class="customTick">L</div>
      </div>
      <div :id="response.id" class="chkElmnt" />
      <label :for="response.id">{{ response.value }}</label>
    </div>
  </div>

</template>

<script>
export default {
  props: {
    question: {
      type: Object,
      default: () => []
    }
  },
  data() {
    let result = {
      selections: []
    };
    this.question.response.forEach(response => {
      result.selections.push({
        id: response.id,
        value: response.value,
        selected: false
      });
    });
    return result,
    currentTarget=null
  },
  methods: {
    select(response) {
      response.selected = !response.selected;

      let ids = [];

      this.selections.forEach(element => {
        if(element.selected) {
          ids.push(element.id)
        }
      })
      
      this.$emit("responseInput", {
        idQuestion: this.question.id,
        value: ids
      });
    }
  }
};
</script>

<style>
.chkBxHolder {
  text-align: left;
  margin-left: 2em;
}
.chkBxHolder > div > * {
  cursor: pointer;
}
div.chkBxHolder > div > div.chkElmnt {
  -webkit-appearance: none;
  height: 1em;
  font-size: 1.3em;
  line-height: 1em;
  width: 1em;
  background-color: white;
  border-radius: 0.2em;
  border: 2px solid #bb1515;
  display: inline-block;
}

div.chkBxHolder > div > label {
  font-size: 1.2em;
  vertical-align: 0.3em;
  margin-left: 0.5em;
  user-select: none;
}
div.chkBxGrp {
  position: relative;
}
div.chkBxGrp > div.resetPosition div.customTick {
  color: #bb1515;
  font-weight: bold;
  font-size: 2.1em;
  position: absolute;
  -webkit-transform: rotate(35deg) scaleX(-1);
  transform: rotate(35deg) scaleX(-1.3);
  overflow: hidden;
  left: 8px;
  top: -6px;
}
div.resetPosition {
  overflow: hidden;
  display: block;
  opacity: 0;
  height: 1.8em;
  line-height: 1.8em;
  position: absolute;
  left: 1em;
  -webkit-transition: all 0.3s;
  transition: all 300ms 0ms;
  width: 100%;
}
.checked.resetPosition {
  -webkit-transition: all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
  transition: all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
  left: 0.2em;
  opacity: 1;
}
</style>
