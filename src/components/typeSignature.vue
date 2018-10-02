<template>
  <div id="typeSignature">
    <div class="lockSign" :style="{ width:sizes.width + 'px', height:sizes.height+'px'}"></div>
    <VueSignaturePad :width="sizes.width" :height="sizes.height" :saveType="'image/svg+xml'" ref="signaturePad" />
    <button v-show="!signed" @click="undo">Retour</button>
    <button v-if="!signed" class="saveButton" @click="save(question.id)">Signer</button>

  </div>
</template>
<script>
import VueSignaturePad from "vue-signature-pad";

export default {
  props: {
    question: {
      type: Object,
      default: () => {}
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
      },
      signed: false
    };
  },
  methods: {
    undo() {
      this.$refs.signaturePad.undoSignature();
    },
    save(id, type) {
      const { isEmpty, data } = this.$refs.signaturePad.saveSignature();
      this.signed = true;
      this.$emit("responseInput", {
        idQuestion: id,
        value: data
      });
    }
  },
  mounted() {
    this.sizes.height = this.$el.firstElementChild.offsetHeight.toString();
    this.sizes.width = this.$el.firstElementChild.offsetWidth.toString();
  }
};
</script>
<style>
div#typeSignature > div:nth-child(2) {
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
.lockSign {
  display: block;
  position: absolute;
}
h4 {
  color: #15bb57;
}
</style>
