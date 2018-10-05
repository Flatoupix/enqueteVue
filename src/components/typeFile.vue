<template>
  <div>
    <file-pond :server="sessionVars.urlLocation + sessionVars.servicePath+ 'attachment?'+
    sessionVars.tokenName + '=' +encodeURIComponent(sessionVars.tokenValue) +
    '&q='+question.id" name="FileUpload" ref="pond" label-idle="Déposez vos
    fichiers ici..." allow-multiple="true" />
  </div>
</template>
<script>
import vueFilePond from "vue-filepond";

import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";

export default {
  props: {
    question: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    vueFilePond: vueFilePond(
      FilePondPluginFileValidateType,
      FilePondPluginImagePreview
    )
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
