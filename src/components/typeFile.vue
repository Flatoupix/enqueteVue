<template>
  <div>
    <file-pond  name="FileUpload" ref="pond" label-idle="Déposez vos
    fichiers ici..." allow-multiple="true" />
  </div>
</template>
<script>
import vueFilePond, { setOptions } from "vue-filepond";

import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";

const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview
);

export default {
  props: {
    question: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    FilePond
  },
  methods: {},
  mounted() {
    setOptions({
      server: {
        url:
          this.sessionVars.urlLocation +
          this.sessionVars.servicePath +
          "attachment?" +
          this.sessionVars.tokenName +
          "=" +
          encodeURIComponent(this.sessionVars.tokenValue) +
          "&q=" +
          this.question.id,
        headers: {
          "x-customheader": "Coucou les copains"
        }
      }
    });
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
