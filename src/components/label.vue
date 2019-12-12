<template>
  <span class="label">
    <span :class="['required', required ? 'true' : '']">*</span> {{ label }} :
  </span>
</template>
<script>
export default {
  props: {
    label: {
      type: String,
      default: () => ""
    },
    required: {
      type: Boolean,
      default: () => false
    }
  },
  mounted() {}
};
</script>

<style lang="scss">
// @import '@/assets/scss/vars.scss';

span.required {
  &.true {
    display: inline-block;
    color: #bb1515;
  }
  display: none;
}
</style>
