<template>
  <div class="pageBtnContainer">
    <button
      v-for="item in page"
      :key="item.number"
      :class="['pageBtn', $sessionVars.rootPage == item.number ? 'active' : '']"
      @click="select(item)"
    >
      {{ item.number }}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    page: {
      type: Array,
      default: () => []
    },
    rootPage: {
      type: Number,
      default: () => 0
    }
  },
  methods: {
    select(response) {
     
      if (response.number != this.$sessionVars.rootPage) {
        this.$emit("scan")
        if (
          this.$sessionVars.errors == 0 ||
          response.number < this.$sessionVars.rootPage
        ) {
          this.$sessionVars.rootPage = response.number;
          this.$emit("refresh");
           document.getElementById(this.rootPage).focus();

         
        }
      }
    }
  }
};
</script>

<style>
.pageBtnContainer {
  margin: 3em 0;
}
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
  user-select: none;
}
.pageBtn.active {
  background-color: #bb1515;
  color: white;
}
</style>
