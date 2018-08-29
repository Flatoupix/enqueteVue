<template>
  <div class="pageBtnContainer">
    <button v-for="item in page" :key="item.number" :class="['pageBtn', (currentPage === item.number ? 'active' :
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
    rootPage: {
      type: Number,
      default: () => 0
    }
  },
  data() {
    return {
      currentPage: this.rootPage
    };
  },
  methods: {
    select(response) {
      this.currentPage = response.number;
      this.$route.params.rootPage = response.number;
      
      this.$emit("pageSelected", response);
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
