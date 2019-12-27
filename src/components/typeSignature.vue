<template>
  <div id="typeSignature" ref="typeSignature">
    <VueSignaturePad
      :class="['VueSignaturePad', $sessionVars.signed ? 'locked' : '']"
      :saveType="'image/svg+xml'"
      ref="signaturePad"
    />
    <h4 v-show="$sessionVars.signed">{{this.$sessionVars.selectedLang.signed}}</h4>
    <button v-show="!$sessionVars.signed" @click="undo">{{this.$sessionVars.selectedLang.undo}}</button>
    <button
      v-if="!$sessionVars.signed"
      class="saveButton"
      @click="save(question.id)"
    >
      {{this.$sessionVars.selectedLang.sign}}
    </button>
  </div>
</template>
<script>
import VueSignaturePad from "vue-signature-pad";

export default {
  props: {
    question: {
      type: Object,
      default: () => {}
    },
    pagesNumber: {
      type: Number,
      default: () => 0
    }
  },
  components: {
    VueSignaturePad
  },
  data() {
    return {
      sizes: {
        height: "",
        width: ""
      }
    };
  },
  methods: {
    undo() {
      this.$refs.signaturePad.undoSignature();
    },
    save(id, type) {
      const { isEmpty, data } = this.$refs.signaturePad.saveSignature();

      this.sign();

      this.$emit("responseInput", {
        idQuestion: id,
        value: data
      });
    },

    sign() {
      this.$sessionVars.signed = true;
      this.$refs.signaturePad.lockSignaturePad();
    }
  },
  mounted() {
    if (this.question.response != null) {
      if (this.question.response.idQuestion == this.question.id) {
        this.sign();
        this.$refs.signaturePad.fromDataURL(this.question.response.value);
      }
    }
  }
};
</script>
<style>
div#typeSignature > div.VueSignaturePad {
  margin: 0 auto;
  border: none;
  border-bottom: 1px solid #bb1515;
  background-color: #efefef;
  text-align: center;
  font-size: 1.4em;
  padding: 0.2em;
  font-weight: bold;
  color: #636363;
  margin-bottom: 1em;
  width: 25em;
  height: 10em;
}
div#typeSignature button {
  background-color: rgba(63, 63, 63, 0.3);
  border: 0;
  font-size: 1.1em;
  color: #636363;
  cursor: pointer;
  font-family: cabin;
  padding: 0.6em 1.6em;
}
div#typeSignature button.saveButton {
  background-color: #bb1515;
  color: white;
}
.locked {
  opacity: 0.5;
}
div#typeSignature h4 {
  color: #15bb57;
}
</style>
