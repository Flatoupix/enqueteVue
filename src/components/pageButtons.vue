<template>
  <div class="pageBtnContainer">
    <button v-for="item in page" :key="item.number" :class="['pageBtn', (currentPage === item ? 'active' :
    '')]" @click="select(item)">{{ item.number }}</button>
  </div>
</template>

<script>
export default {
  props: {
    page: {
      type: Array,
      default: () => [{}]
    },
    clickHandler: ""
  },
  data() {
    return {
      currentPage: 1
    };
  },
  methods: {
    select(reponse) {
      this.currentPage = reponse;
      this.$emit("pageSelected", reponse);
    }
  }
};
</script>

<style>
.pageBtn {
  color: #636363;
  background-color: rgba(63, 63, 63, 0.3);
  border: none;
  font-size: 2em;
  margin: 0 1%;
  width: 1.5em;
  height: 1.5em;
  border-radius: 100%;
  cursor: pointer;
}
.pageBtn.active {
  background-color: #bb1515;
  color: white;
}
</style>
