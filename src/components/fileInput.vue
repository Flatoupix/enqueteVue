<template>
  <v-file-input
    id="attachment"
    ref="fileattachment"
    @change="handleFileUpload()"
    counter
    multiple
    placeholder="Selectionnez vos fichiers"
    prepend-icon="mdi-paperclip"
    outlined
    :show-size="1000"
    :color="'#bb1515'"
  >
  </v-file-input>
  <!-- <div class="gridTemplate" id="fileUpload">
    <label-el :required="required" :label="label" />

    <label v-if="!saved" :class="['headLabel', file != null ? 'loaded' : '']">
      <div v-if="file != null">{{ file.name }}</div>
      <span v-else>Ajouter</span>
      <input
        type="file"
        id="attachment"
        ref="fileattachment"
        @change="handleFileUpload()"
      />
    </label>
    <label v-else class="headLabel loaded">
      <div>Chargé</div>
    </label>

  </div> -->
</template>
<script>
import { detect } from "detect-browser";

export default {
  props: {
    question: {
      type: Object,
      default: () => {}
    },
    label: {
      type: String,
      default: () => ""
    },
    required: {
      type: Boolean,
      default: () => false
    },
    savedElements: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      sizeWarning: false,
      sizeLimit: 6000000,
      files: [],
      uppedFiles: [],
      fileIDs: [],
      browser: null,
      file: null,
      saved: false
    };
  },
  methods: {
    postFile(response, id) {
      let serviceLink = "attachment?";
      this.objFormat = response;
      this.$http
        .post(
          "services/" +
            serviceLink +
            this.$sessionVars.tokenName +
            "=" +
            encodeURIComponent(this.$sessionVars.tokenValue),
          JSON.stringify(this.objFormat)
        )
        .catch(error => {
          console.log("en erreur");
        });
    },
    submitFile(fileUpped) {
      let formData = new FormData();
      formData.append("FileUpload", fileUpped);
      // Verification faite à l'arrache... Prévoir de faire ça... mieux
      console.log("emit");

      this.postFile(formData, this.question.id);
    },

    /*
        Handles a change on the file upload
      */
    handleFileUpload() {
      for (const file of this.$refs.fileattachment.$refs.input.files) {
        if (file.size <= this.sizeLimit) {
          this.file = file;
          this.submitFile(file);
        } else {
          this.sizeWarning = true;
        }
      }
    },
    warnOff() {
      this.sizeWarning = false;
    }
  },
  mounted() {
    if (this.savedElements.length != 0) {
      this.savedElements.forEach(element => {
        if (element.attachName.French == this.label) {
          this.saved = true;
        }
      });
    }
  }
};
</script>
<style lang="scss">
div.v-text-field > .v-input__control > .v-input__slot::after {
  border-style: none;
}
.theme--light.v-text-field > .v-input__control > .v-input__slot::before {
  border-color: #bb1515;
}
</style>
