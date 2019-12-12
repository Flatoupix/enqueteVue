<template>
  <div
    :class="[
      'ednBtn',
      [alternate ? 'alternate' : ''],
      [sm ? 'sm' : ''],
      [disable ? 'disable' : '']
    ]"
  >
    {{ label }}
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: () => ""
    },
    alternate: {
      type: Boolean,
      default: () => false
    },
    sm: {
      type: Boolean,
      default: () => false
    },
    disable: {
      type: Boolean,
      default: () => false
    }
  }
};
</script>

<style lang="scss" scoped>
// @import '@/assets/scss/vars.scss';
@import url("https://fonts.googleapis.com/css?family=Roboto");

div.ednBtn {
  &.sm {
    font-size: 0.5em;
  }
  &.alternate {
    background-color: #c4c4c4;
  }
  background-color: #bb1515;

  margin: 0 0.5em;
  padding: 0.4em;
  text-align: center;
  width: 7em;
  color: white;
  float: right;
  bottom: 0;
  right: 0;
  cursor: pointer;
}
@media screen and (max-width: 450px) {
}
</style>
