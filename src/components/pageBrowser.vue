<template>
  <div class="pageBrowser">
    <button
      v-if="$sessionVars.rootPage > 1"
      @click="prevPage()"
      class="prevButton"
    >
      {{this.$sessionVars.selectedLang.back}}
    </button>

    <button
      v-if="$sessionVars.rootPage < pagesNumber && !hiddenNxtPage"
      @click="nextPage()"
      class="nextButton"
    >
      {{this.$sessionVars.selectedLang.next}}
    </button>
    <button
      v-if="$sessionVars.rootPage == pagesNumber || hiddenNxtPage"
      @click="submitForm()"
      class="nextButton validate"
    >
      {{this.$sessionVars.selectedLang.submit}}
    </button>
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
    },
    hiddenNxtPage:{
      type: Boolean
    }
  },
  methods: {
    scrollUp() {
      this.$scrollTo(this.$sessionVars.rootPage, 0, {
        force: true
      });
    },
    submitForm(response) {
      this.isRequired();
      if (this.$sessionVars.errors.length == 0) {
        if (this.$sessionVars.confirmed) {
          this.$emit("formConfirmed");
        }
      }
    },
    isRequired() {
      this.$emit("scan");
    },
    nextPage() {
      this.isRequired();
      if (this.$sessionVars.errors.length == 0) {
        if (this.$sessionVars.rootPage < this.pagesNumber) {
          this.$sessionVars.rootPage++;
          this.scrollUp();
          this.$emit("refresh");
        }
      }
    },
    prevPage() {
      if (this.$sessionVars.rootPage >= this.pagesNumber) {
        this.$sessionVars.rootPage--;
        this.scrollUp();
        this.$emit("refresh");
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
.pageBrowser > button.validate.nextButton {
  background-color: #bb1515;
  color: white;
}
.nextButton {
  float: right;
}
</style>
