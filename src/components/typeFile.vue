<template>
  <div id="fileUpload">
    <VueUploadComponent ref="upload" v-model="files" @input-file="inputFile" @input-filter="inputFilter">
      Envoyer un fichier
    </VueUploadComponent>
  </div>
</template>
<script>
import VueUploadComponent from "vue-upload-component";

export default {
  props: {
    question: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      files: null
    };
  },
  components: {
    VueUploadComponent
  },
  methods: {
    select(inputFile) {
      this.files = inputFile;

      this.$emit("responseInput", {
        idQuestion: this.question.id,
        value: inputFile
      });
    },
    inputFile: function(newFile, oldFile) {
      if (newFile && oldFile && !newFile.active && oldFile.active) {
        // Get response data
        console.log("response", newFile.response);
        if (newFile.xhr) {
          //  Get the response status code
          console.log("status", newFile.xhr.status);
        }
      }
    },

    inputFilter: function(newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        // Filter non-image file
        if (!/\.(jpeg|jpe|jpg|gif|png|webp)$/i.test(newFile.name)) {
          return prevent();
        }
      }

      // Create a blob field
      newFile.blob = "";
      let URL = window.URL || window.webkitURL;
      if (URL && URL.createObjectURL) {
        newFile.blob = URL.createObjectURL(newFile.file);
      }
    }
  }
};
</script>
<style>
div#fileUpload {
  color: white;
  background-color: #bb1515;
  width: 10em;
  height: 2em;
  line-height: 2em;
  margin: 1em auto;
}
div#fileUpload label {
  cursor: pointer;
}
</style>
