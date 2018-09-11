<template>
  <div class="pageBrowser">
    <button v-if="localPage>1" @click="prevPage()" class="prevButton">Précédent</button>
    <button v-if="localPage<pagesNumber" @click="nextPage()" class="nextButton">Suivant</button>
  </div>
</template>
<script>
export default {
  props: {
    rootPage: {
      type: Number,
      default: () => 0
    },
    pagesNumber: {
      type: Number,
      default: () => 0
    }
  },
  data() {
    return {
      localPage: this.rootPage
    };
  },
  methods: {
    nextPage() {
      if (this.localPage < this.pagesNumber) {
        this.localPage++;
        this.$emit("pageSelected", this.localPage);
      }
    },
    prevPage() {
      if (this.localPage >= this.pagesNumber) {
        this.localPage--;
        this.$emit("pageSelected", this.localPage);
      }
    }
  }
};
</script>

<style>
.pageBrowser {
  width: 100%;
  height: 2.7em;
  display: block;
}
.pageBrowser > button {
  background-color: rgba(63, 63, 63, 0.3);
  border: 0;
  font-size: 1.1em;
  color: #636363;
  cursor: pointer;
  font-family: cabin;
  padding: 0.6em 1.6em;
}
.pageBrowser > button:hover {
  background-color: #bb1515;
  color: white;
}
.prevButton {
  float: left;
}
.nextButton {
  float: right;
}
</style>
