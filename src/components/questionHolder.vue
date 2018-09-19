<template>
  <div class="questionsHolder">
    <h3 v-if="sessionVars.errors.length >= 1" :class="[question.required ? 'required' : '']" > {{ question.question
    }}</h3>
     <h3 v-else > {{ question.question }}</h3>
    <slot></slot>
  </div>
</template>


<script>
export default {
  props: {
    question: {
      type: Object,
      default: () => {}
    }
  }
};
</script>

<style>
@keyframes shake {
  0% {
    transform: translate(1px, 1px) rotate(0deg);
  }
  10% {
    transform: translate(-1px, -2px) rotate(-1deg);
  }
  20% {
    transform: translate(-3px, 0px) rotate(1deg);
  }
  30% {
    transform: translate(3px, 2px) rotate(0deg);
  }
  40% {
    transform: translate(1px, -1px) rotate(1deg);
  }
  50% {
    transform: translate(-1px, 2px) rotate(-1deg);
  }
  60% {
    transform: translate(-3px, 1px) rotate(0deg);
  }
  70% {
    transform: translate(3px, 1px) rotate(-1deg);
  }
  80% {
    transform: translate(-1px, -1px) rotate(1deg);
  }
  90% {
    transform: translate(1px, 2px) rotate(0deg);
  }
  100% {
    transform: translate(1px, -2px) rotate(-1deg);
  }
}
.required {
  color: red;
  animation: shake 0.5s 0.5s;
}
</style>
